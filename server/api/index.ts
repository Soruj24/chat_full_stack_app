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
  try {
    await ensureDatabase();
  } catch (_e) {
    // On DB init failure, still let the request continue so error handler can respond
  }
  return app(req, res);
}
