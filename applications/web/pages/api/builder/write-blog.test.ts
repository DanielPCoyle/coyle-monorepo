import { describe, it, expect, vi, beforeEach } from "vitest";
import handler from "./write-blog"; // Adjust if needed
import { NextApiRequest, NextApiResponse } from "next";

vi.mock("node-fetch", async () => {
  const actual: any = await vi.importActual("node-fetch");
  return {
    ...actual,
    default: vi.fn(),
  };
});

const mockFetch = vi.mocked(await import("node-fetch")).default;

const mockTitles = `["Custom Tees for Events", "Philly Screen Printing Trends", "Local Merch Magic"]`;
const mockBlogContent = {
  content: "<article>Test HTML</article>",
  seoTitleTag: "SEO Title",
  seoDescription: "SEO Desc",
  tagLine: "Tagline",
  tags: ["screen printing", "philly"],
};
const mockImageURL = "https://image.url";
const mockUploadedURL = "https://builder.io/image.jpg";

function createMockReqRes(method = "POST") {
  const req = {
    method,
  } as unknown as NextApiRequest;

  let jsonResult: any;
  const res = {
    status: vi.fn(() => res),
    json: vi.fn((data) => {
      jsonResult = data;
      return res;
    }),
    setHeader: vi.fn(),
    end: vi.fn(),
  } as unknown as NextApiResponse;

  return { req, res, jsonResult: () => jsonResult };
}

describe("API - /api/blog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    let fetchCount = 0;

    mockFetch.mockImplementation(async (url: any, options: any) => {
      fetchCount++;

      // 1st fetch: get blog titles
      if (url.includes("chat/completions") && fetchCount === 1) {
        return {
          json: async () => ({
            choices: [{ message: { content: mockTitles } }],
          }),
          ok: true,
        } as any;
      }

      // 2nd, 3rd, 4th fetch: generate blog content
      if (url.includes("chat/completions")) {
        return {
          json: async () => ({
            choices: [
              { message: { content: JSON.stringify(mockBlogContent) } },
            ],
          }),
          ok: true,
        } as any;
      }

      // Featured image generation
      if (url.includes("/images/generations")) {
        return {
          json: async () => ({
            data: [{ url: mockImageURL }],
          }),
          ok: true,
        } as any;
      }

      // Upload image
      if (url === mockImageURL) {
        return {
          buffer: async () => Buffer.from("image-bytes"),
        } as any;
      }

      if (url.includes("/upload")) {
        return {
          json: async () => ({ url: mockUploadedURL }),
          ok: true,
        } as any;
      }

      // Builder blog save
      if (url.includes("/write/blog")) {
        return {
          json: async () => ({ id: "builder-blog-id" }),
          ok: true,
        } as any;
      }

      throw new Error("Unexpected fetch call");
    });
  });

  it("returns 201 and blog posts on success", async () => {
    const { req, res, jsonResult } = createMockReqRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
    const result = jsonResult();

    expect(result).toHaveLength(3);
    expect(result[0].title).toBe("Custom Tees for Events");
    expect(result[0].content.content).toContain("<article>");
  });

  it("returns 405 for non-POST", async () => {
    const { req, res } = createMockReqRes("GET");

    await handler(req, res);

    expect(res.setHeader).toHaveBeenCalledWith("Allow", ["POST"]);
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.end).toHaveBeenCalledWith("Method GET Not Allowed");
  });

  it("returns 500 on fetch failure", async () => {
    mockFetch.mockImplementationOnce(() => {
      throw new Error("OpenAI API failure");
    });

    const { req, res } = createMockReqRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Failed to save the blog post",
    });
  });
});
