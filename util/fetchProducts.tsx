import NProgress from "nprogress";

export const fetchProducts = async ({ filters, setLoading, pageNumber, setResults, setPageNumber }) => {
  try {
    setLoading(true);
    NProgress.start();
    const queryParams = new URLSearchParams(filters);

    for (const [key, value] of queryParams.entries()) {
      if (!value) {
        queryParams.delete(key);
      }
    }

    queryParams.append('page', pageNumber.toString());

    const queryString = queryParams.toString();

    const response = await fetch(`/api/search?${queryString}`);
    const data = await response.json();
    setResults(data);
    setPageNumber(data.page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    NProgress.done();
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};
