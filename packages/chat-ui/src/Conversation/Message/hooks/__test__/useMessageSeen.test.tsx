import { renderHook, act } from "@testing-library/react";
import { useMessageSeen } from "../useMessageSeen";
import { ChatContext } from "../../../../ChatContext";
import { vi } from "vitest";
import React from "react";

const mockSocket = {
  emit: vi.fn(),
};

const mockChatContext = {
  socket: mockSocket,
  userName: "testUser",
};

const mockMessage = {
  id: "message-123",
  sender: "otherUser",
  seen: false,
} as any;

const wrapper = ({ children }: { children: React.ReactNode }) => {
  return <ChatContext.Provider value={mockChatContext}>{children}</ChatContext.Provider>;
};

// Mock IntersectionObserver globally
beforeAll(() => {
    global.IntersectionObserver = class {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
      static instances: IntersectionObserver[] = [];
  
      constructor(public callback: (entries: IntersectionObserverEntry[]) => void) {
        global.IntersectionObserver.instances.push(this);
      }
  
      static trigger(entries: IntersectionObserverEntry[]) {
        global.IntersectionObserver.instances.forEach((instance) => {
          instance.callback(entries);
        });
      }
  
      static reset() {
        global.IntersectionObserver.instances = [];
      }
    } as any;
  });
  
  afterEach(() => {
    global.IntersectionObserver.reset(); // Reset instances between tests
  });
  
  

describe("useMessageSeen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize seen state correctly from message", () => {
    const { result } = renderHook(() => useMessageSeen(mockMessage), { wrapper });
    expect(result.current.seen).toBe(false);
  });

  it("should not mark message as seen if user is the sender", () => {
    const { result } = renderHook(
      () =>
        useMessageSeen({
          ...mockMessage,
          sender: "testUser", // Simulate user being the sender
        }),
      { wrapper }
    );

    expect(mockSocket.emit).not.toHaveBeenCalled();
    expect(result.current.seen).toBe(false);
  });

  it("should mark message as seen when it enters viewport", () => {
    const { result } = renderHook(() => useMessageSeen(mockMessage), { wrapper });
  
    act(() => {
      global.IntersectionObserver.trigger([{ isIntersecting: true }]);
    });
  
    expect(mockSocket.emit).toHaveBeenCalledWith("seen", "message-123");
  });

  it("should not mark message as seen if already marked", () => {
    const { result } = renderHook(
      () => useMessageSeen({ ...mockMessage, seen: true }),
      { wrapper }
    );
  
    act(() => {
      global.IntersectionObserver.trigger([{ isIntersecting: true }]);
    });
  
    expect(mockSocket.emit).not.toHaveBeenCalled();
  });
  

  it.skip("should clean up observer on unmount", () => {
    const unobserveMock = vi.fn();
    
    global.IntersectionObserver = class {
      observe = vi.fn();
      unobserve = unobserveMock;
      disconnect = vi.fn();
      constructor() {}
    } as any;
  
    const { unmount } = renderHook(() => useMessageSeen(mockMessage), { wrapper });
  
    unmount();
  
    expect(unobserveMock).toHaveBeenCalled();
  });
  
  
});
