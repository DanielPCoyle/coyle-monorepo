import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchPostContent } from "../fetchPostContent";
import { calculateReadingTime } from "../calculateReadingTime";

// Mock environment variable
vi.stubEnv("NEXT_PUBLIC_BUILDER_API_KEY", "fake-api-key");

// Mock calculateReadingTime
vi.mock("./calculateReadingTime", () => ({
  calculateReadingTime: vi.fn(() => "3 min read"),
}));

// Mock global fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        results: [
          {
            data: {
              slug: "/my-post",
              body: "This is a test blog post body.",
            },
          },
        ],
      }),
  }),
) as any;

// Mock builder.get().toPromise()
vi.mock("@builder.io/react", async () => {
  const actual =
    await vi.importActual<typeof import("@builder.io/react")>(
      "@builder.io/react",
    );
  return {
    ...actual,
    default: {
      ...actual.default,
      get: vi.fn(() => ({
        toPromise: () =>
          Promise.resolve({ data: { title: "Test Symbol Page" } }),
      })),
    },
  };
});

describe("fetchPostContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches blog data and returns post content with reading time and symbol page", async () => {
    const result = await fetchPostContent("/post/my-post");

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("query.data.slug=/my-post"),
    );
    expect(calculateReadingTime).toHaveBeenCalledWith(
      "This is a test blog post body.",
    );

    expect(result).toEqual({
      contentType: "post",
      model: "symbol",
      page: { data: { title: "Test Symbol Page" } },
      blogData: {
        data: {
          slug: "/my-post",
          body: "This is a test blog post body.",
        },
        readingTime: "3 min read",
      },
    });
  });
});
