globalThis.openNextDebug = false;globalThis.openNextVersion = "3.5.7";

// node_modules/@opennextjs/cloudflare/dist/api/durable-objects/sharded-tag-cache.js
import { DurableObject } from "cloudflare:workers";
var DOShardedTagCache = class extends DurableObject {
  sql;
  constructor(state, env) {
    super(state, env);
    this.sql = state.storage.sql;
    state.blockConcurrencyWhile(async () => {
      this.sql.exec(`CREATE TABLE IF NOT EXISTS revalidations (tag TEXT PRIMARY KEY, revalidatedAt INTEGER)`);
    });
  }
  async hasBeenRevalidated(tags, lastModified) {
    return this.sql.exec(`SELECT 1 FROM revalidations WHERE tag IN (${tags.map(() => "?").join(", ")}) AND revalidatedAt > ? LIMIT 1`, ...tags, lastModified ?? Date.now()).toArray().length > 0;
  }
  async writeTags(tags, lastModified) {
    tags.forEach((tag) => {
      this.sql.exec(`INSERT OR REPLACE INTO revalidations (tag, revalidatedAt) VALUES (?, ?)`, tag, lastModified);
    });
  }
};
export {
  DOShardedTagCache
};
