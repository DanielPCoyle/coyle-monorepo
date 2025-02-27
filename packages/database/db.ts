import 'dotenv/config';
import type { SQLWrapper } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { drizzle } from 'drizzle-orm/node-postgres';
import pgPkg from 'pg';
import * as schema from './schema';

const { Pool } = pgPkg;

export { eq } from 'drizzle-orm';

export type AdminDb = NodePgDatabase<typeof schema>;

let pool: Pool;
export function getPool(): Pool {
  if (!pool) {
    const poolLimit = Number(process.env.DB_POOL_LIMIT ?? 10);

    pool = new Pool({
      host: process.env.DB_HOST!,
      port: Number(process.env.DB_PORT!),
      user: process.env.DB_USERNAME!,
      password: process.env.DB_PASSWORD!,
      database: process.env.DB_NAME!,
      max: poolLimit,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 60000,
      allowExitOnIdle: true,
    });

    pool.setMaxListeners(poolLimit + 10);
  }

  return pool;
}

let adminDb: AdminDb;
export function getDB(): AdminDb {
  if (!adminDb) {
    adminDb = drizzle(getPool(), { schema });
  }

  return adminDb;
}

export async function explainAnalyze<Q extends SQLWrapper>(
  query: Q
): Promise<Q> {
  const debugResult = await getDB().execute(
    sql`EXPLAIN ANALYZE ${query.getSQL()}`
  );

  // eslint-disable-next-line no-console
  console.debug(
    debugResult.rows
      .reduce((plan, row) => `${plan}\n${row['QUERY PLAN']}`, '')
      .trim()
  );

  return query;
}
