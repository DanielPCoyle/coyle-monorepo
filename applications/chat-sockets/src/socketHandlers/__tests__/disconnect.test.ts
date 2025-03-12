import { updateConversationIsActive, getConversations } from "@coyle/database";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { disconnect } from "../disconnect.js";

// Mock the database module
vi.mock("@coyle/database", () => ({
  updateConversationIsActive: vi.fn(),
  getConversations: vi.fn(),
}));

describe("disconnect socket handler", () => {
  let socket, io, conversations, consoleLog;

  beforeEach(() => {
    socket = {
      id: "socket123",
      on: vi.fn((event, callback) => {
        if (event === "disconnect") {
          callback(); // Simulate a disconnect event
        }
      }),
    };
    io = { emit: vi.fn() };
    conversations = [
      { id: 1, socketId: "socket123", message: "Hello" },
      { id: 2, socketId: "socket456", message: "Hey" },
    ];
    consoleLog = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should call updateConversationIsActive and emit conversations when a matching conversation is found", async () => {
    // Mock successful database calls
    getConversations.mockResolvedValueOnce([
      { id: 1, socketId: "socket123", message: "Hello" },
      { id: 2, socketId: "socket456", message: "Hey" },
    ]);

    // Call the function
    disconnect({ socket, io, conversations });

    // Wait for async operations
    await new Promise((resolve) => setImmediate(resolve));

    // Assertions
    expect(socket.on).toHaveBeenCalledWith("disconnect", expect.any(Function));
    expect(updateConversationIsActive).toHaveBeenCalledWith(1, false);
    expect(getConversations).toHaveBeenCalled();
    expect(io.emit).toHaveBeenCalledWith("conversations", [
      { id: 1, socketId: "socket123", message: "Hello" },
      { id: 2, socketId: "socket456", message: "Hey" },
    ]);
    expect(consoleLog).toHaveBeenCalledWith([
      { id: 1, socketId: "socket123", message: "Hello" },
      { id: 2, socketId: "socket456", message: "Hey" },
    ]);
  });

  it("should do nothing if no matching conversation is found", async () => {
    socket.id = "nonexistent_socket";

    // Call the function
    disconnect({ socket, io, conversations });

    // Wait for async operations
    await new Promise((resolve) => setImmediate(resolve));

    // Assertions
    expect(updateConversationIsActive).not.toHaveBeenCalled();
    expect(getConversations).not.toHaveBeenCalled();
    expect(io.emit).not.toHaveBeenCalled();
    expect(consoleLog).not.toHaveBeenCalled();
  });
});
