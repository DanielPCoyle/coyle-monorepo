import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { resolve } from "path";

export default defineConfig({
  dialect: "postgresql",

  out: resolve(__dirname, "./drizzle"),
  schema: resolve(__dirname, "./schema.ts"),

  dbCredentials: {
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT!),
    user: process.env.DB_USERNAME!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
  },

  // Print all statements
  verbose: false,

  // Always ask for confirmation
  strict: true,
});
