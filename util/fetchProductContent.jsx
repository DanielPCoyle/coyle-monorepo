import friendlyUrl from '@/data/friendly_urls';
import builder from "@builder.io/react";

// Fetch content for `/products/` URLs
export async function fetchProductContent(slug) {
  const productId = friendlyUrl[slug];
  let productData = await fetch(`https://cdn.inksoft.com/philadelphiascreenprinting/Api2/GetProduct?ProductId=${productId}&IncludeQuantityPacks=true&IncludePricing=true&StoreVersion=1730304704667`)
    .then(res => res.json());
  productData = productData.Data;

  return {
    contentType: "product",
    model: "symbol",
    page: await builder.get("symbol", { query: { id: "c7eb7b53f2e04d4f8bd39f2b728d3551" } }).toPromise(),
    seo: {
      title: null,
      // title: productData.Name?.length < 40 ? `${productData.Name} | Philadelphia Screen Printing` : productData.Name,
      description: "",
      keywords: "",
      image: "",
      url: `https://philadelphiascreenprinting.com/products/${slug}`,
    },
    productData
  };
}
