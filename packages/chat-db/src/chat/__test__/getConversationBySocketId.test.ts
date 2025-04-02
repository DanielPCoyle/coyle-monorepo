import { describe, it, expect, vi } from "vitest";
import { getConversationBySocketId } from "../getConversationBySocketId";
import { getDB } from "@coyle/chat-db";
import { eq } from "drizzle-orm";

vi.mock("@coyle/chat-db", () => ({
  getDB: vi.fn(),
  conversations: {
    socketId: "socketId", // mocked schema field
  },
}));

vi.mock("drizzle-orm", () => ({
  eq: vi.fn((a, b) => ({ a, b })),
}));

describe("getConversationBySocketId", () => {
  it("should return the conversation if found", async () => {
    const mockWhere = vi
      .fn()
      .mockResolvedValue([{ socketId: "abc123", message: "Hello" }]);
    const mockFrom = vi.fn().mockReturnValue({ where: mockWhere });
    const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });
    const mockDB = { select: mockSelect };

    (getDB as vi.Mock).mockReturnValue(mockDB);

    const result = await getConversationBySocketId("abc123");

    expect(getDB).toHaveBeenCalled();
    expect(mockSelect).toHaveBeenCalled();
    expect(mockFrom).toHaveBeenCalled();
    expect(mockWhere).toHaveBeenCalledWith(eq(expect.anything(), "abc123"));
    expect(result).toEqual({ socketId: "abc123", message: "Hello" });
  });

  it("should return undefined if no conversation is found", async () => {
    const mockWhere = vi.fn().mockResolvedValue([]);
    const mockFrom = vi.fn().mockReturnValue({ where: mockWhere });
    const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });
    const mockDB = { select: mockSelect };

    (getDB as vi.Mock).mockReturnValue(mockDB);

    const result = await getConversationBySocketId("missing");

    expect(result).toBe(undefined);
  });

  it("should return false if an error occurs", async () => {
    const mockSelect = vi.fn().mockImplementation(() => {
      throw new Error("Database error");
    });

    const mockDB = { select: mockSelect };
    (getDB as vi.Mock).mockReturnValue(mockDB);

    const result = await getConversationBySocketId("error");

    expect(result).toBe(false);
  });
});
