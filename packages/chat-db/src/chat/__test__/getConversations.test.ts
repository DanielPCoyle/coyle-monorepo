import { describe, it, expect, vi, beforeEach } from "vitest";
import { getConversations } from "../getConversations"; // Adjust the path if necessary
import { getDB } from "@simpler-development/chat-db";
import { conversations, messages } from "@simpler-development/chat-db/schema";
import { eq, count, and } from "drizzle-orm";

vi.mock("@simpler-development/chat-db");

describe("getConversations", () => {
  let mockDB: unknown;

  beforeEach(() => {
    vi.resetAllMocks();

    mockDB = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      leftJoin: vi.fn().mockReturnThis(),
      groupBy: vi.fn().mockReturnThis(),
    };

    (getDB as vi.Mock).mockReturnValue(mockDB);
  });

  it("should return a list of conversations with unseen messages count", async () => {
    const mockConversations = [
      {
        id: 1,
        conversationKey: "key1",
        name: "User One",
        email: "user1@example.com",
        createdAt: new Date("2024-01-01T12:00:00Z"),
        isActive: true,
        unSeenMessages: 3,
      },
      {
        id: 2,
        conversationKey: "key2",
        name: "User Two",
        email: "user2@example.com",
        createdAt: new Date("2024-01-02T12:00:00Z"),
        isActive: false,
        unSeenMessages: 0,
      },
    ];

    mockDB.groupBy.mockResolvedValue(mockConversations);

    const result = await getConversations();

    expect(mockDB.select).toHaveBeenCalledWith({
      id: conversations.id,
      conversationKey: conversations.conversationKey,
      name: conversations.name,
      email: conversations.email,
      createdAt: conversations.createdAt,
      isActive: conversations.isActive,
      unSeenMessages: count(messages.id).as("unSeenMessages"),
    });

    expect(mockDB.from).toHaveBeenCalledWith(conversations);
    expect(mockDB.leftJoin).toHaveBeenCalledWith(
      messages,
      and(
        eq(messages.conversationId, conversations.id),
        eq(messages.seen, false),
      ),
    );
    expect(mockDB.groupBy).toHaveBeenCalledWith(conversations.id);
    expect(result).toEqual(mockConversations);
  });

  it("should return an empty array when there are no conversations", async () => {
    mockDB.groupBy.mockResolvedValue([]);

    const result = await getConversations();

    expect(result).toEqual([]);
  });

  it("should throw an error if the database query fails", async () => {
    const errorMessage = "Database error";
    mockDB.groupBy.mockRejectedValue(new Error(errorMessage));

    await expect(getConversations()).rejects.toThrow(errorMessage);
  });
});
