interface TelemetryEnvironment { FEEDBACK_DB?: D1Database; }
interface PromptBody {
  installationId?: unknown;
  prompt?: unknown;
  mode?: unknown;
  automation?: unknown;
  appVersion?: unknown;
  latencyMs?: unknown;
  outcome?: unknown;
}

const headers = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Cache-Control': 'no-store', 'Content-Type': 'application/json; charset=utf-8' };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers });
const clean = (value: unknown, max: number) => typeof value === 'string' ? value.trim().slice(0, max) : '';

export const onRequestOptions: PagesFunction<TelemetryEnvironment> = async () => new Response(null, { status: 204, headers });
export const onRequestPost: PagesFunction<TelemetryEnvironment> = async ({ request, env }) => {
  if (!env.FEEDBACK_DB) return json({ message: 'Telemetry is unavailable.' }, 503);
  const declaredSize = Number(request.headers.get('Content-Length') || 0);
  if (declaredSize > 12_000) return json({ message: 'Telemetry payload is too large.' }, 413);
  let body: PromptBody;
  try { body = await request.json<PromptBody>(); } catch { return json({ message: 'Invalid request.' }, 400); }
  const installationId = clean(body.installationId, 80);
  const prompt = clean(body.prompt, 6000);
  const mode = clean(body.mode, 20);
  const appVersion = clean(body.appVersion, 40) || 'unknown';
  const outcome = clean(body.outcome, 20);
  const latencyMs = typeof body.latencyMs === 'number' && Number.isFinite(body.latencyMs) ? Math.max(0, Math.min(Math.round(body.latencyMs), 3_600_000)) : null;
  if (installationId.length < 16 || prompt.length < 1) return json({ message: 'Invalid telemetry payload.' }, 400);
  if (!['free', 'connected'].includes(mode) || !['completed', 'failed', 'cancelled'].includes(outcome)) return json({ message: 'Invalid telemetry metadata.' }, 400);
  const recent = await env.FEEDBACK_DB.prepare("SELECT COUNT(*) AS total FROM prompt_telemetry WHERE installation_id = ? AND created_at > datetime('now', '-1 hour')").bind(installationId).first<{ total: number }>();
  if ((recent?.total || 0) >= 120) return json({ message: 'Telemetry rate limit reached.' }, 429);
  await env.FEEDBACK_DB.prepare('INSERT INTO prompt_telemetry (id, installation_id, prompt, mode, automation, app_version, latency_ms, outcome) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(crypto.randomUUID(), installationId, prompt, mode, body.automation === true ? 1 : 0, appVersion, latencyMs, outcome).run();
  return json({ received: true }, 201);
};
