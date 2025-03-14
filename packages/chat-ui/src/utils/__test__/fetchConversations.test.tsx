import { vi, describe, it, expect, beforeEach } from "vitest";
import { fetchConversations } from "../../utils/fetchConversations";

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("fetchConversations", () => {
  let setConversations;
  let token;
  let user;

  beforeEach(() => {
    setConversations = vi.fn();
    token = "mockToken";
    user = { role: "admin" };
    mockFetch.mockReset();
  });

  it("should not fetch if user is not an admin", async () => {
    await fetchConversations(token, setConversations, { role: "user" });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("should not fetch if token is missing", async () => {
    await fetchConversations(null, setConversations, user);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("should fetch and process conversations correctly", async () => {
    const mockData = [
      { name: "Alice", conversationKey: "123" },
      { name: "Bob", conversationKey: "456" }
    ];
    
    mockFetch.mockResolvedValueOnce({
      json: vi.fn().mockResolvedValueOnce(mockData),
    });

    await fetchConversations(token, setConversations, user);

    expect(mockFetch).toHaveBeenCalledWith("/api/chat/conversations", {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(setConversations).toHaveBeenCalledWith([
      { name: "Alice", conversationKey: "123", user: "Alice", id: "123" },
      { name: "Bob", conversationKey: "456", user: "Bob", id: "456" },
    ]);
  });

  it("should handle fetch errors gracefully", async () => {
    console.error = vi.fn(); // Mock console.error to prevent actual logging
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    await fetchConversations(token, setConversations, user);

    expect(console.error).toHaveBeenCalledWith("Fetch error:", expect.any(Error));
    expect(setConversations).not.toHaveBeenCalled();
  });
});
