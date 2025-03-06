import { describe, it, expect, vi } from "vitest";
import axios from "axios";
import { createMocks } from "node-mocks-http";
import handler from "@coyle/web/pages/api/chat/url-preview"; // Update this path to your actual handler

vi.mock("axios");

describe("/api/chat/url-preview", () => {
  it("should return metadata for a valid URL", async () => {
    const html = `
            <html>
                <head>
                    <title>Test Title</title>
                    <meta name="description" content="Test Description">
                    <meta property="og:image" content="test-image.jpg">
                </head>
            </html>
        `;
    (axios.get as vi.Mock).mockResolvedValue({ data: html });

    const { req, res } = createMocks({
      method: "GET",
      query: {
        url: "http://example.com",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      title: "Test Title",
      description: "Test Description",
      image: "test-image.jpg",
      url: "http://example.com",
    });
  });
});
