import { describe, it, expect, vi, beforeEach } from "vitest";
import { getAdminUsers } from "@coyle/chat-db";
import { authMiddleware } from "../../../../middlewares/auth";
import { handleCors } from "@coyle/chat-api/utils/handleCors";

// Import the actual handler before it’s wrapped
import rawHandler from "../../../../pages/api/chat/settings/admin-users"; // Update path as needed

vi.mock("@coyle/chat-db", () => ({
  getAdminUsers: vi.fn(),
}));

vi.mock("../../../../middlewares/handleCors", () => ({
  handleCors: vi.fn(),
}));

// Mock authMiddleware to just return the handler directly for testing
vi.mock("../../../../middlewares/auth", () => ({
  authMiddleware: vi.fn((handler) => handler),
}));

describe("GET /api/adminUsers", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = { method: "GET" };
    res = {
      status: vi.fn(() => res),
      json: vi.fn(),
      setHeader: vi.fn(),
    };
    vi.clearAllMocks();
  });

  it("should call getAdminUsers and return 200 with users", async () => {
    const users = [{ id: 1, name: "Admin1" }];
    (getAdminUsers as any).mockResolvedValue(users);

    await rawHandler(req, res);

    expect(handleCors).toHaveBeenCalledWith(req, res);
    expect(getAdminUsers).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(users);
  });

  it("should do nothing if method is not GET", async () => {
    req.method = "POST";

    await rawHandler(req, res);

    expect(handleCors).toHaveBeenCalledWith(req, res);
    expect(getAdminUsers).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
