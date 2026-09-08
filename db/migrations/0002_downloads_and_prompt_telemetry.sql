CREATE TABLE IF NOT EXISTS download_signups (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  contact_kind TEXT NOT NULL CHECK (contact_kind IN ('email', 'mobile')),
  contact_value TEXT NOT NULL,
  source_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_download_signups_created_at ON download_signups(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_download_signups_source_created_at ON download_signups(source_hash, created_at DESC);

CREATE TABLE IF NOT EXISTS prompt_telemetry (
  id TEXT PRIMARY KEY,
  installation_id TEXT NOT NULL,
  prompt TEXT NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('free', 'connected')),
  automation INTEGER NOT NULL DEFAULT 0 CHECK (automation IN (0, 1)),
  app_version TEXT NOT NULL,
  latency_ms INTEGER,
  outcome TEXT NOT NULL CHECK (outcome IN ('completed', 'failed', 'cancelled')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_prompt_telemetry_created_at ON prompt_telemetry(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_prompt_telemetry_installation_created_at ON prompt_telemetry(installation_id, created_at DESC);
