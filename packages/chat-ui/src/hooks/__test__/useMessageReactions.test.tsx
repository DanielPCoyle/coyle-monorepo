import React from "react";

import { renderHook, act } from "@testing-library/react";
import { useMessageReactions } from "../useMessageReactions";
import { ChatContext } from "../../ChatContext";
import { vi } from "vitest";
import { ReactNode } from "react";

const mockSocket = {
  on: vi.fn(),
  off: vi.fn(),
  emit: vi.fn(),
};

const mockChatContext = {
  socket: mockSocket,
  email: "test@example.com",
  id: "user-123",
};

const mockMessage = {
  id: "message-123",
  reactions: {
    "test@example.com": ["👍"],
  },
} as any;

const wrapper = ({ children }: { children: ReactNode }) => {
  return (
    <ChatContext.Provider value={mockChatContext}>
      {children}
    </ChatContext.Provider>
  );
};

describe("useMessageReactions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize reactions from the message", () => {
    const { result } = renderHook(() => useMessageReactions(mockMessage), {
      wrapper,
    });

    expect(result.current.reactions).toEqual({ "test@example.com": ["👍"] });
  });

  it("should add a reaction and emit an event", () => {
    const { result } = renderHook(() => useMessageReactions(mockMessage), {
      wrapper,
    });

    act(() => {
      result.current.addReaction({ emoji: "🔥" });
    });

    expect(result.current.reactions).toEqual({
      "test@example.com": ["👍", "🔥"],
    });

    expect(mockSocket.emit).toHaveBeenCalledWith("addReaction", {
      id: "user-123",
      messageId: "message-123",
      reactions: { "test@example.com": ["👍", "🔥"] },
    });
  });

  it("should remove a reaction and emit an event", () => {
    const { result } = renderHook(() => useMessageReactions(mockMessage), {
      wrapper,
    });
  
    act(() => {
      result.current.addReaction({ emoji: "🔥" }); // Ensure there's a reaction first
    });
  
    expect(result.current.reactions).toEqual({
      "test@example.com": ["👍", "🔥"],
    });
  
    act(() => {
      result.current.removeReactions({ emoji: "👍" }); // Remove 👍
    });
  
    expect(result.current.reactions).toEqual({
      "test@example.com": ["🔥"],
    });
  
    act(() => {
      result.current.removeReactions({ emoji: "🔥" }); // Remove last remaining reaction
    });
  
    expect(result.current.reactions).toEqual({}); // Now should be empty
  
    expect(mockSocket.emit).toHaveBeenCalledWith("addReaction", {
      id: "user-123",
      messageId: "message-123",
      reactions: {},
    });
  });

  it("should listen for 'addReaction' socket event and update reactions", () => {
    const { result } = renderHook(() => useMessageReactions(mockMessage), {
      wrapper,
    });

    const callback = mockSocket.on.mock.calls[0][1]; // Extract listener callback
    act(() => {
      callback({ messageId: "message-123", reactions: { "test@example.com": ["😂"] } });
    });

    expect(result.current.reactions).toEqual({ "test@example.com": ["😂"] });
  });

  it("should clean up socket listener on unmount", () => {
    const { unmount } = renderHook(() => useMessageReactions(mockMessage), {
      wrapper,
    });

    unmount();

    expect(mockSocket.off).toHaveBeenCalledWith("addReaction");
  });
});
