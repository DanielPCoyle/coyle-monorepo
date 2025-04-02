import { describe, it, expect, vi, beforeEach } from "vitest";
import { deleteUser } from "@coyle/chat-db";
import { authMiddleware } from "../../../../middlewares/auth";
import { handleCors } from "../../../../middlewares/handleCors";

// Import the raw handler (before middleware wraps it)
import rawHandler from "../../../../pages/api/chat/settings/delete-admin-user"; // Adjust path as needed

vi.mock("@coyle/chat-db", () => ({
  deleteUser: vi.fn(),
}));

vi.mock("../../../../middlewares/handleCors", () => ({
  handleCors: vi.fn(),
}));

vi.mock("../../../../middlewares/auth", () => ({
  authMiddleware: vi.fn((handler) => handler),
}));

describe("DELETE /api/deleteUser", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      method: "DELETE",
      body: JSON.stringify({ id: "user-123" }),
    };

    res = {
      status: vi.fn(() => res),
      json: vi.fn(),
      setHeader: vi.fn(),
    };

    vi.clearAllMocks();
  });

  it("should delete a user and return 200", async () => {
    await rawHandler(req, res);

    expect(handleCors).toHaveBeenCalledWith(req, res);
    expect(deleteUser).toHaveBeenCalledWith("user-123");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "User deleted" });
  });

  it("should do nothing if method is not DELETE", async () => {
    req.method = "POST";

    await rawHandler(req, res);

    expect(deleteUser).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("should handle errors and return 500", async () => {
    (deleteUser as any).mockRejectedValue(new Error("DB Error"));

    await rawHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
  });
});
