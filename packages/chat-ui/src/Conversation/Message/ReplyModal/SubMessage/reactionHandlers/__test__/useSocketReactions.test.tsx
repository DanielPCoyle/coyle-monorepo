import { renderHook, act } from "@testing-library/react";
import { vi } from "vitest";
import { useSocketReactions } from "../useSocketReactions";

describe("useSocketReactions", () => {
  it("should set reactions when 'addReaction' event is received", () => {
    const mockSetReactions = vi.fn();
    const mockSocket = {
      on: vi.fn(),
      off: vi.fn(),
    };
    const reply = { id: "123" };

    const { unmount } = renderHook(() =>
      useSocketReactions(mockSocket, reply, mockSetReactions)
    );

    // Find event listener for "addReaction"
    const eventCallback = mockSocket.on.mock.calls.find(
      (call) => call[0] === "addReaction"
    )?.[1];

    expect(mockSocket.on).toHaveBeenCalledWith("addReaction", expect.any(Function));

    // Simulate receiving a reaction update
    act(() => {
      eventCallback?.({ messageId: "123", reactions: { "user@example.com": ["👍"] } });
    });

    expect(mockSetReactions).toHaveBeenCalledWith({ "user@example.com": ["👍"] });

    // Ensure cleanup removes event listener
    unmount();
    expect(mockSocket.off).toHaveBeenCalledWith("addReaction", eventCallback);
  });

  it("should do nothing if socket is undefined", () => {
    const mockSetReactions = vi.fn();
    const reply = { id: "123" };

    renderHook(() => useSocketReactions(undefined, reply, mockSetReactions));

    expect(mockSetReactions).not.toHaveBeenCalled();
  });

});
