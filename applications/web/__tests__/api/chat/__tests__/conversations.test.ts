import { describe, it, expect, vi, beforeEach } from "vitest";
import { createMocks } from "node-mocks-http";
import handler from "@coyle/web/pages/api/chat/conversations";
import { getConversations } from "@coyle/database";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { getUserByEmail } from "@coyle/database/src/util/chat/getUserByEmail";
vi.mock("@coyle/database");
vi.mock("@coyle/database/src/util/chat/getUserByEmail");
vi.mock("jsonwebtoken");

// Mock authentication middleware behavior
vi.mock("../../../../middlewares/auth", () => ({
  authMiddleware:
    (fn: any) => async (req: NextApiRequest, res: NextApiResponse) => {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const token = authHeader.split(" ")[1];

      try {
        const decoded = jwt.verify(token, "your-secret-key");
        const user = await getUserByEmail(decoded.email);

        if (!user || user.length === 0) {
          return res.status(403).json({ error: "Forbidden" });
        }

        req.user = user[0];
        return fn(req, res);
      } catch (error) {
        return res
          .status(401)
          .json({ error: "Invalid or expired token", message: error.message });
      }
    },
}));

describe("/api/chat/conversations API Endpoint", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return a list of conversations with status 200", async () => {
    const mockConversations = [
      { id: 1, message: "Hello" },
      { id: 2, message: "Hi" },
    ];

    (getConversations as vi.Mock).mockResolvedValue(mockConversations);
    (jwt.verify as vi.Mock).mockReturnValue({ email: "test@example.com" });
    (getUserByEmail as vi.Mock).mockResolvedValue([
      { id: 1, email: "test@example.com" },
    ]);

    const { req, res } = createMocks({
      method: "GET",
      headers: { authorization: "Bearer validtoken" },
    });

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual(mockConversations);
  });

  it("should return 401 if no authorization header is provided", async () => {
    const { req, res } = createMocks({
      method: "GET",
      headers: {},
    });

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res._getStatusCode()).toBe(401);
    expect(res._getJSONData()).toEqual({ error: "Unauthorized" });
  });

  it("should return 500 if there is a database error", async () => {
    (getConversations as vi.Mock).mockRejectedValue(
      new Error("Database error"),
    );
    (jwt.verify as vi.Mock).mockReturnValue({ email: "test@example.com" });
    (getUserByEmail as vi.Mock).mockResolvedValue([
      { id: 1, email: "test@example.com" },
    ]);

    const { req, res } = createMocks({
      method: "GET",
      headers: { authorization: "Bearer validtoken" },
    });

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toEqual({
      error: "Internal Server Error",
      message: "Database error",
    });
  });
});
