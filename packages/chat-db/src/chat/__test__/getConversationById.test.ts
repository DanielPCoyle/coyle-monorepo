import { describe, it, expect, vi } from "vitest";
import { getConversationById } from "../getConversationById";
import { getDB } from "@coyle/chat-db";
import { eq } from "drizzle-orm";

vi.mock("@coyle/chat-db", () => ({
  getDB: vi.fn(),
  conversations: {
    id: "id", // just a placeholder for the schema field
  },
}));

vi.mock("drizzle-orm", () => ({
  eq: vi.fn((a, b) => ({ a, b })),
}));

describe("getConversationById", () => {
  it("should return the conversation if found", async () => {
    const mockWhere = vi
      .fn()
      .mockResolvedValue([{ id: "123", message: "Hello" }]);
    const mockFrom = vi.fn().mockReturnValue({ where: mockWhere });
    const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });
    const mockDB = { select: mockSelect };

    (getDB as vi.Mock).mockReturnValue(mockDB);

    const result = await getConversationById("123");

    expect(getDB).toHaveBeenCalled();
    expect(mockSelect).toHaveBeenCalled();
    expect(mockFrom).toHaveBeenCalled();
    expect(mockWhere).toHaveBeenCalledWith(eq(expect.anything(), "123"));
    expect(result).toEqual({ id: "123", message: "Hello" });
  });

  it("should return false if conversation not found", async () => {
    const mockWhere = vi.fn().mockResolvedValue([]);
    const mockFrom = vi.fn().mockReturnValue({ where: mockWhere });
    const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });
    const mockDB = { select: mockSelect };

    (getDB as vi.Mock).mockReturnValue(mockDB);

    const result = await getConversationById("999");

    expect(result).toBe(false);
  });

  it("should return false if an error occurs", async () => {
    const mockSelect = vi.fn().mockImplementation(() => {
      throw new Error("DB error");
    });

    const mockDB = { select: mockSelect };
    (getDB as vi.Mock).mockReturnValue(mockDB);

    const result = await getConversationById("error");

    expect(result).toBe(false);
  });
});
