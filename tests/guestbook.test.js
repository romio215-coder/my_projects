import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { PGlite } from '@electric-sql/pglite';
import { createHandler } from '../supabase/functions/guestbook-submit/handler.js';
import { prepareImport } from '../scripts/import-guestbook.js';

const source = readFileSync(new URL('../retro-1980/guestbook.js', import.meta.url), 'utf8');
const html = readFileSync(new URL('../retro-1980/index.html', import.meta.url), 'utf8');
const boards = JSON.parse(readFileSync(new URL('../retro-1980/guestbook-boards.json', import.meta.url)));
const env = { ALLOWED_ORIGINS: 'https://example.com', TURNSTILE_SECRET_KEY: 'server-only',
    SUPABASE_URL: 'https://db.example.com', SUPABASE_SERVICE_ROLE_KEY: 'server-role' };
const payload = { board: boards[0], name: '이름', text: '추억', token: 'token' };
function request(body = payload, headers = {}) {
    return new Request('https://edge.example.com', { method: 'POST',
        headers: { origin: 'https://example.com', 'content-type': 'application/json', ...headers }, body: JSON.stringify(body) });
}
const json = (value, status = 200) => new Response(JSON.stringify(value), { status });

test('legacy imports preserve dates and HTML literally, reject bad rows and use stable IDs', () => {
    const doc = { id: 'original', name: '<b>이름</b>', text: '<img src=x onerror=alert(1)>', date: '2026.09.08', timestamp: { _seconds: 1788825600 } };
    const rows = prepareImport({ [boards[0]]: [doc] });
    assert.equal(rows[0].text, doc.text);
    assert.equal(rows[0].legacy_id, `${boards[0]}/original`);
    assert.equal(rows[0].created_at, new Date(1788825600000).toISOString());
    assert.deepEqual(rows, prepareImport({ [boards[0]]: [doc] }));
    assert.throws(() => prepareImport({ [boards[0]]: [doc, doc] }), /duplicate/);
    assert.throws(() => prepareImport({ [boards[0]]: [{ ...doc, text: 'x'.repeat(1001) }] }), /Invalid/);
    assert.throws(() => prepareImport({ [boards[0]]: [{ ...doc, timestamp: null }] }), /timestamp/);
    assert.throws(() => prepareImport({ unknown: [doc] }), /Unknown/);
});

test('all 29 forms are wired to unique existing elements and no Firebase remains', () => {
    const dom = new JSDOM(html, { runScripts: 'outside-only' });
    const configs = [];
    dom.window.RetroGuestbook = { register: config => configs.push(config) };
    for (const script of dom.window.document.scripts) {
        if (script.textContent.startsWith('RetroGuestbook.register(')) dom.window.eval(script.textContent);
        else if (!script.src && !script.type && script.textContent.trim()) new Function(script.textContent);
    }
    assert.equal(configs.length, 29);
    assert.equal(new Set(configs.map(c => c.board)).size, 29);
    assert.equal(/firebase|db\.collection|\$\{data\.(name|text|date)\}/i.test(html), false);
    for (const config of configs) {
        for (const id of [config.list, config.name, config.message]) assert.ok(dom.window.document.getElementById(id), id);
        assert.equal(dom.window.document.querySelectorAll(`[onclick="${config.handler}()"]`).length, 1);
    }
    dom.window.close();
});

test('hostile names, messages and legacy dates stay literal text', () => {
    const dom = new JSDOM('<div id="list"></div>', { runScripts: 'outside-only' });
    dom.window.eval(source);
    const list = dom.window.document.getElementById('list');
    const attack = '<img src=x onerror="window.pwned=1"><script>alert(1)</script>';
    dom.window.RetroGuestbook.render(list, [{ name: attack, text: attack, legacy_date: attack }]);
    assert.equal(list.querySelectorAll('img,script').length, 0);
    assert.equal(list.textContent, attack.repeat(3));
    assert.equal(dom.window.pwned, undefined);
    dom.window.close();
});

test('failed saves preserve text and repeated clicks do not duplicate requests', async () => {
    const dom = new JSDOM('<input id="name"><textarea id="msg"></textarea><button onclick="save()">save</button><div id="list"></div>', { runScripts: 'outside-only' });
    dom.window.eval(source);
    let callback, finish, calls = 0;
    dom.window.turnstile = { render: (_, options) => { callback = options.callback; return 0; }, reset() {} };
    const query = { select() { return this; }, eq() { return this; }, order() { return this; }, async limit() { return { data: [] }; } };
    const client = { from: () => query, functions: { invoke() { calls++; return new Promise(resolve => { finish = resolve; }); } } };
    dom.window.RetroGuestbook.register({ board: boards[0], list: 'list', name: 'name', message: 'msg', handler: 'save' });
    await dom.window.RetroGuestbook.start(client, { sitekey: 'public-key' });
    const name = dom.window.document.getElementById('name'), msg = dom.window.document.getElementById('msg');
    name.value = '이름'; msg.value = '보존할 추억';
    msg.dispatchEvent(new dom.window.Event('focus')); callback('valid-token');
    const button = dom.window.document.querySelector('button');
    button.click(); button.click(); assert.equal(calls, 1);
    finish({ error: new Error('offline') });
    await new Promise(resolve => setTimeout(resolve, 0));
    assert.equal(msg.value, '보존할 추억'); assert.equal(name.value, '이름'); assert.equal(button.disabled, false);
    dom.window.close();
});

test('invalid origin, board, length, token and oversized payload never reach verification or DB', async () => {
    const handler = createHandler(env, () => { throw new Error('Must not fetch'); });
    for (const body of [{ ...payload, board: 'unknown' }, { ...payload, name: 'x'.repeat(21) }, { ...payload, text: 'x'.repeat(1001) }, { ...payload, token: '' }, null]) {
        assert.equal((await handler(request(body))).status, 400);
    }
    assert.equal((await handler(request(payload, { origin: 'https://evil.example' }))).status, 403);
    assert.equal((await handler(request({ ...payload, text: 'x'.repeat(17000) }))).status, 413);
});

test('failed, wrong-action and wrong-host CAPTCHA cannot write; outages fail closed', async () => {
    for (const result of [{ success: false }, { success: true, hostname: 'evil.example', action: 'guestbook' }, { success: true, hostname: 'example.com', action: 'login' }]) {
        let calls = 0;
        const handler = createHandler(env, async () => { calls++; return json(result); });
        assert.equal((await handler(request())).status, 403); assert.equal(calls, 1);
    }
    assert.equal((await createHandler(env, async () => { throw new Error('timeout'); })(request())).status, 503);
    assert.equal((await createHandler({ ...env, TURNSTILE_SECRET_KEY: '' })(request())).status, 503);
});

test('verified submission forwards only accepted fields to service-only RPC; DB rate errors are 429', async () => {
    for (const limited of [false, true]) {
        const calls = [];
        const handler = createHandler(env, async (url, options) => {
            calls.push({ url, body: JSON.parse(options.body) });
            if (calls.length === 1) return json({ success: true, hostname: 'example.com', action: 'guestbook' });
            return limited ? json({ code: 'P0001' }, 400) : json(null);
        });
        assert.equal((await handler(request({ ...payload, created_at: '2099-01-01', id: 1 }))).status, limited ? 429 : 201);
        assert.deepEqual(calls[1].body, { p_board: boards[0], p_name: '이름', p_text: '추억' });
    }
});

test('PostgreSQL RLS, RPC permissions, constraints, ordering and 30/minute board limit', async () => {
    const db = new PGlite();
    try {
        await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS;
            CREATE SCHEMA auth; GRANT USAGE ON SCHEMA auth TO anon, authenticated;
            CREATE FUNCTION auth.jwt() RETURNS jsonb LANGUAGE sql AS $$ SELECT coalesce(nullif(current_setting('test.jwt', true), ''), '{}')::jsonb $$;`);
        const sql = readFileSync(new URL('../supabase/guestbook.sql', import.meta.url), 'utf8');
        await db.exec(sql); await db.exec(sql); // Idempotent setup.
        await db.exec('SET ROLE anon');
        assert.deepEqual((await db.query('SELECT * FROM public.guestbook_entries')).rows, []);
        await assert.rejects(db.exec("INSERT INTO public.guestbook_entries(board,name,text) VALUES ('guestbook80s','a','b')"), /permission denied/);
        await assert.rejects(db.exec("SELECT public.submit_guestbook_entry('guestbook80s','a','b')"), /permission denied/);
        await db.exec('RESET ROLE; SET ROLE service_role');
        await assert.rejects(db.exec("SELECT public.submit_guestbook_entry('guestbook80s','','b')"), /check constraint/);
        for (let i = 0; i < 30; i++) await db.query('SELECT public.submit_guestbook_entry($1,$2,$3)', [boards[0], '이름', `추억 ${i}`]);
        await assert.rejects(db.query('SELECT public.submit_guestbook_entry($1,$2,$3)', [boards[0], '이름', '한도 초과']), /rate limit/);
        await db.exec("RESET ROLE; SET ROLE authenticated; DELETE FROM public.guestbook_entries");
        assert.equal((await db.query('SELECT count(*)::int AS n FROM public.guestbook_entries')).rows[0].n, 30);
        await db.exec(`SET test.jwt = '{"app_metadata":{"role":"admin"}}'; DELETE FROM public.guestbook_entries`);
        assert.equal((await db.query('SELECT count(*)::int AS n FROM public.guestbook_entries')).rows[0].n, 0);
    } finally { await db.close(); }
});
