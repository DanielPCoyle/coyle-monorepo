import { describe, it, expect, vi } from "vitest";
import { updateUser } from "../settings/updateUser";
import { getDB } from "@coyle/chat-db";
import { eq } from "drizzle-orm";

vi.mock("@coyle/chat-db", () => ({
  getDB: vi.fn(),
  users: {
    id: "id",
  },
}));

vi.mock("drizzle-orm", () => ({
  eq: vi.fn((a, b) => ({ a, b })),
}));

describe("updateUser", () => {
  it("should update the user with the given data", async () => {
    const mockWhere = vi.fn().mockResolvedValue("result");
    const mockSet = vi.fn().mockReturnValue({ where: mockWhere });
    const mockUpdate = vi.fn().mockReturnValue({ set: mockSet });
    const mockDB = { update: mockUpdate };

    (getDB as any).mockReturnValue(mockDB);

    const user = { id: "user-1", name: "Updated Name", notificationsEnabled: true };

    const result = await updateUser(user);

    expect(getDB).toHaveBeenCalled();
    expect(mockUpdate).toHaveBeenCalledWith(expect.anything());
    expect(mockSet).toHaveBeenCalledWith(user);
    expect(mockWhere).toHaveBeenCalledWith(eq(expect.anything(), user.id));
    expect(result).toBe("result");
  });

  it("should throw an error if update fails", async () => {
    const error = new Error("Update failed");
    const mockSet = vi.fn().mockReturnValue({
      where: () => {
        throw error;
      },
    });
    const mockUpdate = vi.fn().mockReturnValue({ set: mockSet });
    const mockDB = { update: mockUpdate };

    (getDB as any).mockReturnValue(mockDB);

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const user = { id: "error-user", name: "Crash Test", notificationsEnabled: false };

    await expect(updateUser(user)).rejects.toThrow("User not found with id: error-user");

    expect(consoleSpy).toHaveBeenCalledWith(error);

    consoleSpy.mockRestore();
  });
});
