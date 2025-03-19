import { addConversation, getDB } from "@coyle/chat-db";
import { conversations } from "@coyle/chat-db/schema";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";

vi.mock("../../db", () => ({
  getDB: vi.fn(),
}));

const mockDB = {
  select: vi.fn().mockReturnThis(),
  from: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  values: vi.fn().mockReturnThis(),
};

describe("addConversation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (getDB as Mock).mockReturnValue(mockDB);
  });

  it("should add a new conversation if it does not exist", async () => {
    mockDB.where.mockResolvedValueOnce([]);
    await addConversation({
      name: "John Doe",
      email: "john@example.com",
      conversationKey: "key123",
    });
    expect(mockDB.insert).toHaveBeenCalledWith(conversations);
    expect(mockDB.values).toHaveBeenCalledWith({
      name: "John Doe",
      email: "john@example.com",
      conversationKey: "key123",
    });
  });

  it("should not add a conversation if it already exists", async () => {
    mockDB.where.mockResolvedValueOnce([{ conversationKey: "key123" }]);
    await addConversation({
      name: "John Doe",
      email: "john@example.com",
      conversationKey: "key123",
    });
    expect(mockDB.insert).not.toHaveBeenCalled();
    expect(mockDB.values).not.toHaveBeenCalled();
  });
});
