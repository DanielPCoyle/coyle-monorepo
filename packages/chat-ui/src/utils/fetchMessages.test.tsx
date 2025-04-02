import { vi, describe, it, expect } from "vitest";
import { fetchMessages } from "./fetchMessages";

const mockSetMessages = vi.fn();
const mockSetLoading = vi.fn();

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("fetchMessages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does nothing if id is not provided", async () => {
    await fetchMessages(null, "token", mockSetMessages, mockSetLoading);
    expect(mockSetLoading).not.toHaveBeenCalled();
    expect(mockSetMessages).not.toHaveBeenCalled();
  });

  it("fetches messages and updates state", async () => {
    const mockData = [{ id: 2 }, { id: 1 }];
    mockFetch.mockResolvedValueOnce({
      json: async () => mockData,
    });

    await fetchMessages("123", "token", mockSetMessages, mockSetLoading);

    expect(mockSetLoading).toHaveBeenCalledWith(true);
    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.REACT_APP_API_BASE_URL}/api/chat/messages?conversationKey=123&offset=0&limit=10`,
      {
        headers: { Authorization: "Bearer token" },
      },
    );
    const setMessagesArg = mockSetMessages.mock.calls[0][0];
    const result = setMessagesArg([]);
    expect(result).toEqual([{ id: 1 }, { id: 2 }]);
    expect(mockSetLoading).toHaveBeenCalledWith(false);
  });

  it("handles fetch error correctly", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    await fetchMessages("123", "token", mockSetMessages, mockSetLoading);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Fetch error:",
      new Error("Network error"),
    );
    expect(mockSetLoading).toHaveBeenCalledWith(true);
    expect(mockSetLoading).toHaveBeenCalledWith(false);

    consoleErrorSpy.mockRestore();
  });
});
