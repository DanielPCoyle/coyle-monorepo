import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchGeneralPageContent } from "./fetchGeneralPageContent"; // Adjust path
import builder from "@builder.io/react";

vi.mock("@builder.io/react", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("fetchGeneralPageContent", () => {
  const toPromiseMock = vi.fn();

  const mockPage = {
    data: {
      title: "Mock Page Title",
      description: "Mock Page Description",
      featuredImage: "https://image.jpg",
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    (builder.get as any).mockImplementation(() => ({
      toPromise: toPromiseMock,
    }));

    toPromiseMock.mockResolvedValue(mockPage);

    process.env.NEXT_PUBLIC_BUILDER_API_KEY = "test-builder-key";

    global.fetch = vi.fn();
  });

  it("should return general page content with SEO", async () => {
    const result = await fetchGeneralPageContent("/about", "about", 0, 10);

    expect(builder.get).toHaveBeenCalledWith("page", {
      userAttributes: { urlPath: "/about" },
    });

    expect(result).toEqual({
      contentType: "WebPage",
      model: "page",
      page: mockPage,
      seo: {
        title: "Mock Page Title",
        description: "Mock Page Description",
        image: "https://image.jpg",
      },
      blogData: null,
      pagination: {
        offset: 0,
        limit: 10,
        search: null,
      },
    });
  });

  it("should return blog posts if URL includes /blog and slug is not 'blog'", async () => {
    const blogPosts = [
      {
        data: {
          title: "Post 1",
          description: "Desc",
          featuredImage: "img.png",
          body: "<article>content</article>",
        },
      },
    ];

    (fetch as any).mockResolvedValueOnce({
      json: () => Promise.resolve({ results: blogPosts }),
    });

    const result = await fetchGeneralPageContent(
      "/blog/philly/3",
      "philly",
      0,
      10,
    );

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("&query.data.title.$regex=philly"),
    );
    expect(result.blogData).toEqual(blogPosts);
    expect(result.pagination.search).toBe("philly");
  });

  it("should fall back to default SEO if page data is missing", async () => {
    toPromiseMock.mockResolvedValueOnce({}); // page with no data

    const result = await fetchGeneralPageContent("/contact", "contact", 0, 10);

    expect(result.seo).toEqual({
      title: "Philadelphia Screen Printing",
      description: "Philadelphia Screen Printing",
      image: null,
    });
  });

  it("should handle fetch error gracefully", async () => {
    (fetch as any).mockRejectedValueOnce(new Error("Network error"));

    const result = await fetchGeneralPageContent("/blog/fail", "fail", 0, 10);

    expect(result.blogData).toBeNull();
  });
});
