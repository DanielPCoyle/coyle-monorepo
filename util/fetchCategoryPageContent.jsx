import friendlyUrl from '@/data/friendly_urls';
import builder from "@builder.io/react";
// Fetch content for `/products/` URLs
export async function fetchCategoryPageContent(slug) {
  

  
  let categoryData = await builder.get('categories',{
    query:{
        data:{
            slug:slug.replace("/category","")
        }
    }
  }).promise();

  const categoryId = categoryData.data.inkSoftId;
  let productData = await fetch(`https://cdn.inksoft.com/philadelphiascreenprinting/Api2/GetProductBaseList?Format=JSON&Index=0&MaxResults=24&SortFilters=%5B%7B%22Property%22%3A%22Name%22%2C%22Direction%22%3A%22Ascending%22%7D%5D&ProductCategoryIds=%5B${categoryId}%5D&IncludePrices=true&IncludeAllStyles=true&IncludeSizes=false&StoreVersion=638659111691800000&IncludeQuantityPacks=true`)
    .then(res => res.json());
  productData = productData.Data;

  
  

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
    categoryData: categoryData || null
  };
}
