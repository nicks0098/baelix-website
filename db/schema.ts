export const feedbackSchema = {
  table: 'feedback',
  columns: {
    id: 'TEXT PRIMARY KEY',
    kind: "TEXT NOT NULL CHECK (kind IN ('bug', 'idea', 'compliment'))",
    message: 'TEXT NOT NULL',
    contactEmail: 'TEXT',
    appVersion: 'TEXT NOT NULL',
    platform: 'TEXT',
    architecture: 'TEXT',
    sourceHash: 'TEXT NOT NULL',
    status: "TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'resolved', 'archived'))",
    createdAt: 'TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP',
  },
} as const;
