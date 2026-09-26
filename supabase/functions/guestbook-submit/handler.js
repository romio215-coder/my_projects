import boards from '../../../retro-1980/guestbook-boards.json' with { type: 'json' };

export function createHandler(env, requestFetch = fetch) {
    const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(value => value.trim()).filter(Boolean);
    return async request => {
        const origin = request.headers.get('origin');
        const headers = { 'Content-Type': 'application/json', 'Vary': 'Origin' };
        if (allowed.includes(origin)) {
            headers['Access-Control-Allow-Origin'] = origin;
            headers['Access-Control-Allow-Headers'] = 'authorization, apikey, content-type, x-client-info';
            headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS';
        }
        const respond = (status, message) => new Response(JSON.stringify({ message }), { status, headers });
        if (!allowed.includes(origin)) return respond(403, 'Origin not allowed');
        if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
        if (request.method !== 'POST') return respond(405, 'Method not allowed');
        if (!env.TURNSTILE_SECRET_KEY || !env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
            return respond(503, 'Guestbook unavailable');
        }
        if (!request.headers.get('content-type')?.startsWith('application/json')) return respond(415, 'JSON required');
        // Read a bounded stream; Content-Length alone is controlled by the caller.
        const reader = request.body?.getReader();
        if (!reader) return respond(400, 'Invalid request');
        let size = 0;
        const chunks = [];
        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                size += value.byteLength;
                if (size > 16384) { await reader.cancel(); return respond(413, 'Request too large'); }
                chunks.push(value);
            }
        } catch { return respond(400, 'Invalid request'); }
        let input;
        try { input = JSON.parse(await new Blob(chunks).text()); } catch { return respond(400, 'Invalid JSON'); }
        if (!input || !boards.includes(input.board) || typeof input.name !== 'string' || typeof input.text !== 'string'
            || typeof input.token !== 'string' || !input.token || input.token.length > 2048) return respond(400, 'Invalid fields');
        const name = input.name.trim(), text = input.text.trim();
        if (!name || !text || [...name].length > 20 || [...text].length > 1000 || /\u0000/.test(name + text)) {
            return respond(400, 'Invalid length');
        }
        try {
            const verified = await requestFetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: input.token }),
                signal: AbortSignal.timeout(10000)
            });
            if (!verified.ok) return respond(503, 'Verification unavailable');
            const result = await verified.json();
            if (result.success !== true || result.action !== 'guestbook' || result.hostname !== new URL(origin).hostname) {
                return respond(403, 'Verification failed');
            }
            const stored = await requestFetch(`${env.SUPABASE_URL}/rest/v1/rpc/submit_guestbook_entry`, {
                method: 'POST', headers: { 'Content-Type': 'application/json',
                    apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` },
                body: JSON.stringify({ p_board: input.board, p_name: name, p_text: text }),
                signal: AbortSignal.timeout(10000)
            });
            if (!stored.ok) {
                const error = await stored.json().catch(() => ({}));
                return respond(error.code === 'P0001' ? 429 : 503, 'Unable to save');
            }
            return respond(201, 'Saved');
        } catch { return respond(503, 'Guestbook unavailable'); }
    };
}
