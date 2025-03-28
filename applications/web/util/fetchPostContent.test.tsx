import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchPostContent } from "./fetchPostContent"; // Adjust path
import builder from "@builder.io/react";
import { calculateReadingTime } from "./calculateReadingTime";

vi.mock("@builder.io/react", () => ({
  default: {
    get: vi.fn(),
  },
}));

vi.mock("../calculateReadingTime", () => {
    return {
      calculateReadingTime: vi.fn(), // correct way to mock a named export
    };
  });

describe.skip("fetchPostContent", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    vi.clearAllMocks();

    process.env.NEXT_PUBLIC_BUILDER_API_KEY = "test-api-key";

    // Mock builder symbol
    (builder.get as any).mockReturnValue({
      toPromise: vi.fn().mockResolvedValue({ data: { title: "Symbol Page" } }),
    });
  });

  it("should return post content with calculated reading time", async () => {
    const mockBlog = {
      data: {
        slug: "/my-blog-post",
        body: "<article>This is a test blog</article>",
      },
    };

    fetchMock.mockResolvedValueOnce({
      json: () =>
        Promise.resolve({
          results: [mockBlog],
        }),
    });

    (calculateReadingTime as any).mockReturnValue("3 min read");

    const result = await fetchPostContent("/post/my-blog-post");

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("query.data.slug=/my-blog-post")
    );

    expect(calculateReadingTime).toHaveBeenCalledWith(mockBlog.data.body);

    expect(result).toEqual({
      contentType: "post",
      model: "symbol",
      page: { data: { title: "Symbol Page" } },
      blogData: {
        ...mockBlog,
        readingTime: "3 min read",
      },
    });
  });

  it("should work with nested post paths", async () => {
    const mockBlog = {
      data: {
        slug: "/blog/special-post",
        body: "Some long content...",
      },
    };

    fetchMock.mockResolvedValueOnce({
      json: () =>
        Promise.resolve({
          results: [mockBlog],
        }),
    });

    (calculateReadingTime as any).mockReturnValue("10 min read");

    const result = await fetchPostContent("/post/blog/special-post");

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("query.data.slug=/blog/special-post")
    );

    expect(result.blogData.readingTime).toBe("10 min read");
  });

  it("should fail gracefully if no blog is found", async () => {
    fetchMock.mockResolvedValueOnce({
      json: () => Promise.resolve({ results: [] }),
    });

    await expect(fetchPostContent("/post/unknown")).resolves.toMatchObject({
      blogData: undefined,
    });
  });
});
