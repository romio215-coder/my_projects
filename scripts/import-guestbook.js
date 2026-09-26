// Input is a UTF-8 JSON object keyed by the 29 legacy collection names. Each
// value is an array of {id,name,text,date,timestamp}, exported by a trusted admin.
// Run without --apply first. This tool never reads or deletes Firebase data.
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import boards from '../retro-1980/guestbook-boards.json' with { type: 'json' };

export function prepareImport(input) {
    const rows = [], seen = new Set();
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Expected collections object');
    for (const [board, docs] of Object.entries(input)) {
        if (!boards.includes(board) || !Array.isArray(docs)) throw new Error(`Unknown collection: ${board}`);
        for (const doc of docs) {
            if (!doc || typeof doc.id !== 'string' || !doc.id || typeof doc.name !== 'string' || typeof doc.text !== 'string') {
                throw new Error(`Invalid document in ${board}`);
            }
            const name = doc.name.trim(), text = doc.text.trim(), legacy_id = `${board}/${doc.id}`;
            if (!name || !text || [...name].length > 20 || [...text].length > 1000 || /\u0000/.test(name + text)
                || seen.has(legacy_id) || (doc.date != null && (typeof doc.date !== 'string' || [...doc.date].length > 100))) {
                throw new Error(`Invalid or duplicate document: ${legacy_id}; review it before importing`);
            }
            seen.add(legacy_id);
            const stamp = doc.timestamp;
            const seconds = stamp && typeof stamp === 'object' ? (stamp.seconds ?? stamp._seconds) : undefined;
            const value = typeof seconds === 'number' ? seconds * 1000 : (typeof stamp === 'string' ? stamp : NaN);
            const date = new Date(value);
            if (!Number.isFinite(date.getTime())) throw new Error(`Missing/invalid timestamp: ${legacy_id}`);
            rows.push({ board, name, text, legacy_id, legacy_date: doc.date ?? null, created_at: date.toISOString() });
        }
    }
    return rows;
}
async function main() {
    const file = process.argv[2];
    if (!file || file.startsWith('--')) throw new Error('Usage: node scripts/import-guestbook.js export.local.json [--apply]');
    const rows = prepareImport(JSON.parse(readFileSync(file, 'utf8')));
    console.log(`Validated ${rows.length} entries. No contents or credentials are logged.`);
    if (!process.argv.includes('--apply')) { console.log('Dry run only; no remote changes.'); return; }
    const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || new URL(url).protocol !== 'https:' || !key) throw new Error('Set HTTPS SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    for (let index = 0; index < rows.length; index += 100) {
        const response = await fetch(`${url}/rest/v1/guestbook_entries?on_conflict=legacy_id`, {
            method: 'POST', headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json',
                Prefer: 'resolution=ignore-duplicates,return=minimal' },
            body: JSON.stringify(rows.slice(index, index + 100)), signal: AbortSignal.timeout(30000)
        });
        if (!response.ok) throw new Error(`Import stopped at batch ${index / 100 + 1} (HTTP ${response.status}); rerun safely after fixing the error`);
    }
    console.log('Import complete. Existing legacy IDs were not overwritten.');
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
