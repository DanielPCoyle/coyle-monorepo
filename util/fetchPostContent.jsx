import builder from "@builder.io/react";
import { apiKey } from "@/pages/[[...page]]";
import { calculateReadingTime } from "@/util/calculateReadingTime";

// Fetch content for `/post/` URLs
export async function fetchPostContent(urlPath) {
  const path = "/" + urlPath.split("/post/")[1];
  let blogData = await fetch(`https://cdn.builder.io/api/v2/content/blog?apiKey=${apiKey}&query.data.slug=${path}&limit=1`)
    .then(res => res.json());
  blogData = blogData.results[0];
  blogData.readingTime = calculateReadingTime(blogData.data.body);

  return {
    contentType: "post",
    model: "symbol",
    page: await builder.get("symbol", { query: { id: "7a9ae2a603a24f58971a9f137a337ab8" } }).toPromise(),
    blogData
  };
}
