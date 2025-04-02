import { describe, it, expect, vi } from "vitest";
import { updateMessage } from "../updateMessage";
import { getDB } from "../../..";
import { eq } from "drizzle-orm";

vi.mock("../../..", () => ({
  getDB: vi.fn(),
  messages: {
    id: "id",
  },
}));

vi.mock("drizzle-orm", () => ({
  eq: vi.fn((a, b) => ({ a, b })),
}));

describe("updateMessage", () => {
  it("should update the message with the given data", async () => {
    const mockWhere = vi.fn().mockResolvedValue(undefined);
    const mockSet = vi.fn().mockReturnValue({ where: mockWhere });
    const mockUpdate = vi.fn().mockReturnValue({ set: mockSet });
    const mockDB = { update: mockUpdate };

    (getDB as any).mockReturnValue(mockDB);

    const messageId = "msg-001";
    const updateData = { content: "Updated text", isRead: true };

    await updateMessage(messageId, updateData);

    expect(getDB).toHaveBeenCalled();
    expect(mockUpdate).toHaveBeenCalledWith(expect.anything());
    expect(mockSet).toHaveBeenCalledWith(updateData);
    expect(mockWhere).toHaveBeenCalledWith(eq(expect.anything(), messageId));
  });

  it("should log an error if update fails", async () => {
    const error = new Error("DB failure");

    const mockSet = vi.fn().mockReturnValue({
      where: () => {
        throw error;
      },
    });

    const mockUpdate = vi.fn().mockReturnValue({ set: mockSet });
    const mockDB = { update: mockUpdate };

    (getDB as any).mockReturnValue(mockDB);

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await updateMessage("msg-fail", { content: "Crash" });

    expect(consoleSpy).toHaveBeenCalledWith("Error adding conversation", error);

    consoleSpy.mockRestore();
  });
});
