CREATE TABLE IF NOT EXISTS feedback (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL CHECK (kind IN ('bug', 'idea', 'compliment')),
  message TEXT NOT NULL,
  contact_email TEXT,
  app_version TEXT NOT NULL,
  platform TEXT,
  architecture TEXT,
  source_hash TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'resolved', 'archived')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_feedback_status_created_at
ON feedback(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_feedback_source_created_at
ON feedback(source_hash, created_at DESC);

PRAGMA optimize;
