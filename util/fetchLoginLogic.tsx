import builder from "@builder.io/react";

interface FetchLoginLogicResponse {
  contentType: string;
  model: string;
  page: any;
}

// Fetch content for `/post/` URLs
export async function fetchLoginLogic(
  urlPath: string,
): Promise<FetchLoginLogicResponse> {
  return {
    contentType: "post",
    model: "symbol",
    page: await builder
      .get("symbol", { query: { id: "0f52fb38f0954333ab2712a6d9455ac0" } })
      .toPromise(),
  };
}
