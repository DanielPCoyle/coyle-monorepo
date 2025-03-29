import { describe, it, expect, vi } from "vitest";
import { getUsersOnline } from "../getUsersOnline";
import { getDB } from "@coyle/chat-db";
import { eq } from "drizzle-orm";

vi.mock("@coyle/chat-db", () => ({
  getDB: vi.fn(),
  users: {
    status: "status", // mock schema field
  },
}));

vi.mock("drizzle-orm", () => ({
  eq: vi.fn((a, b) => ({ a, b })),
}));

describe("getUsersOnline", () => {
  it("should return users with status 'online'", async () => {
    const mockWhere = vi.fn().mockResolvedValue([
      { id: 1, name: "Alice", status: "online" },
      { id: 2, name: "Bob", status: "online" },
    ]);
    const mockFrom = vi.fn().mockReturnValue({ where: mockWhere });
    const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });
    const mockDB = { select: mockSelect };

    (getDB as vi.Mock).mockReturnValue(mockDB);

    const result = await getUsersOnline();

    expect(getDB).toHaveBeenCalled();
    expect(mockSelect).toHaveBeenCalled();
    expect(mockFrom).toHaveBeenCalled();
    expect(mockWhere).toHaveBeenCalledWith(eq(expect.anything(), "online"));
    expect(result).toEqual([
      { id: 1, name: "Alice", status: "online" },
      { id: 2, name: "Bob", status: "online" },
    ]);
  });

  it("should throw an error if DB fails", async () => {
    const mockSelect = vi.fn().mockImplementation(() => {
      throw new Error("DB down");
    });
    const mockDB = { select: mockSelect };

    (getDB as vi.Mock).mockReturnValue(mockDB);

    await expect(getUsersOnline()).rejects.toThrow(
      "Error getting users online",
    );
  });
});
