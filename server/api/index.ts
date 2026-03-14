import app from "../src/app";
import { connectDatabase } from "../src/config/db";

let dbInit: Promise<void> | null = null;

async function ensureDatabase() {
  if (!dbInit) {
    dbInit = connectDatabase().catch((err) => {
      console.error("Database initialization failed:", err);
      dbInit = null;
      throw err;
    });
  }
  return dbInit;
}

export default async function handler(req: any, res: any) {
  // Kick off DB connection in background to avoid blocking cold starts/timeouts
  // Mongoose will buffer model operations until connected.
  ensureDatabase().catch(() => {});
  return app(req, res);
}
