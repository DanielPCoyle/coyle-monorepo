import { describe, it, expect, vi, beforeEach } from "vitest";
import handler from "./update-conversation-language"; // Adjust path if needed
import { updateConversationByKey } from "@coyle/chat-db";

vi.mock("@coyle/chat-db", () => ({
  updateConversationByKey: vi.fn(),
}));

describe("POST /api/update-language", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      method: "POST",
      body: {
        id: "conversation-123",
        language: "es",
      },
    };

    res = {
      status: vi.fn(() => res),
      json: vi.fn(),
      setHeader: vi.fn(),
      end: vi.fn(),
    };

    vi.clearAllMocks();
  });

  it("should update conversation language and return 200", async () => {
    await handler(req, res);

    expect(updateConversationByKey).toHaveBeenCalledWith("conversation-123", {
      language: "es",
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Conversation language updated successfully",
    });
  });

  it("should return 500 if updateConversationByKey throws", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    (updateConversationByKey as any).mockRejectedValue(new Error("DB error"));

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error updating conversation language",
    });

    consoleSpy.mockRestore();
  });

  it("should return 405 for non-POST methods", async () => {
    req.method = "GET";

    await handler(req, res);

    expect(res.setHeader).toHaveBeenCalledWith("Allow", ["POST"]);
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.end).toHaveBeenCalledWith("Method GET Not Allowed");
  });

  it("should return 500 if outer try/catch fails", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    // Simulate failure in `res.setHeader` (outer try/catch block)
    req.method = "PUT";
    res.setHeader = vi.fn(() => {
      throw new Error("Header error");
    });

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal Server Error" });

    consoleSpy.mockRestore();
  });
});
