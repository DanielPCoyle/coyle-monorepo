import builder from "@builder.io/react";

interface CategoryData {
  data: {
    inkSoftId: number;
  };
}

interface Product {
  id: number;
  name: string;
  price: number;
  // Add other properties as needed
}

interface ProductApiResponse {
  Data: Product[];
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
  page: unknown; // Replace `unknown` with specific type if available from Builder API
  seo: SEO;
  productData: Product[];
  categoryData: CategoryData | null;
}

// Fetch content for `/products/` URLs
export async function fetchCategoryPageContent(
  slug: string,
): Promise<FetchCategoryPageContentReturn> {
  // Fetch category data from Builder API
  const categoryData = (await builder
    .get("categories", {
      query: {
        data: {
          slug: slug.replace("/category", ""),
        },
      },
    })
    .promise()) as CategoryData;

  const categoryId = categoryData.data.inkSoftId;

  // Fetch product data from external API
  const fetchUrl = `https://cdn.inksoft.com/${process.env.NEXT_PUBLIC_INKSOFT_STORE}/Api2/GetProductBaseList?Format=JSON&Index=0&MaxResults=24&SortFilters=%5B%7B%22Property%22%3A%22Name%22%2C%22Direction%22%3A%22Ascending%22%7D%5D&ProductCategoryIds=%5B${categoryId}%5D&IncludePrices=true&IncludeAllStyles=true&IncludeSizes=false&StoreVersion=638659111691800000&IncludeQuantityPacks=true`;
  let productData: Product[] = []; // Default empty array
  try {
    const response: ProductApiResponse = await fetch(fetchUrl).then((res) =>
      res.json(),
    );
    if (response && response.Data) {
      productData = response.Data;
    }
  } catch (err) {
    console.error("Failed to fetch product data:", err);
    // productData stays as []
  }

  return {
    contentType: "product",
    model: "symbol",
    page: await builder
      .get("symbol", { query: { id: "bfdb4053842f44da9ab8b65c3aa78bf7" } })
      .toPromise(),
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

export default fetchCategoryPageContent;
