import { describe, it, expect, vi } from "vitest";
import { updateConversationIsActive } from "../updateConversationIsActive";
import { getDB } from "../../..";
import { eq } from "drizzle-orm";

vi.mock("../../..", () => ({
  getDB: vi.fn(),
  conversations: {
    conversationKey: "conversationKey",
    isActive: "isActive",
  },
}));

vi.mock("drizzle-orm", () => ({
  eq: vi.fn((a, b) => ({ a, b })),
}));

describe("updateConversationIsActive", () => {
  it("should update the isActive field for the given conversation key", async () => {
    const mockWhere = vi.fn().mockResolvedValue(undefined);
    const mockSet = vi.fn().mockReturnValue({ where: mockWhere });
    const mockUpdate = vi.fn().mockReturnValue({ set: mockSet });
    const mockDB = { update: mockUpdate };

    (getDB as any).mockReturnValue(mockDB);

    const conversationKey = "conv-key-1";
    const status = true;

    await updateConversationIsActive(conversationKey, status);

    expect(getDB).toHaveBeenCalled();
    expect(mockUpdate).toHaveBeenCalledWith(expect.anything());
    expect(mockSet).toHaveBeenCalledWith({ isActive: status });
    expect(mockWhere).toHaveBeenCalledWith(
      eq(expect.anything(), conversationKey),
    );
  });

  it("should log an error if the update fails", async () => {
    const error = new Error("Update failed");

    const mockSet = vi.fn().mockReturnValue({
      where: () => {
        throw error;
      },
    });

    const mockUpdate = vi.fn().mockReturnValue({ set: mockSet });
    const mockDB = { update: mockUpdate };

    (getDB as any).mockReturnValue(mockDB);

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await updateConversationIsActive("error-key", false);

    expect(consoleSpy).toHaveBeenCalledWith("Error adding conversation", error);

    consoleSpy.mockRestore();
  });
});
