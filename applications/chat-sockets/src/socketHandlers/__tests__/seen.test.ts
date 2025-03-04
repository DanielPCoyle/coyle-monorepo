import { setMessageSeen } from "@coyle/database";
import { describe, expect, it, vi } from "vitest";
import { seen } from "../seen.js";

// Mock the module at the top
vi.mock("@coyle/database", () => ({
  setMessageSeen: vi.fn(),
}));

describe("seen socket handler", () => {
  it("should log an error if setMessageSeen throws", async () => {
    const socket = {
      on: vi.fn((event, callback) => {
        if (event === "seen") {
          callback(1); // Simulate the event being triggered
        }
      }),
    };
    const io = { emit: vi.fn() };
    const conversations = [{ id: 1, message: "Hello" }];
    const consoleLog = vi.spyOn(console, "log").mockImplementation(() => {});

    // Ensure the function actually throws
    setMessageSeen.mockRejectedValueOnce(new Error("Test error"));

    // Call the function
    seen({ socket, io, conversations });

    // Ensure the callback runs asynchronously
    await new Promise((resolve) => setImmediate(resolve));

    // Assertions
    expect(socket.on).toHaveBeenCalledWith("seen", expect.any(Function));
    expect(setMessageSeen).toHaveBeenCalledWith(1);
    expect(io.emit).not.toHaveBeenCalled();
    expect(consoleLog).toHaveBeenCalledWith(
      "ERROR UPDATING SEEN RECORD",
      expect.any(Error),
    );

    // Cleanup
    consoleLog.mockRestore();
  });
});
describe("seen socket handler", () => {
  it("should call setMessageSeen and emit conversations on success", async () => {
    const socket = {
      on: vi.fn((event, callback) => {
        if (event === "seen") {
          callback(1); // Simulate the event being triggered
        }
      }),
    };
    const io = { emit: vi.fn() };
    const conversations = [{ id: 1, message: "Hello" }];

    // Ensure the function resolves successfully
    setMessageSeen.mockResolvedValueOnce(undefined);

    // Call the function
    seen({ socket, io, conversations });

    // Ensure the callback runs asynchronously
    await new Promise((resolve) => setImmediate(resolve));

    // Assertions
    expect(socket.on).toHaveBeenCalledWith("seen", expect.any(Function));
    expect(setMessageSeen).toHaveBeenCalledWith(1);
    expect(io.emit).toHaveBeenCalledWith("conversations", conversations);
  });

  it("should log an error if setMessageSeen throws", async () => {
    const socket = {
      on: vi.fn((event, callback) => {
        if (event === "seen") {
          callback(1); // Simulate the event being triggered
        }
      }),
    };
    const io = { emit: vi.fn() };
    const conversations = [{ id: 1, message: "Hello" }];
    const consoleLog = vi.spyOn(console, "log").mockImplementation(() => {});

    // Ensure the function actually throws
    setMessageSeen.mockRejectedValueOnce(new Error("Test error"));

    // Call the function
    seen({ socket, io, conversations });

    // Ensure the callback runs asynchronously
    await new Promise((resolve) => setImmediate(resolve));

    // Assertions
    expect(socket.on).toHaveBeenCalledWith("seen", expect.any(Function));
    expect(setMessageSeen).toHaveBeenCalledWith(1);
    expect(io.emit).not.toHaveBeenCalled();
    expect(consoleLog).toHaveBeenCalledWith(
      "ERROR UPDATING SEEN RECORD",
      expect.any(Error),
    );

    // Cleanup
    consoleLog.mockRestore();
  });
});
