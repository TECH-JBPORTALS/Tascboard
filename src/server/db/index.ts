import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import { env } from "@/env";
import * as appSchema from "./schema";
import * as authSchema from "./auth-schema";

const schema = {
  ...authSchema,
  ...appSchema,
};

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  sql: ReturnType<typeof neon> | undefined;
};

const sql = globalForDb.sql ?? neon(env.DATABASE_URL);
if (env.NODE_ENV !== "production") globalForDb.sql = sql;

export const db = drizzle({ client: sql, schema, casing: "snake_case" });
