interface InboxEnvironment {
  FEEDBACK_DB?: D1Database;
  FEEDBACK_ADMIN_KEY?: string;
}

interface StatusUpdate {
  id?: unknown;
  status?: unknown;
}

const jsonHeaders = {
  'Cache-Control': 'no-store',
  'Content-Type': 'application/json; charset=utf-8',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: jsonHeaders });
}

async function digest(value: string) {
  return new Uint8Array(
    await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)),
  );
}

async function authorized(request: Request, env: InboxEnvironment) {
  const expected = env.FEEDBACK_ADMIN_KEY || '';
  const authorization = request.headers.get('Authorization') || '';
  const supplied = authorization.startsWith('Bearer ')
    ? authorization.slice(7).trim()
    : '';
  if (!expected || !supplied) return false;
  const [left, right] = await Promise.all([digest(expected), digest(supplied)]);
  let difference = left.length ^ right.length;
  for (let index = 0; index < Math.max(left.length, right.length); index += 1) {
    difference |= (left[index] || 0) ^ (right[index] || 0);
  }
  return difference === 0;
}

async function requireInbox(request: Request, env: InboxEnvironment) {
  if (!env.FEEDBACK_DB) return json({ message: 'The feedback database is unavailable.' }, 503);
  if (!(await authorized(request, env))) return json({ message: 'The inbox key is not valid.' }, 401);
  return null;
}

export const onRequestGet: PagesFunction<InboxEnvironment> = async ({ request, env }) => {
  const denied = await requireInbox(request, env);
  if (denied) return denied;

  const result = await env.FEEDBACK_DB!.prepare(
    `SELECT id, kind, message, contact_email AS contactEmail,
            app_version AS appVersion, platform, architecture, status,
            created_at AS createdAt
     FROM feedback
     ORDER BY created_at DESC
     LIMIT 250`,
  ).all();

  return json({ feedback: result.results || [] });
};

export const onRequestPatch: PagesFunction<InboxEnvironment> = async ({ request, env }) => {
  const denied = await requireInbox(request, env);
  if (denied) return denied;

  let body: StatusUpdate;
  try {
    body = await request.json<StatusUpdate>();
  } catch {
    return json({ message: 'The update was not valid.' }, 400);
  }

  const id = typeof body.id === 'string' ? body.id.trim().slice(0, 40) : '';
  const status = typeof body.status === 'string' ? body.status.trim() : '';
  if (!id || !['new', 'reviewing', 'resolved', 'archived'].includes(status)) {
    return json({ message: 'Choose a valid feedback status.' }, 400);
  }

  const result = await env.FEEDBACK_DB!.prepare(
    'UPDATE feedback SET status = ? WHERE id = ?',
  ).bind(status, id).run();
  if (!result.meta.changes) return json({ message: 'Feedback was not found.' }, 404);

  return json({ id, status });
};

