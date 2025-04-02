import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchCategoryPageContent } from "../fetchCategoryPageContent";
import builder from "@builder.io/react";

// Mock builder.io
vi.mock("@builder.io/react", () => ({
  default: {
    get: vi.fn(() => ({
      promise: vi.fn(),
      toPromise: vi.fn(),
    })),
  },
}));

describe("fetchCategoryPageContent", () => {
  const mockCategoryData = {
    data: {
      inkSoftId: 1234,
    },
  };

  const mockProductResponse = {
    Data: [
      { id: 1, name: "T-shirt", price: 12.99 },
      { id: 2, name: "Hoodie", price: 24.99 },
    ],
  };

  const mockPageContent = { some: "builder-page-content" };

  beforeEach(() => {
    vi.clearAllMocks();

    // Set up builder mocks
    (builder.get as any).mockImplementation((model: string) => {
      return {
        promise: vi.fn().mockResolvedValue(mockCategoryData),
        toPromise: vi.fn().mockResolvedValue(mockPageContent),
      };
    });

    // Mock global fetch
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockProductResponse),
      }),
    ) as any;

    process.env.NEXT_PUBLIC_INKSOFT_STORE = "demo-store";
  });

  it("should return category content and product data", async () => {
    const result = await fetchCategoryPageContent("t-shirts");

    expect(builder.get).toHaveBeenCalledWith("categories", {
      query: {
        data: {
          slug: "t-shirts",
        },
      },
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("ProductCategoryIds=%5B1234%5D"),
    );
    expect(result.productData).toHaveLength(2);
    expect(result.productData[0].name).toBe("T-shirt");

    expect(result.categoryData).toEqual(mockCategoryData);
    expect(result.page).toEqual(mockPageContent);
    expect(result.seo.title).toBe("CAT TITLE");
  });

  it("should return empty productData if fetch fails", async () => {
    (global.fetch as any).mockImplementationOnce(() =>
      Promise.reject(new Error("Fetch failed")),
    );

    const result = await fetchCategoryPageContent("hats");

    expect(result.productData).toEqual([]);
    expect(result.seo.url).toContain("/category/hats");
  });
});
