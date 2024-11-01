import builder from "@builder.io/react";
import { calculateReadingTime } from "./calculateReadingTime";

// Fetch content for `/post/` URLs
export async function fetchLoginLogic(urlPath) {
  


  return {
        contentType: "post",
        model: "symbol",
        page: await builder.get("symbol", { query: { id: "0f52fb38f0954333ab2712a6d9455ac0" } }).toPromise(),
    }
}
