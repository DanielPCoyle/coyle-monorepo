import { createMocks } from "node-mocks-http";
import handler from "../conversations";
import { getConversations } from "@coyle/database";
import { describe, it, expect, vi } from "vitest";
import { NextApiRequest, NextApiResponse } from "next";

vi.mock("@coyle/database");

describe("/api/chat/conversations API Endpoint", () => {
  it("should return a list of conversations with status 200", async () => {
    const mockConversations = [
      { id: 1, message: "Hello" },
      { id: 2, message: "Hi" },
    ];

    (getConversations as vi.Mock).mockResolvedValue(mockConversations);

    const { req, res } = createMocks();
    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual(mockConversations);
  });

  it("should handle errors correctly", async () => {
    (getConversations as vi.Mock).mockRejectedValue(
      new Error("Database error"),
    );

    const { req, res } = createMocks();

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData().error).toEqual("Internal Server Error");
  });
});
