import { describe, it, expect, vi, beforeEach } from "vitest";
import { getAdminUser } from "@coyle/chat-db";
import { handleCors } from "@coyle/chat-api/utils/handleCors";
import { authMiddleware } from "../../../../middlewares/auth";

import rawHandler from "../../../../pages/api/chat/settings/get-user"; // Adjust the path

vi.mock("@coyle/chat-db", () => ({
  getAdminUser: vi.fn(),
}));

vi.mock("../../../../middlewares/handleCors", () => ({
  handleCors: vi.fn(),
}));

vi.mock("../../../../middlewares/auth", () => ({
  authMiddleware: vi.fn((handler) => handler),
}));

describe("GET /api/getAdminUser", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      method: "GET",
      query: { id: "admin-1" },
    };

    res = {
      status: vi.fn(() => res),
      json: vi.fn(),
      setHeader: vi.fn(),
    };

    vi.clearAllMocks();
  });

  it("should return a single admin user by ID", async () => {
    const fakeUser = { id: "admin-1", name: "Alice" };
    (getAdminUser as any).mockResolvedValue([fakeUser]);

    await rawHandler(req, res);

    expect(handleCors).toHaveBeenCalledWith(req, res);
    expect(getAdminUser).toHaveBeenCalledWith("admin-1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(fakeUser);
  });

  it("should do nothing if method is not GET", async () => {
    req.method = "POST";

    await rawHandler(req, res);

    expect(getAdminUser).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
