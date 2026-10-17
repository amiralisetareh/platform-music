# Phase 8 storage design

The API uses Node's built-in SQLite binding. `users` rows store the normalized email and a JSON document containing password salt/hash, profile, library, and creation timestamp. Email is unique at the database level. `sessions` rows store a SHA-256 digest of the opaque random cookie token, the owning user ID, and an expiry timestamp. Foreign-key cascading prevents orphaned sessions if a user row is removed.

User mutations run in explicit SQLite transactions. The API loads account records into memory at startup and commits mutations to SQLite; this is a single-process architecture. Do not run multiple API processes against this in-memory cache because concurrent writes can become stale. A future multi-instance architecture should move all reads/writes to a shared repository and use a managed database/session service.

Legacy migration is one-time: if SQLite has no users and `accounts.json` exists, records are imported transactionally and the legacy file is renamed to `accounts.json.migrated`. Preserve a secure backup before upgrading. Do not commit the data directory or migrated legacy file.
