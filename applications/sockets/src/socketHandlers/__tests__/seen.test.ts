import { setMessageSeen, getConversations } from "@simpler-development/chat-db";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { seen } from "../seen.js";

// Mock the database module
vi.mock("@simpler-development/chat-db", () => ({
  setMessageSeen: vi.fn().mockResolvedValue(undefined),
  getConversations: vi.fn().mockResolvedValue([]),
}));

// Utility to ensure all async operations resolve before assertions
const flushPromises = () => new Promise(setImmediate);

describe("seen socket handler", () => {
  let socket, io, conversations, consoleLog;

  beforeEach(() => {
    socket = {
      on: vi.fn((event, callback) => {
        if (event === "seen") {
          callback(1); // Simulate the event being triggered with message ID 1
        }
      }),
    };
    io = { emit: vi.fn() };
    conversations = [{ id: 1, message: "Hello" }];
    consoleLog = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should call setMessageSeen and emit conversations on success", async () => {
    // Mock a successful update
    (setMessageSeen as jest.Mock).mockResolvedValueOnce(undefined);
    (getConversations as jest.Mock).mockResolvedValueOnce(conversations);

    // Call the function
    seen({ socket, io });

    // Ensure all promises resolve
    await flushPromises();

    // Assertions
    expect(socket.on).toHaveBeenCalledWith("seen", expect.any(Function));
    expect(setMessageSeen).toHaveBeenCalledWith(1);
    expect(io.emit).toHaveBeenCalledWith("conversations", conversations);
  });

  it("should log an error if setMessageSeen throws", async () => {
    // Mock an error
    (setMessageSeen as jest.Mock).mockRejectedValueOnce(
      new Error("Test error"),
    );

    // Call the function
    seen({ socket, io });

    // Ensure all promises resolve
    await flushPromises();

    // Assertions
    expect(socket.on).toHaveBeenCalledWith("seen", expect.any(Function));
    expect(setMessageSeen).toHaveBeenCalledWith(1);
    expect(io.emit).not.toHaveBeenCalled();
    expect(consoleLog).toHaveBeenCalledWith(
      "ERROR UPDATING SEEN RECORD",
      expect.any(Error),
    );
  });
});
