import { describe, it, expect, vi, beforeEach } from "vitest";
import { disconnect } from "../disconnect"; // Adjust the import path
import {
  updateConversationIsActive,
  getConversations,
  getConversationBySocketId,
} from "@simpler-development/chat-db";

vi.mock("@simpler-development/chat-db", () => ({
  getConversationBySocketId: vi.fn(),
  updateConversationIsActive: vi.fn(),
  getConversations: vi.fn(),
}));

describe("disconnect handler", () => {
  const socket = {
    on: vi.fn(),
    id: "socket123",
  };

  const io = {
    emit: vi.fn(),
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should update conversation to inactive and emit updated conversations", async () => {
    const mockConversation = { conversationKey: "user123" };

    getConversationBySocketId.mockResolvedValue(mockConversation);
    updateConversationIsActive.mockResolvedValue(undefined);
    getConversations.mockResolvedValue([{ id: "conv123", isActive: false }]);

    disconnect({ socket, io });
    const callback = socket.on.mock.calls[0][1];

    await callback();

    expect(getConversationBySocketId).toHaveBeenCalledWith("socket123");
    expect(updateConversationIsActive).toHaveBeenCalledWith("user123", false);
    expect(io.emit).toHaveBeenCalledWith("conversations", [
      { id: "conv123", isActive: false },
    ]);
  });

  it("should do nothing if no conversation is found", async () => {
    vi.mocked(getConversationBySocketId).mockResolvedValue(null);

    disconnect({ socket, io });
    const callback = socket.on.mock.calls[0][1];

    await callback();

    expect(getConversationBySocketId).toHaveBeenCalledWith("socket123");
    expect(updateConversationIsActive).not.toHaveBeenCalled();
    expect(io.emit).not.toHaveBeenCalled();
  });

  it("should handle errors gracefully", async () => {
    vi.mocked(getConversationBySocketId).mockRejectedValue(
      new Error("Database error"),
    );

    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    disconnect({ socket, io });
    const callback = socket.on.mock.calls[0][1];

    await callback();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error disconnecting",
      new Error("Database error"),
    );

    consoleErrorSpy.mockRestore();
  });
});
