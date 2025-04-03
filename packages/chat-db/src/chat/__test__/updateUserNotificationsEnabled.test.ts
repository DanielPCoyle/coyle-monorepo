import { describe, it, expect, vi } from "vitest";
import { updateUserNotificationsEnabled } from "../updateUserNotificationsEnabled";
import { getDB } from "@simpler-development/chat-db";
import { eq } from "drizzle-orm";

vi.mock("@simpler-development/chat-db", () => ({
  getDB: vi.fn(),
  users: {
    id: "id",
    notificationsEnabled: "notificationsEnabled",
  },
}));

vi.mock("drizzle-orm", () => ({
  eq: vi.fn((a, b) => ({ a, b })),
}));

describe("updateUserNotificationsEnabled", () => {
  it("should update the notificationsEnabled field for the user", async () => {
    const mockWhere = vi.fn().mockResolvedValue(undefined);
    const mockSet = vi.fn().mockReturnValue({ where: mockWhere });
    const mockUpdate = vi.fn().mockReturnValue({ set: mockSet });
    const mockDB = { update: mockUpdate };

    (getDB as vi.Mock).mockReturnValue(mockDB);

    const userId = "user-123";
    const notificationsEnabled = true;

    await updateUserNotificationsEnabled({ id: userId, notificationsEnabled });

    expect(getDB).toHaveBeenCalled();
    expect(mockUpdate).toHaveBeenCalledWith(expect.anything());
    expect(mockSet).toHaveBeenCalledWith({
      notificationsEnabled,
    });
    expect(mockWhere).toHaveBeenCalledWith(eq(expect.anything(), userId));
  });

  it("should handle errors gracefully", async () => {
    const error = new Error("DB failed");
    const mockSet = vi.fn().mockReturnValue({
      where: () => {
        throw error;
      },
    });
    const mockUpdate = vi.fn().mockReturnValue({ set: mockSet });
    const mockDB = { update: mockUpdate };

    (getDB as vi.Mock).mockReturnValue(mockDB);

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await updateUserNotificationsEnabled({
      id: "error-user",
      notificationsEnabled: false,
    });

    expect(consoleSpy).toHaveBeenCalledWith("Error adding conversation", error);

    consoleSpy.mockRestore();
  });
});
