import builder from "@builder.io/react";

interface PageData {
  data?: {
    title?: string;
    description?: string;
    featuredImage?: string;
  };
}

interface FetchLoginLogicResponse {
  contentType: string;
  model: string;
  page: PageData;
}

// Fetch content for `/post/` URLs
export async function fetchLoginLogic(): Promise<FetchLoginLogicResponse> {
  return {
    contentType: "post",
    model: "symbol",
    page: await builder
      .get("symbol", { query: { id: "0f52fb38f0954333ab2712a6d9455ac0" } })
      .toPromise(),
  };
}
