import { describe, it, expect, vi } from "vitest";
import { updateUserStatus } from "../updateUserStatus";
import { getDB } from "../../..";
import { eq } from "drizzle-orm";

vi.mock("../../..", () => ({
  getDB: vi.fn(),
  users: {
    id: "id",
    status: "status",
  },
}));

vi.mock("drizzle-orm", () => ({
  eq: vi.fn((a, b) => ({ a, b })),
}));

describe("updateUserStatus", () => {
  it("should update the status of the user", async () => {
    const mockWhere = vi.fn().mockResolvedValue(undefined);
    const mockSet = vi.fn().mockReturnValue({ where: mockWhere });
    const mockUpdate = vi.fn().mockReturnValue({ set: mockSet });
    const mockDB = { update: mockUpdate };

    (getDB as any).mockReturnValue(mockDB);

    await updateUserStatus({ id: "user-123", status: "online" });

    expect(getDB).toHaveBeenCalled();
    expect(mockUpdate).toHaveBeenCalledWith(expect.anything());
    expect(mockSet).toHaveBeenCalledWith({ status: "online" });
    expect(mockWhere).toHaveBeenCalledWith(eq(expect.anything(), "user-123"));
  });

  it("should handle errors gracefully", async () => {
    const mockSet = vi.fn().mockReturnValue({
      where: () => {
        throw new Error("Update failed");
      },
    });
    const mockUpdate = vi.fn().mockReturnValue({ set: mockSet });
    const mockDB = { update: mockUpdate };

    (getDB as any).mockReturnValue(mockDB);

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await updateUserStatus({ id: "fail-user", status: "offline" });

    expect(consoleSpy).toHaveBeenCalledWith("Error adding conversation", expect.any(Error));

    consoleSpy.mockRestore();
  });
});
