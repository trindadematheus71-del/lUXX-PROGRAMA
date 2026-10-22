-- Execute este SQL no banco D1 do Cloudflare.
CREATE TABLE IF NOT EXISTS luxx_state (
  id TEXT PRIMARY KEY,
  payload TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT OR IGNORE INTO luxx_state (id, payload) VALUES ('main', '{"products":[],"clients":[],"sales":[],"settings":{}}');
