import { describe, it, expect, vi, beforeEach } from "vitest";
import { updateUser } from "@coyle/chat-db";
import bcrypt from "bcrypt";
import { handleCors } from "../../../../middlewares/handleCors";
import { authMiddleware } from "../../../../middlewares/auth";

import rawHandler from "../../../../pages/api/chat/settings/update-profile"; // Adjust the path if needed

vi.mock("@coyle/chat-db", () => ({
  updateUser: vi.fn(),
}));

vi.mock("bcrypt", async () => {
  const actual: typeof import("bcrypt") = await vi.importActual("bcrypt");
  return {
    ...actual,
    default: {
      ...actual,
      hash: vi.fn(), // mock hash
    },
  };
});

vi.mock("../../../../middlewares/handleCors", () => ({
  handleCors: vi.fn(),
}));

vi.mock("../../../../middlewares/auth", () => ({
  authMiddleware: vi.fn((handler) => handler),
}));

describe("PATCH /api/updateUser", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      method: "PATCH",
      body: {
        id: "user-123",
        name: "Test User",
        password: "new-password",
      },
    };

    res = {
      status: vi.fn(() => res),
      json: vi.fn(),
      setHeader: vi.fn(),
    };

    vi.clearAllMocks();
  });

  it("should hash password and update user", async () => {
    (bcrypt.hash as any).mockResolvedValue("hashed-password");

    await rawHandler(req, res);

    expect(handleCors).toHaveBeenCalledWith(req, res);
    expect(bcrypt.hash).toHaveBeenCalledWith("new-password", 10);
    expect(updateUser).toHaveBeenCalledWith({
      id: "user-123",
      name: "Test User",
      password: "new-password",
      passwordHash: "hashed-password",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "User updated" });
  });

  it("should update user without hashing if password is empty", async () => {
    req.body.password = "";

    await rawHandler(req, res);

    expect(bcrypt.hash).not.toHaveBeenCalled();
    expect(updateUser).toHaveBeenCalledWith({
      id: "user-123",
      name: "Test User",
      password: "",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "User updated" });
  });

  it("should do nothing if method is not PATCH", async () => {
    req.method = "GET";

    await rawHandler(req, res);

    expect(updateUser).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("should return 500 on error", async () => {
    (bcrypt.hash as any).mockRejectedValue(new Error("bcrypt failed"));

    await rawHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
  });
});
