import { describe, it, expect, vi } from "vitest";
import { getAdminUser } from "./getAdminUser";
import { getDB } from "@coyle/chat-db";
import { eq } from "drizzle-orm";

vi.mock("@coyle/chat-db", () => ({
  getDB: vi.fn(),
  users: {
    id: "id",
  },
}));

vi.mock("drizzle-orm", () => ({
  eq: vi.fn((a, b) => ({ a, b })),
}));

describe("getAdminUser", () => {
  it("should return the user with the given id", async () => {
    const mockWhere = vi.fn().mockResolvedValue([{ id: "1", name: "Alice" }]);
    const mockFrom = vi.fn().mockReturnValue({ where: mockWhere });
    const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });
    const mockDB = { select: mockSelect };

    (getDB as any).mockReturnValue(mockDB);

    const result = await getAdminUser("1");

    expect(getDB).toHaveBeenCalled();
    expect(mockSelect).toHaveBeenCalled();
    expect(mockFrom).toHaveBeenCalledWith(expect.anything());
    expect(mockWhere).toHaveBeenCalledWith(eq(expect.anything(), "1"));
    expect(result).toEqual([{ id: "1", name: "Alice" }]);
  });

  it("should throw if DB call fails", async () => {
    const mockSelect = vi.fn().mockImplementation(() => {
      throw new Error("DB error");
    });
    const mockDB = { select: mockSelect };

    (getDB as any).mockReturnValue(mockDB);

    await expect(getAdminUser("fail")).rejects.toThrow("DB error");
  });
});
