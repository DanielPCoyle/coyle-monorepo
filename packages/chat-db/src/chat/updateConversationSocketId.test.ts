import { describe, it, expect, vi } from "vitest";
import { updateConversationSocketId } from "./updateConversationSocketId";
import { getDB } from "../..";
import { eq } from "drizzle-orm";

vi.mock("../..", () => ({
  getDB: vi.fn(),
  conversations: {
    id: "id",
    socketId: "socketId",
  },
}));

vi.mock("drizzle-orm", () => ({
  eq: vi.fn((a, b) => ({ a, b })),
}));

describe("updateConversationSocketId", () => {
  it("should update the socketId for the given conversation", async () => {
    const mockWhere = vi.fn().mockResolvedValue(undefined);
    const mockSet = vi.fn().mockReturnValue({ where: mockWhere });
    const mockUpdate = vi.fn().mockReturnValue({ set: mockSet });
    const mockDB = { update: mockUpdate };

    (getDB as any).mockReturnValue(mockDB);

    const conversationId = 123;
    const socketId = "abc123";

    await updateConversationSocketId(conversationId, socketId);

    expect(getDB).toHaveBeenCalled();
    expect(mockUpdate).toHaveBeenCalledWith(expect.anything());
    expect(mockSet).toHaveBeenCalledWith({ socketId });
    expect(mockWhere).toHaveBeenCalledWith(eq(expect.anything(), conversationId));
  });

  it("should log an error if the update fails", async () => {
    const error = new Error("DB update failed");

    const mockSet = vi.fn().mockReturnValue({
      where: () => {
        throw error;
      },
    });

    const mockUpdate = vi.fn().mockReturnValue({ set: mockSet });
    const mockDB = { update: mockUpdate };

    (getDB as any).mockReturnValue(mockDB);

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await updateConversationSocketId(999, "fail-socket");

    expect(consoleSpy).toHaveBeenCalledWith("Error adding conversation", error);

    consoleSpy.mockRestore();
  });
});
