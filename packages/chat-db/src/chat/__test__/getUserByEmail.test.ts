import { describe, it, expect, vi } from "vitest";
import { getUserByEmail } from "../getUserByEmail";
import { getDB } from "@coyle/chat-db";
import { eq } from "drizzle-orm";

vi.mock("@coyle/chat-db", () => ({
  getDB: vi.fn(),
  users: {
    email: "email", // mock schema field
  },
}));

vi.mock("drizzle-orm", () => ({
  eq: vi.fn((a, b) => ({ a, b })),
}));

describe("getUserByEmail", () => {
  it("should return the user if found", async () => {
    const mockLimit = vi.fn().mockResolvedValue([{ email: "test@example.com", name: "Test User" }]);
    const mockWhere = vi.fn().mockReturnValue({ limit: mockLimit });
    const mockFrom = vi.fn().mockReturnValue({ where: mockWhere });
    const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });
    const mockDB = { select: mockSelect };

    (getDB as vi.Mock).mockReturnValue(mockDB);

    const result = await getUserByEmail("test@example.com");

    expect(getDB).toHaveBeenCalled();
    expect(mockSelect).toHaveBeenCalled();
    expect(mockFrom).toHaveBeenCalled();
    expect(mockWhere).toHaveBeenCalledWith(eq(expect.anything(), "test@example.com"));
    expect(mockLimit).toHaveBeenCalledWith(1);
    expect(result).toEqual({ email: "test@example.com", name: "Test User" });
  });

  it("should return undefined if no user is found", async () => {
    const mockLimit = vi.fn().mockResolvedValue([]);
    const mockWhere = vi.fn().mockReturnValue({ limit: mockLimit });
    const mockFrom = vi.fn().mockReturnValue({ where: mockWhere });
    const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });
    const mockDB = { select: mockSelect };

    (getDB as vi.Mock).mockReturnValue(mockDB);

    const result = await getUserByEmail("missing@example.com");

    expect(result).toBe(undefined);
  });

  it("should throw an error if DB call fails", async () => {
    const mockSelect = vi.fn().mockImplementation(() => {
      throw new Error("DB failure");
    });

    const mockDB = { select: mockSelect };
    (getDB as vi.Mock).mockReturnValue(mockDB);

    await expect(getUserByEmail("fail@example.com")).rejects.toThrow("User not found with email: fail@example.com");
  });
});
