import { debug } from "debug";

import { getPool } from "@coyle/database";

import { createDatabases, runMigrations } from "./utils/database";
import { startPostgresContainer } from "./utils/docker";

const logger = debug("setup");

export async function setup() {
  logger("Starting PostgreSQL server...");
  const container = await startPostgresContainer();
  const connection = container.getConnectionUri();
  logger(`Started PostgreSQL server at "${connection}"!`);

  const [adminDb] = await createDatabases(connection);

  process.env.DB_HOST = container.getHost();
  process.env.DB_PORT = container.getPort().toString();
  process.env.DB_USERNAME = container.getUsername();
  process.env.DB_PASSWORD = container.getPassword();
  process.env.DB_NAME = adminDb;

  logger("Migrating database...");
  logger("Migrated database", await runMigrations());
  console.log("Setup done");
}

export async function teardown() {
  await getPool().end();
}
