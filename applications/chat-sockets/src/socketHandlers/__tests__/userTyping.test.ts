import { vi, describe, test, expect, beforeEach, afterEach } from "vitest";
import { userTyping } from "../userTyping"; // Adjust the path as necessary

describe("userTyping", () => {
  let socket, io, typingTimeout, onMock, emitMock;

  beforeEach(() => {
    emitMock = vi.fn();
    onMock = vi.fn();
    io = { to: vi.fn(() => ({ emit: emitMock })) };
    socket = { on: onMock };
    typingTimeout = null;
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.restoreAllMocks();
  });

  test("should emit 'user typing' event when user starts typing", () => {
    userTyping({ socket, io, typingTimeout });

    // Simulate the event listener being called
    const callback = onMock.mock.calls[0][1];
    callback({ conversationKey: "room1", userName: "Alice" });

    expect(io.to).toHaveBeenCalledWith("room1");
    expect(emitMock).toHaveBeenCalledWith("user typing", { name: "Alice" });
  });

  test("should emit 'user not typing' after timeout", async () => {
    vi.useFakeTimers();
    userTyping({ socket, io, typingTimeout });

    const callback = onMock.mock.calls[0][1];
    callback({ conversationKey: "room1", userName: "Alice" });

    // Fast-forward time
    vi.advanceTimersByTime(1000);

    expect(io.to).toHaveBeenCalledWith("room1");
    expect(emitMock).toHaveBeenCalledWith("user not typing", { userName: "Alice" });
  });

  test("should reset the timeout if user keeps typing", async () => {
    vi.useFakeTimers();
    userTyping({ socket, io, typingTimeout });

    const callback = onMock.mock.calls[0][1];
    callback({ conversationKey: "room1", userName: "Alice" });

    vi.advanceTimersByTime(500);
    callback({ conversationKey: "room1", userName: "Alice" });

    vi.advanceTimersByTime(500); // Should not trigger yet
    expect(emitMock).not.toHaveBeenCalledWith("user not typing", { userName: "Alice" });

    vi.advanceTimersByTime(500); // Now it should trigger
    expect(emitMock).toHaveBeenCalledWith("user not typing", { userName: "Alice" });
  });
});
```