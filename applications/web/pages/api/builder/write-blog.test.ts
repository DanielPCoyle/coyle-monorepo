import { describe, it, expect, vi, beforeEach } from "vitest";
import handler from "./write-blog"; // Adjust the path to your API file
import type { NextApiRequest, NextApiResponse } from "next";

// Mock global fetch
const fetchMock = vi.fn();

vi.stubGlobal("fetch", fetchMock);

describe("POST /api/write-blog", () => {
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;

  beforeEach(() => {
    vi.clearAllMocks();

    req = {
      method: "POST",
    };

    res = {
      status: vi.fn(() => res),
      json: vi.fn(),
      setHeader: vi.fn(),
      end: vi.fn(),
    };

    process.env.NEXT_PUBLIC_OPEN_AI_KEY = "fake-openai-key";
    process.env.NEXT_PUBLIC_BUILDER_IO_PRIVATE_KEY = "fake-builder-key";
  });

  it.skip("should return 201 with generated blog posts", async () => {
    // 1. Mock OpenAI response for blog titles
    fetchMock.mockResolvedValueOnce({
      json: () =>
        Promise.resolve({
          choices: [
            {
              message: {
                content: JSON.stringify([
                  "Best Custom T-Shirts in Philly",
                  "Why Screen Printing Rocks",
                  "Top 5 Uses for Custom Hoodies",
                ]),
              },
            },
          ],
        }),
      ok: true,
    });

    // 2. Mock OpenAI response for blog content (for each title)
    const blogContentMock = {
      content: "<article>Blog HTML here</article>",
      seoTitleTag: "SEO Title",
      seoDescription: "SEO Description",
      tagLine: "Awesome tagline",
      tags: ["screen printing", "custom shirts"],
    };

    fetchMock.mockResolvedValue({
      json: () =>
        Promise.resolve({
          choices: [
            {
              message: {
                content: JSON.stringify(blogContentMock),
              },
            },
          ],
        }),
      ok: true,
    });

    // 3. Mock image generation (DALL·E)
    fetchMock.mockResolvedValueOnce({
      json: () =>
        Promise.resolve({
          data: [{ url: "https://image-url.com/fake.png" }],
        }),
      ok: true,
    });

    // 4. Mock image upload to Builder
    fetchMock.mockResolvedValueOnce({
      buffer: () => Promise.resolve(Buffer.from("fake-image")),
    });

    fetchMock.mockResolvedValueOnce({
      json: () => Promise.resolve({ url: "https://cdn.builder.io/image.png" }),
      ok: true,
    });

    // 5. Mock blog post save to Builder
    fetchMock.mockResolvedValueOnce({
      json: () => Promise.resolve({ id: "saved-id" }),
      ok: true,
    });

    await handler(req as any, res as any);

    expect(fetchMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.any(Array));
  });

  it("should return 405 if method is not POST", async () => {
    req.method = "GET";

    await handler(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.end).toHaveBeenCalledWith("Method GET Not Allowed");
  });

  it("should return 500 if OpenAI fails", async () => {
    fetchMock.mockRejectedValueOnce(new Error("OpenAI API failure"));

    await handler(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Failed to save the blog post",
    });
  });
});
