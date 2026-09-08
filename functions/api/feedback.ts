interface FeedbackEnvironment {
  FEEDBACK_DB?: D1Database;
}

interface FeedbackBody {
  kind?: unknown;
  message?: unknown;
  contactEmail?: unknown;
  appVersion?: unknown;
  platform?: unknown;
  architecture?: unknown;
  website?: unknown;
}

const responseHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Cache-Control': 'no-store',
  'Content-Type': 'application/json; charset=utf-8',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: responseHeaders });
}

function text(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

async function sourceHash(request: Request) {
  const source = request.headers.get('CF-Connecting-IP') || 'unknown';
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(`baelix-feedback:${source}`),
  );
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

export const onRequestOptions: PagesFunction<FeedbackEnvironment> = async () =>
  new Response(null, { status: 204, headers: responseHeaders });

export const onRequestPost: PagesFunction<FeedbackEnvironment> = async ({ request, env }) => {
  if (!env.FEEDBACK_DB) {
    return json({ message: 'The BAELIX feedback inbox is being connected. Please try again shortly.' }, 503);
  }

  const declaredSize = Number(request.headers.get('Content-Length') || 0);
  if (declaredSize > 16_000) return json({ message: 'That feedback message is too large.' }, 413);

  let body: FeedbackBody;
  try {
    body = await request.json<FeedbackBody>();
  } catch {
    return json({ message: 'The feedback request was not valid.' }, 400);
  }

  if (text(body.website, 100)) return json({ message: 'Feedback received.' });

  const kind = text(body.kind, 20);
  const message = text(body.message, 6000);
  const contactEmail = text(body.contactEmail, 254);
  const appVersion = text(body.appVersion, 40) || 'unknown';
  const platform = text(body.platform, 40) || null;
  const architecture = text(body.architecture, 40) || null;

  if (!['bug', 'idea', 'compliment'].includes(kind)) {
    return json({ message: 'Choose problem, idea, or compliment before sending.' }, 400);
  }
  if (message.length < 10) return json({ message: 'Please add a little more detail.' }, 400);
  if (contactEmail && (!contactEmail.includes('@') || contactEmail.startsWith('@') || contactEmail.endsWith('@'))) {
    return json({ message: 'Enter a valid contact email or leave it blank.' }, 400);
  }

  const fingerprint = await sourceHash(request);
  const recent = await env.FEEDBACK_DB.prepare(
    "SELECT COUNT(*) AS total FROM feedback WHERE source_hash = ? AND created_at > datetime('now', '-1 hour')",
  )
    .bind(fingerprint)
    .first<{ total: number }>();
  if ((recent?.total || 0) >= 5) {
    return json({ message: 'You have sent several messages recently. Please try again in an hour.' }, 429);
  }

  const id = `BLX-${crypto.randomUUID().split('-')[0].toUpperCase()}`;
  await env.FEEDBACK_DB.prepare(
    `INSERT INTO feedback
      (id, kind, message, contact_email, app_version, platform, architecture, source_hash)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(id, kind, message, contactEmail || null, appVersion, platform, architecture, fingerprint)
    .run();

  return json({
    id,
    message: 'It is now in the private BAELIX feedback inbox.',
  }, 201);
};

export const onRequestGet: PagesFunction<FeedbackEnvironment> = async () =>
  json({ message: 'Method not allowed.' }, 405);
