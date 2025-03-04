import { sql } from "drizzle-orm";
import pgPkg from "pg";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { explainAnalyze, getDB, getPool } from "../db";

vi.mock("pg", () => {
  const Pool = vi.fn(() => ({
    connect: vi.fn(),
    query: vi.fn(),
    end: vi.fn(),
    on: vi.fn(),
    setMaxListeners: vi.fn(),
  }));
  return { Pool, default: { Pool } };
});

const MockPool = pgPkg.Pool;

describe("Database Utility Functions", () => {
  beforeAll(() => {
    process.env.DB_HOST = "localhost";
    process.env.DB_PORT = "5432";
    process.env.DB_USERNAME = "user";
    process.env.DB_PASSWORD = "password";
    process.env.DB_NAME = "testdb";
    process.env.DB_POOL_LIMIT = "10";
  });

  describe("getPool", () => {
    it("should create a new pool if it doesn't exist", () => {
      expect(MockPool).toHaveBeenCalled();
      expect(pgPkg.Pool).toHaveBeenCalledWith({
        host: "localhost",
        port: 5432,
        user: "user",
        password: "password",
        database: "testdb",
        max: 10,
        connectionTimeoutMillis: 5000,
        idleTimeoutMillis: 60000,
        allowExitOnIdle: true,
      });
    });

    it("should return the existing pool if it already exists", () => {
      const pool1 = getPool();
      const pool2 = getPool();
      expect(pool1).toBe(pool2);
    });
  });

  describe("getDB", () => {
    it("should create a new adminDb if it doesn't exist", () => {
      const db = getDB();
      expect(db).toBeDefined();
    });

    it("should return the existing adminDb if it already exists", () => {
      const db1 = getDB();
      const db2 = getDB();
      expect(db1).toBe(db2);
    });
  });

  describe("explainAnalyze", () => {
    it("should execute EXPLAIN ANALYZE on the given query", async () => {
      const mockQuery = {
        getSQL: () => "SELECT * FROM users",
      };
      const mockExecute = vi.fn().mockResolvedValue({
        rows: [
          {
            "QUERY PLAN": "Seq Scan on users  (cost=0.00..1.00 rows=1 width=1)",
          },
        ],
      });
      const db = getDB();
      db.execute = mockExecute;

      const result = await explainAnalyze(mockQuery as unknown);
      expect(mockExecute).toHaveBeenCalledWith(
        sql`EXPLAIN ANALYZE ${mockQuery.getSQL()}`,
      );
      expect(result).toBe(mockQuery);
    });
  });
});
