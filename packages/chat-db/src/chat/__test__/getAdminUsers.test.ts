import { describe, it, expect, vi } from "vitest";
import { getAdminUsers } from "../settings/getAdminUsers";
import { getDB } from "@simpler-development/chat-db";

vi.mock("@simpler-development/chat-db", () => ({
  getDB: vi.fn(),
  users: {},
}));

describe("getAdminUsers", () => {
  it("should return a list of users", async () => {
    const mockFrom = vi.fn().mockResolvedValue([
      { id: "1", name: "Alice" },
      { id: "2", name: "Bob" },
    ]);
    const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });
    const mockDB = { select: mockSelect };

    (getDB as any).mockReturnValue(mockDB);

    const result = await getAdminUsers();

    expect(getDB).toHaveBeenCalled();
    expect(mockSelect).toHaveBeenCalled();
    expect(mockFrom).toHaveBeenCalledWith(expect.anything());
    expect(result).toEqual([
      { id: "1", name: "Alice" },
      { id: "2", name: "Bob" },
    ]);
  });

  it("should throw if the DB fails", async () => {
    const mockSelect = vi.fn().mockImplementation(() => {
      throw new Error("DB error");
    });
    const mockDB = { select: mockSelect };

    (getDB as any).mockReturnValue(mockDB);

    await expect(getAdminUsers()).rejects.toThrow("DB error");
  });
});
