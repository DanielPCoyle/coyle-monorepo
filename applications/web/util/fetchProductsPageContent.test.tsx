import { describe, it, expect, vi, beforeEach } from "vitest";
import fetchProductsPageContent from "./fetchProductsPageContent"; // adjust path
import builder from "@builder.io/react";

vi.mock("@builder.io/react", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("fetchProductsPageContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (builder.get as any).mockReturnValue({
      toPromise: vi
        .fn()
        .mockResolvedValue({ data: { title: "Mock Product Page" } }),
    });
  });

  it("should return products page content with correct SEO URL", async () => {
    const result = await fetchProductsPageContent("hoodies");

    expect(builder.get).toHaveBeenCalledWith("symbol", {
      query: { id: "bfdb4053842f44da9ab8b65c3aa78bf7" },
    });

    expect(result).toEqual({
      contentType: "product",
      model: "symbol",
      page: { data: { title: "Mock Product Page" } },
      seo: {
        title: null,
        description: "",
        keywords: "",
        image: "",
        url: "https://philadelphiascreenprinting.com/products/hoodies",
      },
    });
  });

  it("should handle empty slug properly", async () => {
    const result = await fetchProductsPageContent("");

    expect(result.seo.url).toBe(
      "https://philadelphiascreenprinting.com/products/",
    );
  });
});
