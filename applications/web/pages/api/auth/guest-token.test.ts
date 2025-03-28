import { describe, it, expect, vi, beforeEach } from "vitest";
import handler from "./guest-token"; // adjust path
import jwt from "jsonwebtoken";
import { handleCors } from "../../../middlewares/handleCors";

vi.mock("../../../middlewares/handleCors", () => ({
  handleCors: vi.fn(),
}));

vi.mock("jsonwebtoken", async () => {
  const actual: typeof import("jsonwebtoken") = await vi.importActual("jsonwebtoken");
  return {
    ...actual,
    default: {
      ...actual,
      sign: vi.fn(),
    },
  };
});

describe("POST /api/auth/create-token", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      method: "POST",
      body: {
        name: "John",
        email: "john@example.com",
        conversationKey: "room-1",
      },
    };

    res = {
      status: vi.fn(() => res),
      json: vi.fn(),
    };

    vi.clearAllMocks();
  });

  it("should return a token when valid name and email are provided", async () => {
    (jwt.sign as any).mockReturnValue("mocked.jwt.token");

    await handler(req, res);

    expect(jwt.sign).toHaveBeenCalledWith(
      {
        email: "john@example.com",
        name: "John",
        conversationKey: "room-1",
      },
      expect.any(String), // secret
      { expiresIn: "7d" }
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ token: "mocked.jwt.token" });
  });

  it("should return 400 if name or email is missing", async () => {
    req.body = { name: "", email: "" };

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Email and name are required",
    });
  });

  it("should return 405 if method is not POST", async () => {
    req.method = "GET";

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ error: "Method Not Allowed" });
  });

  it("should return 500 if jwt.sign throws", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    (jwt.sign as any).mockImplementation(() => {
      throw new Error("JWT signing failed");
    });

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "JWT signing failed",
    });

    consoleSpy.mockRestore();
  });
});
