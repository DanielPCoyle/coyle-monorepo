
export const fetchProducts = async ({
  filters,
  setLoading,
  pageNumber,
  setResults,
  setPageNumber,
  setFilterFacets,
}) => {
  try {
    setLoading(true);
    const queryParams = new URLSearchParams(filters);

    for (const [key, value] of queryParams.entries()) {
      if (!value) {
        queryParams.delete(key);
      }
    }

    queryParams.append("page", pageNumber.toString());

    const queryString = queryParams.toString();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/search/search?${queryString}`);
    const data = await response.json();
    setResults(data);
    setPageNumber(data.page);
    if (data?.facets) {
      setFilterFacets({
        categories: data.facets.Categories,
        manufacturer: data.facets.Manufacturer,
        color: data.facets["Styles.Color"],
      });
    }
    if(typeof window !== 'undefined'){
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};
