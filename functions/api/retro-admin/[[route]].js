// 응답하라 1980 관리 API (Cloudflare Pages Functions)
//
// 비밀값은 모두 Cloudflare Pages 환경 변수에 둔다. 브라우저에는 로그인 쿠키만 간다.
//   ADMIN_ID, ADMIN_PASSWORD        관리자 로그인 정보
//   SUPABASE_SERVICE_ROLE_KEY       메뉴·문구·이미지 저장용 (Supabase > Project Settings > API Keys의 secret key)
//   FIREBASE_SERVICE_ACCOUNT        (선택) 방명록 관리용 서비스 계정 JSON. 없으면 공개 API 키로 시도한다.

const SUPABASE_URL = 'https://rcciivtbucjtrhzgeyds.supabase.co';
const FIREBASE_PROJECT = 'my-projects-b1173';
const FIREBASE_API_KEY = 'AIzaSyDSkNCvrW_6z5A68Fe4ojSHNM6DUMqrnrk';
const IMAGE_BUCKET = 'retro_assets';
const COOKIE = 'retro_admin';
const SESSION_SECONDS = 12 * 60 * 60;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const GUESTBOOKS = {
    guestbook80s: '80s 골목길',
    guestbook_school_80s: '80s 국민학교',
    guestbook_store_80s: '80s 문방구',
    guestbook_news_80s: '80s 독자 투고',
    guestbook_prompts: '80s 추억의 한마디',
    guestbook_media_80s: '80s 시청자 참여',
    guestbook_reunion_80s: '80s 만남의 광장',
    guestbook_noir_80s: '80s 비디오 대여점',
    guestbook_sound_80s: '80s 별밤 사연',
    guestbook_visual_80s: '80s 만화방 낙서장',
    guestbook_fashion_80s: '80s 패션 게시판',
    guestbook_arcade_80s: '80s 오락실',
    guestbook_street_80s: '80s 동네 골목',
    guestbook_eating_80s: '80s 경양식집',
    guestbook_alley_90s: '90s 골목길',
    guestbook_school_90s: '90s 교실 풍경',
    guestbook_store_90s: '90s 문방구',
    guestbook_news_90s: '90s 그 시절 뉴스',
    guestbook_prompts_90s: '90s 가상 복원실',
    guestbook_basketball_90s: '90s 농구대잔치',
    guestbook_sitcom_90s: '90s 시트콤',
    guestbook_society_90s: '90s 사회/이슈',
    guestbook_indie_90s: '90s 인디 밴드',
    guestbook_hobbies_90s: '90s 취미 생활',
    guestbook_trends_90s: '90s 유행과 수집',
    guestbook_games_00s: '00s 게임 대기실',
    guestbook_music_00s: '00s 뮤직 박스',
    guestbook_tech_00s: '00s 얼리어답터',
    guestbook_society_00s: '00s 붉은 악마',
};

const encoder = new TextEncoder();

function json(body, status = 200, headers = {}) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers },
    });
}

const fail = (status, message) => json({ error: message }, status);

// ---------- 로그인 세션: 만료시각.HMAC 서명 쿠키 ----------

async function sessionKey(env) {
    const material = encoder.encode(`retro-admin|${env.ADMIN_ID}|${env.ADMIN_PASSWORD}|${env.SUPABASE_SERVICE_ROLE_KEY || ''}`);
    const digest = await crypto.subtle.digest('SHA-256', material);
    return crypto.subtle.importKey('raw', digest, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

const toB64url = bytes => btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const fromB64url = text => Uint8Array.from(atob(text.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));

async function makeSession(env) {
    const expires = String(Math.floor(Date.now() / 1000) + SESSION_SECONDS);
    const sig = await crypto.subtle.sign('HMAC', await sessionKey(env), encoder.encode(expires));
    return `${expires}.${toB64url(sig)}`;
}

async function validSession(request, env) {
    const cookie = request.headers.get('Cookie') || '';
    const match = cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE}=([0-9]+)\\.([A-Za-z0-9_-]+)`));
    if (!match) return false;
    const [, expires, sig] = match;
    if (Number(expires) < Date.now() / 1000) return false;
    try {
        return await crypto.subtle.verify('HMAC', await sessionKey(env), fromB64url(sig), encoder.encode(expires));
    } catch {
        return false;
    }
}

function sessionCookie(value, maxAge) {
    return `${COOKIE}=${value}; Path=/api/retro-admin; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;
}

async function sameText(a, b) {
    // 길이와 내용이 드러나지 않게 해시끼리 비교한다.
    const [ha, hb] = await Promise.all([a, b].map(v => crypto.subtle.digest('SHA-256', encoder.encode(String(v)))));
    const x = new Uint8Array(ha), y = new Uint8Array(hb);
    let diff = 0;
    for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
    return diff === 0;
}

// ---------- Supabase ----------

function supabase(env, path, init = {}) {
    const key = env.SUPABASE_SERVICE_ROLE_KEY;
    const headers = { apikey: key, ...init.headers };
    // 예전 형식(JWT) 키는 Authorization 헤더도 필요하다.
    if (key.startsWith('eyJ')) headers.Authorization = `Bearer ${key}`;
    return fetch(`${env.SUPABASE_URL || SUPABASE_URL}${path}`, { ...init, headers });
}

async function supabaseJson(env, path, init) {
    const res = await supabase(env, path, init);
    const text = await res.text();
    if (!res.ok) throw new Error(`Supabase ${res.status}: ${text.slice(0, 200)}`);
    return text ? JSON.parse(text) : null;
}

const jsonBody = body => ({
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Prefer: 'return=representation' },
    body: JSON.stringify(body),
});

// ---------- Firestore (방명록) ----------

const firestoreBase = env => env.FIRESTORE_BASE || `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT}/databases/(default)/documents`;

let cachedToken = null;

async function firebaseAuth(env) {
    if (!env.FIREBASE_SERVICE_ACCOUNT) return { query: `key=${FIREBASE_API_KEY}`, headers: {} };
    if (cachedToken && cachedToken.expires > Date.now() + 60_000) {
        return { query: '', headers: { Authorization: `Bearer ${cachedToken.value}` } };
    }
    const account = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT);
    const now = Math.floor(Date.now() / 1000);
    const part = obj => toB64url(encoder.encode(JSON.stringify(obj)));
    const unsigned = `${part({ alg: 'RS256', typ: 'JWT' })}.${part({
        iss: account.client_email,
        scope: 'https://www.googleapis.com/auth/datastore',
        aud: 'https://oauth2.googleapis.com/token',
        iat: now,
        exp: now + 3600,
    })}`;
    const pem = account.private_key.replace(/-----[^-]+-----|\s/g, '');
    const key = await crypto.subtle.importKey('pkcs8', fromB64url(pem.replace(/\+/g, '-').replace(/\//g, '_')),
        { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
    const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, encoder.encode(unsigned));
    const res = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${unsigned}.${toB64url(signature)}`,
    });
    const token = await res.json();
    if (!res.ok) throw new Error(`Google 인증 실패: ${token.error || res.status}`);
    cachedToken = { value: token.access_token, expires: Date.now() + token.expires_in * 1000 };
    return { query: '', headers: { Authorization: `Bearer ${cachedToken.value}` } };
}

async function firestore(env, path, init = {}) {
    const auth = await firebaseAuth(env);
    const sep = path.includes('?') ? '&' : '?';
    const res = await fetch(`${firestoreBase(env)}/${path}${auth.query ? sep + auth.query : ''}`, {
        ...init,
        headers: { ...auth.headers, ...init.headers },
    });
    const text = await res.text();
    if (!res.ok) throw new Error(`Firestore ${res.status}: ${text.slice(0, 200)}`);
    return text ? JSON.parse(text) : null;
}

async function listGuestbook(env, collection) {
    const docs = [];
    let token = '';
    do {
        const page = await firestore(env, `${collection}?pageSize=300${token ? `&pageToken=${encodeURIComponent(token)}` : ''}`);
        docs.push(...(page?.documents || []));
        token = page?.nextPageToken || '';
    } while (token);
    return docs.map(doc => ({
        id: doc.name.split('/').pop(),
        name: doc.fields?.name?.stringValue ?? '',
        text: doc.fields?.text?.stringValue ?? '',
        date: doc.fields?.date?.stringValue ?? '',
        time: doc.fields?.timestamp?.timestampValue ?? doc.createTime,
    })).sort((a, b) => String(b.time).localeCompare(String(a.time)));
}

// ---------- 라우팅 ----------

export async function onRequest(context) {
    const { request, env, params } = context;
    const route = (params.route || []).map(decodeURIComponent);
    const method = request.method;
    const configured = {
        login: Boolean(env.ADMIN_ID && env.ADMIN_PASSWORD),
        supabase: Boolean(env.SUPABASE_SERVICE_ROLE_KEY),
        firebaseAccount: Boolean(env.FIREBASE_SERVICE_ACCOUNT),
    };

    if (method !== 'GET') {
        // 다른 사이트에서 보낸 요청을 막는다.
        const origin = request.headers.get('Origin');
        if (!origin || new URL(origin).host !== new URL(request.url).host || request.headers.get('X-Retro-Admin') !== '1') {
            return fail(403, '허용되지 않은 요청입니다.');
        }
    }

    if (route[0] === 'status' && method === 'GET') {
        return json({ configured, loggedIn: configured.login && await validSession(request, env) });
    }

    if (!configured.login) return fail(503, '관리자 아이디와 비밀번호가 아직 설정되지 않았습니다.');

    if (route[0] === 'login' && method === 'POST') {
        const { id = '', password = '' } = await request.json().catch(() => ({}));
        const ok = (await sameText(id, env.ADMIN_ID)) & (await sameText(password, env.ADMIN_PASSWORD));
        if (!ok) {
            await new Promise(r => setTimeout(r, 600));
            return fail(401, '아이디 또는 비밀번호가 맞지 않습니다.');
        }
        return json({ ok: true }, 200, { 'Set-Cookie': sessionCookie(await makeSession(env), SESSION_SECONDS) });
    }

    if (route[0] === 'logout' && method === 'POST') {
        return json({ ok: true }, 200, { 'Set-Cookie': sessionCookie('', 0) });
    }

    if (!(await validSession(request, env))) return fail(401, '로그인이 필요합니다.');

    try {
        // ----- 방명록 -----
        if (route[0] === 'guestbooks') {
            const collection = route[1];
            if (!collection && method === 'GET') {
                const books = await Promise.all(Object.entries(GUESTBOOKS).map(async ([id, label]) => {
                    try {
                        return { id, label, posts: await listGuestbook(env, id) };
                    } catch (err) {
                        return { id, label, posts: [], error: err.message };
                    }
                }));
                return json({ books });
            }
            if (!GUESTBOOKS[collection]) return fail(404, '없는 방명록입니다.');
            if (method === 'DELETE' && route[2]) {
                if (!/^[A-Za-z0-9]{1,64}$/.test(route[2])) return fail(400, '잘못된 글 번호입니다.');
                await firestore(env, `${collection}/${route[2]}`, { method: 'DELETE' });
                return json({ ok: true });
            }
            if (method === 'DELETE') {
                const posts = await listGuestbook(env, collection);
                await Promise.all(posts.map(p => firestore(env, `${collection}/${p.id}`, { method: 'DELETE' })));
                return json({ ok: true, deleted: posts.length });
            }
        }

        // 아래는 Supabase가 필요하다.
        if (!configured.supabase) return fail(503, 'SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다.');

        if (route[0] === 'content' && method === 'GET') {
            const [menu, assets] = await Promise.all([
                supabaseJson(env, '/rest/v1/menu_items?select=*&order=order_index.asc,id.asc'),
                supabaseJson(env, '/rest/v1/site_assets?select=*&order=key.asc'),
            ]);
            return json({ menu, assets });
        }

        if (route[0] === 'menu') {
            const id = Number(route[1]);
            if (method === 'POST' && !route[1]) {
                const body = await request.json();
                const label = String(body.label || '').trim().slice(0, 40);
                const action = String(body.action_id || '').trim();
                if (!label || !/^[a-z0-9_-]{1,40}$/i.test(action)) return fail(400, '메뉴 이름과 Action ID(영문·숫자)를 확인해 주세요.');
                const [row] = await supabaseJson(env, '/rest/v1/menu_items', jsonBody({ label, action_id: action, order_index: Number(body.order_index) || 99 }));
                return json({ row });
            }
            if (!Number.isInteger(id)) return fail(400, '잘못된 메뉴 번호입니다.');
            if (method === 'PATCH') {
                const body = await request.json();
                const patch = {};
                if ('label' in body) patch.label = String(body.label).trim().slice(0, 40);
                if ('is_active' in body) patch.is_active = Boolean(body.is_active);
                if ('order_index' in body) patch.order_index = Number(body.order_index) || 0;
                const [row] = await supabaseJson(env, `/rest/v1/menu_items?id=eq.${id}`, { ...jsonBody(patch), method: 'PATCH' });
                return json({ row });
            }
            if (method === 'DELETE') {
                await supabaseJson(env, `/rest/v1/menu_items?id=eq.${id}`, { method: 'DELETE' });
                return json({ ok: true });
            }
        }

        if (route[0] === 'asset' && route[1]) {
            const key = route[1];
            if (!/^[a-z0-9_]{1,60}$/i.test(key)) return fail(400, '잘못된 항목입니다.');
            if (method === 'PUT') {
                const value = String((await request.json()).value || '').trim();
                if (!value) return fail(400, '내용을 입력해 주세요.');
                const [row] = await supabaseJson(env, '/rest/v1/site_assets?on_conflict=key',
                    { ...jsonBody({ key, value }), headers: { 'Content-Type': 'application/json', Prefer: 'return=representation,resolution=merge-duplicates' } });
                return json({ row });
            }
            if (method === 'POST' && route[2] === 'image') {
                const type = request.headers.get('Content-Type') || '';
                const ext = { 'image/webp': 'webp', 'image/png': 'png', 'image/jpeg': 'jpg', 'image/gif': 'gif' }[type];
                if (!ext) return fail(415, 'WebP, PNG, JPG, GIF 이미지만 올릴 수 있습니다.');
                const file = await request.arrayBuffer();
                if (file.byteLength > MAX_IMAGE_BYTES) return fail(413, '이미지는 5MB 이하만 올릴 수 있습니다.');
                const name = `${key}_${Date.now()}.${ext}`;
                const up = await supabase(env, `/storage/v1/object/${IMAGE_BUCKET}/${name}`, {
                    method: 'POST', headers: { 'Content-Type': type, 'x-upsert': 'true' }, body: file,
                });
                if (!up.ok) return fail(502, `이미지 업로드 실패: ${(await up.text()).slice(0, 200)}`);
                const value = `${env.SUPABASE_URL || SUPABASE_URL}/storage/v1/object/public/${IMAGE_BUCKET}/${name}`;
                const [row] = await supabaseJson(env, `/rest/v1/site_assets?key=eq.${key}`, { ...jsonBody({ value }), method: 'PATCH' });
                return json({ row });
            }
        }
    } catch (err) {
        return fail(502, err.message);
    }

    return fail(404, '없는 기능입니다.');
}
