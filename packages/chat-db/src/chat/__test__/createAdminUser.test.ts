import { describe, it, expect, vi, beforeEach } from "vitest";
import * as dbModule from "@coyle/chat-db/src/db";
import { createAdminUser } from "../settings/createAdminUser";
import bcrypt from "bcrypt";
import * as uuid from "uuid";
import jwt from "jsonwebtoken";

// ✅ Properly mock default import for bcrypt
vi.mock("bcrypt", () => ({
  default: {
    hash: vi.fn(),
  },
}));

// ✅ Properly mock default import for jsonwebtoken
vi.mock("jsonwebtoken", () => ({
  default: {
    sign: vi.fn(),
  },
}));

vi.mock("uuid", () => ({
  v4: vi.fn(),
}));

vi.mock("@coyle/chat-db/src/db", () => ({
  getDB: vi.fn(),
}));

describe("createAdminUser", () => {
  const mockDBInsert = vi.fn();
  const mockDB = { insert: vi.fn(() => ({ values: mockDBInsert })) };

  const email = "admin@example.com";
  const password = "securepassword";
  const name = "Admin";
  const role = "admin";

  beforeEach(() => {
    vi.clearAllMocks();
    (dbModule.getDB as any).mockReturnValue(mockDB);
    (bcrypt.hash as any).mockResolvedValue("hashed-password");
    (uuid.v4 as any).mockReturnValue("uuid-123");
    (jwt.sign as any).mockReturnValue("mock-token");
  });

  it("should create a user and return a token", async () => {
    const token = await createAdminUser({ email, password, name, role });

    expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    expect(uuid.v4).toHaveBeenCalled();
    expect(mockDB.insert).toHaveBeenCalled();
    expect(mockDBInsert).toHaveBeenCalledWith({
      id: "uuid-123",
      email,
      passwordHash: "hashed-password",
      isActive: false,
      role: "admin",
    });
    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: "uuid-123", email, name },
      expect.any(String),
      { expiresIn: "7d" },
    );
    expect(token).toBe("mock-token");
  });

  it("should return null and log error if something fails", async () => {
    (mockDBInsert as any).mockImplementationOnce(() => {
      throw new Error("DB Error");
    });

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const result = await createAdminUser({ email, password, name, role });

    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith("Error creating user:", "DB Error");
  });
});
