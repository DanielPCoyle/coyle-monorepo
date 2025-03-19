import { vi, describe, it, expect, beforeEach } from "vitest";
import { fetchMessages } from "../../utils/fetchMessages";

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("fetchMessages", () => {
  let setMessages, setLoading, id, token;

  beforeEach(() => {
    setMessages = vi.fn();
    setLoading = vi.fn();
    id = "123";
    token = "mockToken";
    mockFetch.mockReset();
  });

  it("should not fetch if id is missing", async () => {
    await fetchMessages(null, token, setMessages, setLoading);
    expect(mockFetch).not.toHaveBeenCalled();
    expect(setLoading).not.toHaveBeenCalled();
  });

  it("should set loading state before and after fetch", async () => {
    mockFetch.mockResolvedValueOnce({ json: vi.fn().mockResolvedValueOnce([]) });

    await fetchMessages(id, token, setMessages, setLoading);

    expect(setLoading).toHaveBeenCalledWith(true);
    expect(setLoading).toHaveBeenCalledWith(false);
  });

  it("should fetch and sort messages correctly", async () => {
    const mockData = [
      { id: 3, text: "Hello" },
      { id: 1, text: "First message" },
      { id: 2, text: "Second message" }
    ];

    mockFetch.mockResolvedValueOnce({
      json: vi.fn().mockResolvedValueOnce(mockData),
    });

    await fetchMessages(id, token, setMessages, setLoading);

    expect(mockFetch).toHaveBeenCalledWith(`/api/chat/messages?conversationKey=${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(setMessages).toHaveBeenCalledWith([
      { id: 1, text: "First message" },
      { id: 2, text: "Second message" },
      { id: 3, text: "Hello" }
    ]);
  });

  it("should handle fetch errors and still stop loading", async () => {
    console.error = vi.fn(); // Mock console.error to suppress error logging
    mockFetch.mockRejectedValueOnce(new Error("Network error"));
  
    await expect(fetchMessages(id, token, setMessages, setLoading)).resolves.not.toThrow();
  
    expect(setMessages).not.toHaveBeenCalled();
    expect(setLoading).toHaveBeenCalledWith(false);
  });
});