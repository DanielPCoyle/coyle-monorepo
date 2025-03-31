import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fetchProducts } from "../fetchProducts"; // Adjust path

describe("fetchProducts", () => {
  const fetchMock = vi.fn();
  const scrollToMock = vi.fn();
  const setLoading = vi.fn();
  const setResults = vi.fn();
  const setPageNumber = vi.fn();
  const setFilterFacets = vi.fn();

  const mockData = {
    page: 2,
    facets: {
      Categories: ["Shirts"],
      Manufacturer: ["Brand A"],
      "Styles.Color": ["Red"],
    },
    items: [{ id: 1, name: "T-shirt" }],
  };

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    vi.useFakeTimers();
    vi.stubGlobal("window", { scrollTo: scrollToMock });

    fetchMock.mockResolvedValue({
      json: () => Promise.resolve(mockData),
    });

    vi.clearAllMocks();
    process.env.REACT_APP_API_BASE_URL = "https://example.com";
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("fetches products and updates state correctly", async () => {
    const filters = {
      category: "shirts",
      color: "",
    };

    await fetchProducts({
      filters,
      setLoading,
      pageNumber: 2,
      setResults,
      setPageNumber,
      setFilterFacets,
    });

    // ✅ Filters without empty values
    expect(fetch).toHaveBeenCalledWith(
      "https://example.com/api/search/search?category=shirts&page=2",
    );

    expect(setLoading).toHaveBeenCalledWith(true);
    expect(setResults).toHaveBeenCalledWith(mockData);
    expect(setPageNumber).toHaveBeenCalledWith(2);

    expect(setFilterFacets).toHaveBeenCalledWith({
      categories: ["Shirts"],
      manufacturer: ["Brand A"],
      color: ["Red"],
    });

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });

    // Simulate delayed setLoading(false)
    vi.runAllTimers();
    expect(setLoading).toHaveBeenLastCalledWith(false);
  });

  it("handles fetch error gracefully", async () => {
    fetchMock.mockRejectedValueOnce(new Error("Network error"));

    await fetchProducts({
      filters: {},
      setLoading,
      pageNumber: 1,
      setResults,
      setPageNumber,
      setFilterFacets,
    });

    // Loading is still set to true even on failure
    expect(setLoading).toHaveBeenCalledWith(true);
    // Error caught and logged (can test with spy if needed)
  });
});
