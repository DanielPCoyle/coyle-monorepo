import { debug } from "debug";
import { getPool } from "@coyle/database";
import { createDatabases, runMigrations } from "./utils/database";
import { startPostgresContainer } from "./utils/docker";
import { spawn } from "child_process";
import waitOn from "wait-on";
import puppeteer from "puppeteer";

const logger = debug("setup");

let nextProcess: any;
let browser: puppeteer.Browser;

export async function setup() {
  console.log("Starting PostgreSQL server...");
  const container = await startPostgresContainer();
  const connection = container.getConnectionUri();
  console.log(`Started PostgreSQL server at "${connection}"!`);

  const [adminDb] = await createDatabases(connection);

  process.env.DB_HOST = container.getHost();
  process.env.DB_PORT = container.getPort().toString();
  process.env.DB_USERNAME = container.getUsername();
  process.env.DB_PASSWORD = container.getPassword();
  process.env.DB_NAME = adminDb;
  process.env.PORT = "3002";
  process.env.NEXT_PUBLIC_SOCKET_SITE = "http://localhost:3002";

  console.log("Migrating database...");
  console.log("Migrated database", await runMigrations());

  // Start Next.js server
  console.log("Starting Next.js server...");
  nextProcess = spawn(
    "yarn",
    ["workspace", "@coyle/web", "start", "-p", "3000"],
    { stdio: "ignore", shell: true },
  );
  nextProcess.unref();

  // Wait for the server to be available
  await waitOn({ resources: ["http://localhost:3000"] });

  console.log("Next.js server is running!");

  // Start Puppeteer
  console.log("Launching Puppeteer...");
  browser = await puppeteer.launch({ headless: true });

  return { browser };
}

export async function teardown() {
  console.log("Stopping Next.js server...");
  if (nextProcess) {
    nextProcess.kill();
  }

  console.log("Closing Puppeteer...");
  if (browser) {
    await browser.close();
  }

  console.log("Closing database connection...");
  await getPool().end();
}
