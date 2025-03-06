import { getDB } from "@coyle/database/src/db";
import handler from "@coyle/web/pages/api/auth/register";
import { createMocks } from "node-mocks-http";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@coyle/database/src/db", () => ({
  getDB: vi.fn().mockReturnValue({
    insert: () => ({
      values: () => ({
        returning: () =>
          Promise.resolve([{ id: "123", email: "test@example.com" }]),
      }),
    }),
  }),
}));

vi.mock("bcrypt", async () => {
  const actual = await vi.importActual<typeof import("bcrypt")>("bcrypt");
  return {
    ...actual,
    hash: vi.fn(),
  };
});

describe("POST /api/auth/register", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns 405 for non-POST requests", async () => {
    const { req, res } = createMocks({ method: "GET" });

    await handler(req as any, res as any);

    expect(res._getStatusCode()).toBe(405);
    expect(res._getJSONData()).toEqual({ error: "Method Not Allowed" });
  });

  it("returns 400 if  password is missing", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: { email: "abc@test.com" },
    });

    await handler(req as any, res as any);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({
      error: "Email and password are required",
    });
  });

  it("returns 400 if email is missing", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: { password: "321password!@" },
    });

    await handler(req as any, res as any);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({
      error: "Email and password are required",
    });
  });

  it("creates a user and returns 201", async () => {
    const mockDB = {
      insert: vi.fn().mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi
            .fn()
            .mockResolvedValue([{ id: "123", email: "test@example.com" }]),
        }),
      }),
    };

    (getDB as vi.Mock).mockReturnValue(mockDB);
    (await import("bcrypt")).hash.mockResolvedValue("hashed_password");

    const { req, res } = createMocks({
      method: "POST",
      body: { email: "test@example.com", password: "password123" },
    });

    await handler(req as any, res as any);

    expect(res._getStatusCode()).toBe(201);
    expect(res._getJSONData()).toEqual({
      message: "User created successfully",
    });
    expect(mockDB.insert).toHaveBeenCalled();
  });

  it("returns 500 if database insert fails", async () => {
    (getDB as vi.Mock).mockReturnValue({
      insert: vi.fn().mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockRejectedValue(new Error("DB error")),
        }),
      }),
    });

    (await import("bcrypt")).hash.mockResolvedValue("hashed_password");

    const { req, res } = createMocks({
      method: "POST",
      body: { email: "test@example.com", password: "password123" },
    });

    await handler(req as any, res as any);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toEqual({ error: "DB error" });
  });
});
