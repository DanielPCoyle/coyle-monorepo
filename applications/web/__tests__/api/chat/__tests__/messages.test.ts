import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import handler from '../../../../pages/api/chat/messages';
import { getMessages } from "@coyle/database";
import jwt from "jsonwebtoken";

vi.mock("@coyle/database", () => ({
  getMessages: vi.fn(),
}));

vi.mock("jsonwebtoken", () => ({
  default: {
    verify: vi.fn(),
  },
  verify: vi.fn(),
}));


describe("API Handler - getMessages", () => {
  let req, res;

  beforeEach(() => {
    req = {
      headers: {},
      query: {},
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("should return 401 if no authorization header", async () => {
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Unauthorized" });
  });

  test("should return 403 if user role is not admin and conversationKey does not match", async () => {
    req.headers.authorization = "Bearer validToken";
    req.query.conversationKey = "12345";
    jwt.verify.mockImplementation(() => ({ role: "user", conversationKey: "67890" }));
    
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "Forbidden" });
  });

  test("should return messages if user is admin", async () => {
    req.headers.authorization = "Bearer validToken";
    req.query.conversationKey = "12345";
    jwt.verify.mockImplementation(() => ({ role: "admin" }));
    getMessages.mockImplementation(() => Promise.resolve([{ id: 1, text: "Hello" }]));

    await handler(req, res);
    expect(getMessages).toHaveBeenCalledWith("12345");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ id: 1, text: "Hello" }]);
  });

  test("should return messages if conversationKey matches", async () => {
    req.headers.authorization = "Bearer validToken";
    req.query.conversationKey = "12345";
    jwt.verify.mockImplementation(() => ({ role: "user", conversationKey: "12345" }));
    getMessages.mockImplementation(() => Promise.resolve([{ id: 1, text: "Hello" }]));

    await handler(req, res);
    expect(getMessages).toHaveBeenCalledWith("12345");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ id: 1, text: "Hello" }]);
  });

  test("should return 500 on error", async () => {
    req.headers.authorization = "Bearer validToken";
    req.query.conversationKey = "12345";
    jwt.verify.mockImplementation(() => {
      throw new Error("JWT Error");
    });

    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "JWT Error" });
  });
});
