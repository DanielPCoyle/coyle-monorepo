import friendlyUrl from '../data/slugIds.json';
import builder from "@builder.io/react";

interface ProductData {
  Name?: string;
  // Other fields as needed from product API response
}

interface SEO {
  title: string | null;
  description: string;
  keywords: string;
  image: string;
  url: string;
}

interface FetchProductsPageContentReturn {
  contentType: string;
  model: string;
  page: any; // Replace `any` with a specific type if available from Builder API
  seo: SEO;
  facets: any;
}

// Fetch content for `/products/` URLs
export async function fetchProductsPageContent(slug: string): Promise<FetchProductsPageContentReturn> {
  
   const fetchFacets = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/search-facets");
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const facets = data;
      return facets;
    } catch (error) {
      console.error('Error fetching facets:', error);
      return null;
    }
  };
  
  const facets = await fetchFacets();

  console.log({facets});
  return {
    contentType: "product",
    model: "symbol",
    page: await builder.get("symbol", { query: { id: "bfdb4053842f44da9ab8b65c3aa78bf7" } }).toPromise(),
    seo: {
      title: null,
      // title: productData.Name?.length < 40 ? `${productData.Name} | Philadelphia Screen Printing` : productData.Name,
      description: "",
      keywords: "",
      image: "",
      url: `https://philadelphiascreenprinting.com/products/${slug}`,
    },
    facets,
  };
}
