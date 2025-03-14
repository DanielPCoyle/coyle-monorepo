import { getDB, getMessages } from "@coyle/database";
import { describe, expect, it, vi } from "vitest";

vi.mock("../../../db", () => ({
  getDB: vi.fn(),
}));

describe("getMessages", () => {
  it("should return an empty array if no conversation is found", async () => {
    const mockDB = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockResolvedValue([]),
    };
    (getDB as vi.Mock).mockReturnValue(mockDB);

    const result = await getMessages("nonexistentKey");
    expect(result).toEqual([]);
  });

  it("should return messages with replies", async () => {
    const mockDB = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi
        .fn()
        .mockImplementationOnce(() => Promise.resolve([{ id: 1 }]))
        .mockImplementationOnce(() =>
          Promise.resolve([
            { id: 1, conversationId: 1, parentId: null },
            { id: 2, conversationId: 1, parentId: 1 },
          ]),
        )
        .mockImplementationOnce(() =>
          Promise.resolve([{ id: 2, conversationId: 1, parentId: 1 }]),
        ),
    };
    (getDB as vi.Mock).mockReturnValue(mockDB);

    const result = await getMessages("existingKey");
    expect(result).toEqual([
      {
        id: 1,
        conversationId: 1,
        parentId: null,
        replies: [{ id: 2, conversationId: 1, parentId: 1 }],
      },
      {
        id: 2,
        conversationId: 1,
        parentId: 1,
        replies: [],
      },
    ]);
  });

  it("should handle errors and return an empty array", async () => {
    const mockDB = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockRejectedValue(new Error("DB error")),
    };
    (getDB as vi.Mock).mockReturnValue(mockDB);

    const result = await getMessages("errorKey");
    expect(result).toEqual([]);
  });
});
