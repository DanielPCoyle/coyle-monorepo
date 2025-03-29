import { describe, it, expect, vi, beforeEach } from "vitest";
import handler from "./messages"; // adjust the path
import { getMessages } from "@coyle/chat-db";
import { handleCors } from "../../../middlewares/handleCors";
import jwt from "jsonwebtoken";

vi.mock("@coyle/chat-db", () => ({
  getMessages: vi.fn(),
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

describe("GET /api/messages handler", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      method: "GET",
      headers: {},
      query: {
        conversationKey: "room-1",
      },
    };

    res = {
      status: vi.fn(() => res),
      json: vi.fn(),
      setHeader: vi.fn(),
    };

    vi.clearAllMocks();
  });

  it("should return messages for admin", async () => {
    req.headers.authorization = "Bearer valid.token";
    (jwt.verify as any).mockReturnValue({ role: "admin" });
    (getMessages as any).mockResolvedValue([{ id: 1, text: "hello" }]);

    await handler(req, res);

    expect(getMessages).toHaveBeenCalledWith("room-1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ id: 1, text: "hello" }]);
  });

  it("should return messages if user has access to conversation", async () => {
    req.headers.authorization = "Bearer valid.token";
    (jwt.verify as any).mockReturnValue({
      role: "user",
      conversationKey: "room-1",
    });
    (getMessages as any).mockResolvedValue([{ id: 1, text: "hi" }]);

    await handler(req, res);

    expect(getMessages).toHaveBeenCalledWith("room-1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ id: 1, text: "hi" }]);
  });

  it("should return 401 if authorization is missing", async () => {
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Unauthorized" });
  });

  it("should return 403 if user tries to access another conversation", async () => {
    req.headers.authorization = "Bearer valid.token";
    (jwt.verify as any).mockReturnValue({
      role: "user",
      conversationKey: "room-999",
    });

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "Forbidden" });
  });

  it("should return 500 if jwt.verify throws", async () => {
    req.headers.authorization = "Bearer bad.token";
    (jwt.verify as any).mockImplementation(() => {
      throw new Error("invalid token");
    });

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "invalid token" });
  });

  it("should return 500 if getMessages fails", async () => {
    req.headers.authorization = "Bearer valid.token";
    (jwt.verify as any).mockReturnValue({ role: "admin" });
    (getMessages as any).mockRejectedValue(new Error("DB failure"));

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "DB failure" });
  });
});
