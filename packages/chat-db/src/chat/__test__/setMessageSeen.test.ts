import { getDB, setMessageSeen } from "@coyle/chat-db";
import { messages } from "@coyle/chat-db/schema";
import { eq } from "drizzle-orm";
import { describe, expect, it, vi } from "vitest";

vi.mock("../../../db", () => ({
  getDB: vi.fn(),
}));

describe("setMessageSeen", () => {
  it("should update the message seen status to true", async () => {
    const mockUpdate = vi.fn().mockReturnThis();
    const mockSet = vi.fn().mockReturnThis();
    const mockWhere = vi.fn().mockResolvedValueOnce({});

    getDB.mockReturnValue({
      update: mockUpdate,
      set: mockSet,
      where: mockWhere,
    });

    await setMessageSeen(1);

    expect(mockUpdate).toHaveBeenCalledWith(messages);
    expect(mockSet).toHaveBeenCalledWith({ seen: true });
    expect(mockWhere).toHaveBeenCalledWith(eq(messages.id, 1));
  });

  it("should log an error if the update fails", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const mockUpdate = vi.fn().mockReturnThis();
    const mockSet = vi.fn().mockReturnThis();
    const mockWhere = vi.fn().mockRejectedValueOnce(new Error("Update failed"));

    getDB.mockReturnValue({
      update: mockUpdate,
      set: mockSet,
      where: mockWhere,
    });

    await setMessageSeen(1);

    expect(consoleSpy).toHaveBeenCalledWith(
      "ERROR UPDATING SEEN RECORD",
      expect.any(Error),
    );

    consoleSpy.mockRestore();
  });
});
