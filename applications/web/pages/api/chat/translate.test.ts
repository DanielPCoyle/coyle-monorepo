import { describe, it, expect, vi, beforeEach } from "vitest";
import handler from "./translate"; // adjust path to your API file
import { updateMessage } from "@coyle/chat-db";

vi.mock("@coyle/chat-db", () => ({
  updateMessage: vi.fn(),
}));

describe("POST /api/translate", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    vi.clearAllMocks();

    req = {
      method: "POST",
      body: {
        text: "Hola mundo",
        id: "msg-123",
      },
    };

    res = {
      status: vi.fn(() => res),
      json: vi.fn(),
    };

    global.fetch = vi.fn();
    process.env.NEXT_PUBLIC_OPEN_AI_KEY = "test-openai-key";
  });

  it("should call OpenAI and update the message", async () => {
    const mockTranslated = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              text: "Hello world",
              language: "en",
            }),
          },
        },
      ],
    };

    (fetch as any).mockResolvedValueOnce({
      json: () => Promise.resolve(mockTranslated),
    });

    await handler(req, res);

    expect(fetch).toHaveBeenCalledWith(
      "https://api.openai.com/v1/chat/completions",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer test-openai-key",
        }),
      }),
    );

    expect(updateMessage).toHaveBeenCalledWith("msg-123", {
      translation: {
        text: "Hello world",
        language: "en",
      },
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      id: "msg-123",
      text: "Hello world",
      language: "en",
    });
  });

  it("should handle errors gracefully", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    (fetch as any).mockRejectedValueOnce(new Error("OpenAI error"));

    await handler(req, res);

    expect(consoleSpy).toHaveBeenCalledWith(
      "Error generating blog content:",
      expect.any(Error),
    );

    expect(updateMessage).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled(); // no response in error block

    consoleSpy.mockRestore();
  });

  it("should do nothing for non-POST requests", async () => {
    req.method = "GET";
    await handler(req, res);

    expect(fetch).not.toHaveBeenCalled();
    expect(updateMessage).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
