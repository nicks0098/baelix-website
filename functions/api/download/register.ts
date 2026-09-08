interface DownloadEnvironment {
  FEEDBACK_DB?: D1Database;
}

interface RegistrationBody {
  name?: unknown;
  contactKind?: unknown;
  contact?: unknown;
}

const headers = {
  'Cache-Control': 'no-store',
  'Content-Type': 'application/json; charset=utf-8',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers });
}

function clean(value: unknown, max: number) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

async function hashSource(request: Request) {
  const source = request.headers.get('CF-Connecting-IP') || 'unknown';
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`baelix-download:${source}`));
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export const onRequestPost: PagesFunction<DownloadEnvironment> = async ({ request, env }) => {
  if (!env.FEEDBACK_DB) return json({ message: 'Registration is temporarily unavailable.' }, 503);
  let body: RegistrationBody;
  try { body = await request.json<RegistrationBody>(); }
  catch { return json({ message: 'Enter your details again.' }, 400); }

  const name = clean(body.name, 100);
  const contactKind = clean(body.contactKind, 12);
  const contact = clean(body.contact, 254);
  if (name.length < 2) return json({ message: 'Enter your name.' }, 400);
  if (!['email', 'mobile'].includes(contactKind)) return json({ message: 'Choose email or mobile number.' }, 400);
  if (contactKind === 'email' && (!contact.includes('@') || contact.startsWith('@') || contact.endsWith('@'))) return json({ message: 'Enter a valid email address.' }, 400);
  const phoneDigits = contact.replace(/\D/g, '');
  if (contactKind === 'mobile' && (phoneDigits.length < 7 || phoneDigits.length > 15)) return json({ message: 'Enter a valid mobile number including country code.' }, 400);

  const sourceHash = await hashSource(request);
  const recent = await env.FEEDBACK_DB.prepare("SELECT COUNT(*) AS total FROM download_signups WHERE source_hash = ? AND created_at > datetime('now', '-1 hour')").bind(sourceHash).first<{ total: number }>();
  if ((recent?.total || 0) >= 10) return json({ message: 'Too many download requests. Please try again later.' }, 429);

  const id = `DL-${crypto.randomUUID().split('-')[0].toUpperCase()}`;
  await env.FEEDBACK_DB.prepare('INSERT INTO download_signups (id, name, contact_kind, contact_value, source_hash) VALUES (?, ?, ?, ?, ?)').bind(id, name, contactKind, contact, sourceHash).run();
  return json({ id, downloadUrl: '/api/download/windows' }, 201);
};

export const onRequestGet: PagesFunction<DownloadEnvironment> = async () => json({ message: 'Method not allowed.' }, 405);
