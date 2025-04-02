import { describe, it, expect, vi, beforeEach } from "vitest";
import handler from "./me"; // adjust path
import { getUserByEmail } from "@coyle/chat-db/src/chat/getUserByEmail";
import { getConversationById, getConversationIdByKey } from "@coyle/chat-db";
import jwt from "jsonwebtoken";
import { handleCors } from "@coyle/chat-api/utils/handleCors";

// ✅ Mock dependencies
vi.mock("@coyle/chat-db/src/chat/getUserByEmail", () => ({
  getUserByEmail: vi.fn(),
}));
vi.mock("@coyle/chat-db", () => ({
  getConversationIdByKey: vi.fn(),
  getConversationById: vi.fn(),
}));
vi.mock("../../../middlewares/handleCors", () => ({
  handleCors: vi.fn(),
}));
vi.mock("jsonwebtoken", async () => {
  const actual: typeof import("jsonwebtoken") =
    await vi.importActual("jsonwebtoken");
  return {
    ...actual,
    default: {
      ...actual,
      verify: vi.fn(),
    },
  };
});

describe("GET /api/auth/whoami", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      method: "GET",
      headers: {
        authorization: "Bearer mock.jwt.token",
      },
    };

    res = {
      status: vi.fn(() => res),
      json: vi.fn(),
      setHeader: vi.fn(),
    };

    process.env.NEXT_PUBLIC_JWT_SECRET = "secret";
    process.env.REACT_APP_COOKIE_DOMAIN = "test.local";

    vi.clearAllMocks();
  });

  it("should return admin user info and set cookie", async () => {
    (jwt.verify as any).mockReturnValue({
      role: "admin",
      email: "admin@example.com",
    });

    (getUserByEmail as any).mockResolvedValue({
      id: "admin-id",
      email: "admin@example.com",
    });

    await handler(req, res);

    expect(res.setHeader).toHaveBeenCalledWith(
      "Set-Cookie",
      expect.stringContaining("jwt=mock.jwt.token"),
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      user: { id: "admin-id", email: "admin@example.com" },
      cookieDomain: "test.local",
      jwt: "mock.jwt.token",
    });
  });

  it("should return user info and conversation if not admin", async () => {
    (jwt.verify as any).mockReturnValue({
      role: "user",
      email: "user@example.com",
      conversationKey: "key123",
    });

    (getConversationIdByKey as any).mockResolvedValue("convo-1");
    (getConversationById as any).mockResolvedValue({
      id: "convo-1",
      name: "Test Chat",
    });

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      user: {
        role: "user",
        email: "user@example.com",
        conversationKey: "key123",
      },
      conversation: { id: "convo-1", name: "Test Chat" },
    });
  });

  it("should return 401 if Authorization header is missing", async () => {
    req.headers.authorization = undefined;

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Authorization header missing",
    });
  });

  it("should return 401 if token is missing", async () => {
    req.headers.authorization = "Bearer";

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Token missing" });
  });

  it("should return 401 if token is invalid", async () => {
    (jwt.verify as any).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid token",
      error: "Invalid token",
    });
  });

  it("should return 405 for non-GET methods", async () => {
    req.method = "POST";

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ message: "Method not allowed" });
  });
});
