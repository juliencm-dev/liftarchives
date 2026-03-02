import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schemas";

/** Minimal D1Database interface — the real type comes from @cloudflare/workers-types at runtime */
interface D1Database {
  prepare(query: string): unknown;
  dump(): Promise<ArrayBuffer>;
  batch(statements: unknown[]): Promise<unknown[]>;
  exec(query: string): Promise<unknown>;
}

type Database = ReturnType<typeof drizzle<typeof schema>>;
let _db: Database | null = null;
let _d1: D1Database | null = null;

/** Called from server middleware to pass D1 binding */
export function setD1(binding: D1Database) {
  _d1 = binding;
  _db = null;
}

export const db: Database = new Proxy({} as Database, {
  get(_, prop) {
    if (!_db) _db = drizzle(_d1 as any, { schema });
    const val = (_db as any)[prop];
    return typeof val === "function" ? val.bind(_db) : val;
  },
});
