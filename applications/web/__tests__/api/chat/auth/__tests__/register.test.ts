import { describe, it, expect, vi } from "vitest";
import { createMocks } from "node-mocks-http";
import handler from "@simpler-development/chat-api/handlers/auth/register";
import { createAdminUser } from "@simpler-development/chat-db";
import { sendWelcomeEmail } from "@simpler-development/chat-api/utils/sendWelcomeEmail";

vi.mock("@simpler-development/chat-db", () => ({ createAdminUser: vi.fn() }));
vi.mock("../../../../../util/chat/sendWelcomeEmail", () => ({
  sendWelcomeEmail: vi.fn(),
}));

describe("POST /api/auth/register", () => {
  it("should create a new user and send a welcome email", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: JSON.stringify({
        name: "John Doe",
        email: "john@example.com",
        role: "admin",
      }),
    });

    createAdminUser.mockResolvedValue("mocked-token");

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    expect(res._getJSONData()).toEqual({
      message: "User created successfully",
      token: "mocked-token",
    });
    expect(createAdminUser).toHaveBeenCalledWith({
      email: "john@example.com",
      password: expect.any(String),
      name: "John Doe",
      role: "admin",
    });
    expect(sendWelcomeEmail).toHaveBeenCalledWith(
      "John Doe",
      "john@example.com",
      expect.any(String),
    );
  });

  it("should return 400 if email or name is missing", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: JSON.stringify({ email: "john@example.com" }),
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({
      error: "Email and name are required",
    });
  });

  it("should return 405 if method is not POST", async () => {
    const { req, res } = createMocks({ method: "GET" });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(res._getJSONData()).toEqual({ error: "Method Not Allowed" });
  });

  it("should return 500 if there is an error creating the user", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: JSON.stringify({
        name: "John Doe",
        email: "john@example.com",
        role: "admin",
      }),
    });

    createAdminUser.mockRejectedValue(new Error("Database error"));

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toEqual({ error: "Database error" });
  });
});
