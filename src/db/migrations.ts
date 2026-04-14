// Schema migrations are handled by Dexie version().stores() in database.ts
// This file is reserved for complex data migrations between schema versions.
// Example:
// db.version(2).stores({ ... }).upgrade(tx => { ... });
export {};
