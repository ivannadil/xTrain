// Print every early-access signup as CSV.
// Needs the store token: `vercel env pull .env.local` once, then
//   node --env-file=.env.local scripts/export-signups.mjs > signups.csv
import { list, get } from '@vercel/blob';

const rows = [];
let cursor;
do {
  const page = await list({ prefix: 'signups/', cursor, limit: 1000 });
  for (const b of page.blobs) {
    const r = await get(b.pathname, { access: 'private', useCache: false });
    const text = await new Response(r.stream).text();
    rows.push(JSON.parse(text));
  }
  cursor = page.hasMore ? page.cursor : undefined;
} while (cursor);

rows.sort((a, b) => a.at.localeCompare(b.at));
const cols = ['at', 'email', 'position', 'level', 'minutes', 'kit', 'source', 'step'];
console.log(cols.join(','));
for (const r of rows) console.log(cols.map((c) => JSON.stringify(Array.isArray(r[c]) ? r[c].join(' ') : r[c] ?? '')).join(','));
