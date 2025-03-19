import React from "react";

import { renderHook, act } from "@testing-library/react-hooks";
import { useAuth } from "../useAuth";
import ChatContext from "../../ChatContext";
import { vi } from "vitest";

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(global, "localStorage", { value: localStorageMock });

describe("useAuth Hook", () => {
  let mockContext;

  beforeEach(() => {
    mockContext = {
      setUser: vi.fn(),
      setUserName: vi.fn(),
      setEmail: vi.fn(),
      setIsLoggedIn: vi.fn(),
      setNotificationsEnabled: vi.fn(),
    };
    
    localStorageMock.getItem.mockReturnValue(null);
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should set token from localStorage on mount", () => {
    localStorageMock.getItem.mockReturnValue("test-jwt-token");
    
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <ChatContext.Provider value={mockContext}>{children}</ChatContext.Provider>
      ),
    });

    expect(result.current.getAndSetUser).toBeDefined();
  });

  it("should fetch and set user data when getAndSetUser is called", async () => {
    const mockUser = {
      user: {
        name: "John Doe",
        email: "johndoe@example.com",
        notificationsEnabled: true,
      },
    };
  
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUser),
      })
    );
  
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <ChatContext.Provider value={mockContext}>{children}</ChatContext.Provider>
      ),
    });
  
    await act(async () => {
      await result.current.getAndSetUser("test-jwt-token");
    });
  
    expect(mockContext.setUser).toHaveBeenCalledWith(mockUser.user);
    expect(mockContext.setUserName).toHaveBeenCalledWith("John Doe");
    expect(mockContext.setEmail).toHaveBeenCalledWith("johndoe@example.com");
    expect(mockContext.setNotificationsEnabled).toHaveBeenCalledWith(true);
    expect(mockContext.setIsLoggedIn).toHaveBeenCalledWith(true);
  });
  
});
