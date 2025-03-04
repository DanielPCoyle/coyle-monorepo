import handler from "@coyle/web/pages/api/auth/login"; // Adjust the import path as needed
import { createMocks } from "node-mocks-http";
import { describe, expect, it, vi } from "vitest";

vi.mock("bcrypt");
vi.mock("jsonwebtoken");
vi.mock("@coyle/database/db");

describe("/api/auth/login", () => {
  const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET;

  it("should return 405 if method is not POST", async () => {
    const { req, res } = createMocks({
      method: "GET",
    });

    await handler(req as any, res as any);

    expect(res._getStatusCode()).toBe(405);
    expect(res._getJSONData()).toEqual({ error: "Method Not Allowed" });
  });

  it("should return 400 if email or password is missing", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {},
    });

    await handler(req as any, res as any);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({
      error: "Email and password are required",
    });
  });
});
