import { describe, it, expect, vi } from "vitest";
import { deleteUser } from "../deleteUser";
import { getDB } from "@simpler-development/chat-db";
import { eq } from "drizzle-orm";

vi.mock("@simpler-development/chat-db", () => ({
  getDB: vi.fn(),
  users: {}, // optional: if needed in logic
}));

vi.mock("drizzle-orm", () => ({
  eq: vi.fn((a, b) => ({ a, b })), // mock eq to return a dummy object
}));

describe("deleteUser", () => {
  it("should delete a user with the given id", async () => {
    const mockWhere = vi.fn();
    const mockDelete = vi.fn().mockReturnValue({ where: mockWhere });
    const mockDB = { delete: mockDelete };

    (getDB as vi.Mock).mockReturnValue(mockDB);

    const userId = "123";

    await deleteUser(userId);

    expect(getDB).toHaveBeenCalled();
    expect(mockDelete).toHaveBeenCalled();
    expect(mockWhere).toHaveBeenCalledWith(eq(expect.anything(), userId));
  });

  it("should throw an error if deletion fails", async () => {
    const mockDelete = vi.fn().mockImplementation(() => {
      throw new Error("DB error");
    });

    const mockDB = { delete: mockDelete };
    (getDB as vi.Mock).mockReturnValue(mockDB);

    const userId = "456";

    await expect(deleteUser(userId)).rejects.toThrow(
      "User not found with id: " + userId,
    );
  });
});
