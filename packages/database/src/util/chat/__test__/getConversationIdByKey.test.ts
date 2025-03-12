import { describe, it, expect, vi, beforeEach } from "vitest";
import { getConversationIdByKey } from "../getConversationIdByKey"; // Adjust the path if necessary
import { getDB } from "@coyle/database";
import { conversations as convos } from "@coyle/database/schema";
import { eq } from "drizzle-orm";

vi.mock("@coyle/database");

describe("getConversationIdByKey", () => {
  let mockDB: any;

  beforeEach(() => {
    vi.resetAllMocks();

    mockDB = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
    };

    (getDB as vi.Mock).mockReturnValue(mockDB);
  });

  it("should return the conversation ID if found", async () => {
    const mockKey = "test-key";
    const mockConversations = [{ id: "conversation123" }];

    mockDB.where.mockResolvedValue(mockConversations);

    const conversationId = await getConversationIdByKey(mockKey);

    expect(mockDB.select).toHaveBeenCalled();
    expect(mockDB.from).toHaveBeenCalledWith(convos);
    expect(mockDB.where).toHaveBeenCalledWith(
      eq(convos.conversationKey, mockKey),
    );
    expect(conversationId).toBe("conversation123");
  });

  it("should return false if no conversation is found", async () => {
    const mockKey = "nonexistent-key";

    mockDB.where.mockResolvedValue([]);

    const conversationId = await getConversationIdByKey(mockKey);

    expect(mockDB.where).toHaveBeenCalledWith(
      eq(convos.conversationKey, mockKey),
    );
    expect(conversationId).toBe(false);
  });

  it("should return false and log an error if database throws an error", async () => {
    const mockKey = "error-key";
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    mockDB.where.mockRejectedValue(new Error("Database error"));

    const conversationId = await getConversationIdByKey(mockKey);

    expect(consoleSpy).toHaveBeenCalledWith(
      "Error getting conversation id by key",
      expect.any(Error),
    );
    expect(conversationId).toBe(false);

    consoleSpy.mockRestore();
  });
});
