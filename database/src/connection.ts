import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import "dotenv/config";

import * as schema from "./schemas";

const DATABASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.DATABASE_URL!
    : process.env.DATABASE_URL_DEV!;

const pool = new Pool({
  connectionString: DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
  statement_timeout: 10_000,
});

export const db = drizzle(pool, { schema });

console.log("Database initialized.");
