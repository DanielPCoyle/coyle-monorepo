import { describe, it, expect, vi } from "vitest";
import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "@simpler-development/chat-api/utils/auth";
import jwt from "jsonwebtoken";
import { getUserByEmail } from "@simpler-development/chat-db/src/chat/getUserByEmail";

vi.mock("jsonwebtoken");
vi.mock("@simpler-development/chat-db/src/chat/getUserByEmail");

describe("authMiddleware", () => {
  const handler = vi.fn((req, res) =>
    res.status(200).json({ message: "success" }),
  );

  it("should return 401 if authorization header is missing", async () => {
    const req = {
      headers: {},
    } as NextApiRequest;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as NextApiResponse;

    await authMiddleware(handler)(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Unauthorized" });
  });

  it("should return 401 if token is invalid", async () => {
    const req = {
      headers: { authorization: "Bearer invalidtoken" },
    } as NextApiRequest;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as NextApiResponse;

    (jwt.verify as vi.Mock).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    await authMiddleware(handler)(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid or expired token",
      message: "Invalid token",
    });
  });

  it("should return 403 if user is not found", async () => {
    const req = {
      headers: { authorization: "Bearer validtoken" },
    } as NextApiRequest;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as NextApiResponse;

    (jwt.verify as vi.Mock).mockReturnValue({ email: "test@example.com" });
    (getUserByEmail as vi.Mock).mockResolvedValue(null);

    await authMiddleware(handler)(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "Forbidden" });
  });

  it("should call handler if token is valid and user is found", async () => {
    const req = {
      headers: { authorization: "Bearer validtoken" },
    } as NextApiRequest;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as NextApiResponse;

    (jwt.verify as vi.Mock).mockReturnValue({ email: "test@example.com" });
    (getUserByEmail as vi.Mock).mockResolvedValue([
      { id: 1, email: "test@example.com" },
    ]);

    await authMiddleware(handler)(req, res);

    expect(handler).toHaveBeenCalledWith(req, res);
    expect(req.user).toEqual({ id: 1, email: "test@example.com" });
  });
});
