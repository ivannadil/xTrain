// Early-access signups. Each signup is one private JSON object in the
// project's Vercel Blob store (BLOB_READ_WRITE_TOKEN is set by Vercel when
// the store is connected). List them with `node scripts/export-signups.mjs`.
import { put } from '@vercel/blob';

const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/;
const POSITIONS = new Set(['keeper', 'defender', 'midfielder', 'forward', 'not sure']);
const LEVELS = new Set(['just starting', 'school team', 'club team', 'academy']);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};
  if (body.company) return res.status(200).json({ ok: true }); // honeypot

  const email = String(body.email || '').trim().toLowerCase();
  if (!EMAIL.test(email)) return res.status(400).json({ error: 'email' });

  const record = {
    email,
    position: POSITIONS.has(body.position) ? body.position : null,
    level: LEVELS.has(body.level) ? body.level : null,
    kit: Array.isArray(body.kit) ? body.kit.filter((k) => ['wall', 'cones', 'goal', 'mate'].includes(k)).slice(0, 4) : [],
    minutes: [15, 30, 45].includes(body.minutes) ? body.minutes : null,
    source: ['hero', 'close', 'nav'].includes(body.source) ? body.source : 'other',
    step: body.step === 2 ? 2 : 1,
    at: new Date().toISOString(),
  };

  if (!process.env.BLOB_READ_WRITE_TOKEN && !process.env.BLOB_STORE_ID) {
    console.error('join: no Blob store is connected to this project');
    return res.status(503).json({ error: 'unavailable' });
  }

  try {
    // One file per email: step two overwrites step one with the extra details.
    const key = Buffer.from(email).toString('base64url');
    await put(`signups/${key}.json`, JSON.stringify(record), {
      access: 'private',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return res.status(201).json({ ok: true });
  } catch (err) {
    console.error('join: blob write failed', err && err.message);
    return res.status(500).json({ error: 'server' });
  }
}
