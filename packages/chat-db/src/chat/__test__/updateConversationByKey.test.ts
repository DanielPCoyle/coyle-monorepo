import { describe, it, expect, vi } from "vitest";
import updateConversationByKey from "../updateConversationByKey";
import { getDB } from "@coyle/chat-db";

import { eq } from "drizzle-orm";

vi.mock("../../db", () => ({
  getDB: vi.fn(),
}));

vi.mock("drizzle-orm", () => ({
  eq: vi.fn(),
}));

describe("updateConversationByKey", () => {
  it("should update a conversation by key", async () => {
    const mockUpdate = vi.fn().mockReturnThis();
    const mockSet = vi.fn().mockReturnThis();
    const mockWhere = vi.fn().mockResolvedValue(undefined);

    const mockDB = {
      update: vi.fn(() => ({
        set: mockSet,
        where: mockWhere,
      })),
    };

    (getDB as vi.Mock).mockReturnValue(mockDB);

    const key = "testKey";
    const data = { conversationName: "Updated Conversation" };

    await updateConversationByKey(key, data);

    expect(getDB).toHaveBeenCalled();
    expect(mockDB.update).toHaveBeenCalledWith(expect.anything());
    expect(mockSet).toHaveBeenCalledWith(data);
    expect(mockWhere).toHaveBeenCalledWith(eq(expect.anything(), key));
  });

  it("should log an error if the update fails", async () => {
    const mockDB = {
      update: vi.fn(() => ({
        set: vi.fn(() => ({
          where: vi.fn().mockRejectedValue(new Error("Update failed")),
        })),
      })),
    };

    (getDB as vi.Mock).mockReturnValue(mockDB);
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const key = "testKey";
    const data = { conversationName: "Updated Conversation" };

    await updateConversationByKey(key, data);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error updating conversation",
      expect.any(Error),
    );

    consoleErrorSpy.mockRestore();
  });
});
