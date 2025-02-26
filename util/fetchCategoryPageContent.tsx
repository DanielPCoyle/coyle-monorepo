import builder from "@builder.io/react";

interface CategoryData {
  data: {
    inkSoftId: number;
  };
}

interface ProductData {
  Data: any[]; // Replace `any` with a more specific type if available, like ProductItem[]
}

interface ProductApiResponse {
  Data: any[]; // Replace `any` with a more specific type if available
}

interface SEO {
  title: string;
  description: string;
  keywords: string;
  image: string;
  url: string;
}

interface FetchCategoryPageContentReturn {
  contentType: string;
  model: string;
  page: any; // Replace `any` with specific type if available from Builder API
  seo: SEO;
  productData: any[]; // Replace `any` with a more specific type if available
  categoryData: CategoryData | null;
}

// Fetch content for `/products/` URLs
export async function fetchCategoryPageContent(slug: string): Promise<FetchCategoryPageContentReturn> {
  // Fetch category data from Builder API
  const categoryData = (await builder.get("categories", {
    query: {
      data: {
        slug: slug.replace("/category", ""),
      },
    },
  }).promise()) as CategoryData;

  const categoryId = categoryData.data.inkSoftId;

  // Fetch product data from external API
  let productData: any[] = []; // Default empty array for product data
  const fetchUrl = `https://cdn.inksoft.com/${process.env.NEXT_PUBLIC_INKSOFT_STORE}/Api2/GetProductBaseList?Format=JSON&Index=0&MaxResults=24&SortFilters=%5B%7B%22Property%22%3A%22Name%22%2C%22Direction%22%3A%22Ascending%22%7D%5D&ProductCategoryIds=%5B${categoryId}%5D&IncludePrices=true&IncludeAllStyles=true&IncludeSizes=false&StoreVersion=638659111691800000&IncludeQuantityPacks=true`;

  const response: ProductApiResponse = await fetch(
    fetchUrl
  ).then((res) => res.json());

  if (response && response.Data) {
    productData = response.Data; // Assign only the Data property
  }

  return {
    contentType: "product",
    model: "symbol",
    page: await builder.get("symbol", { query: { id: "bfdb4053842f44da9ab8b65c3aa78bf7" } }).toPromise(),
    seo: {
      title: "CAT TITLE",
      description: "",
      keywords: "",
      image: "",
      url: `https://philadelphiascreenprinting.com/category/${slug}`,
    },
    productData,
    categoryData: categoryData || null,
  };
}
