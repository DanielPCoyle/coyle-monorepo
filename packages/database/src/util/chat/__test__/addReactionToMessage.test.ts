 
import { addReactionToMessage, getDB } from "@coyle/database";
import { messages } from "@coyle/database/schema";
import { eq } from "drizzle-orm";
import { describe, expect, it, vi } from "vitest";

vi.mock("../../../db", () => ({
  getDB: vi.fn(),
}));

describe("addReactionToMessage", () => {
  it("should update the message with the given reactions", async () => {
    const mockUpdate = vi.fn().mockReturnThis();
    const mockSet = vi.fn().mockReturnThis();
    const mockWhere = vi.fn().mockResolvedValueOnce({});

    const db = {
      update: mockUpdate,
      set: mockSet,
      where: mockWhere,
    };

    (getDB as vi.Mock).mockReturnValue(db);

    const reactions = ["👍", "❤️"];
    const messageId = "123";

    await addReactionToMessage({ reactions, messageId });

    expect(mockUpdate).toHaveBeenCalledWith(messages);
    expect(mockSet).toHaveBeenCalledWith({ reactions });
    expect(mockWhere).toHaveBeenCalledWith(eq(messages.id, messageId));
  });
});
