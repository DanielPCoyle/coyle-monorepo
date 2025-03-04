import builder from "@builder.io/react";
import { fetchFacets } from "./fetchFacets";

interface SEO {
  title: string | null;
  description: string;
  keywords: string;
  image: string;
  url: string;
}

interface PageData {
  data?: {
    title?: string;
    description?: string;
    featuredImage?: string;
  };
}

interface Facet {
  // Define the structure of a facet
}

interface FetchProductsPageContentReturn {
  contentType: string;
  model: string;
  page: PageData | null;
  seo: SEO;
  facets: Facet[];
}

// Fetch content for `/products/` URLs
export async function fetchProductsPageContent(
  slug: string,
): Promise<FetchProductsPageContentReturn> {
  const facets = await fetchFacets(null);

  return {
    contentType: "product",
    model: "symbol",
    page: await builder
      .get("symbol", { query: { id: "bfdb4053842f44da9ab8b65c3aa78bf7" } })
      .toPromise(),
    seo: {
      title: null,
      description: "",
      keywords: "",
      image: "",
      url: `https://philadelphiascreenprinting.com/products/${slug}`,
    },
    facets,
  };
}

export default fetchProductsPageContent;
