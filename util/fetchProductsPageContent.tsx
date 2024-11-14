import friendlyUrl from '../data/slugIds.json';
import builder from "@builder.io/react";
import { fetchFacets } from './fetchFacets';

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
  
   
  
  const facets = await fetchFacets();

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

