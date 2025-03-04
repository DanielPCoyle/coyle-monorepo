import { Client } from "pg";
import { describe, expect, it } from "vitest";
import { checkDatabaseExists } from "../vitest/utils/database";

describe("Vitest Test Suite", () => {
  it("should check if the database exists and migrations have occurred", async () => {
    const databaseExists = await checkDatabaseExists();
    expect(databaseExists).toBe(true);

    const migrationsOccurred = await checkMigrationsOccurred();
    expect(migrationsOccurred).toBe(true);
  });
});

export async function checkDatabaseExists() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    await client.connect();
    await client.query("SELECT 1");
    return true;
  } catch (error) {
    console.error("Database connection error:", error);
    return false;
  } finally {
    await client.end();
  }
}

const checkMigrationsOccurred = async () => {
  const client = new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    await client.connect();
    const result = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
    return result.rows.length > 0;
  } catch (error) {
    console.error("Error checking migrations:", error);
    return false;
  } finally {
    await client.end();
  }
};
