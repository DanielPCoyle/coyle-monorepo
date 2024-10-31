import builder from "@builder.io/react";
import { calculateReadingTime } from "./calculateReadingTime";

interface BlogData {
  data: {
    slug: string;
    body: string;
  };
  readingTime?: string;
}

interface FetchPostContentReturn {
  contentType: string;
  model: string;
  page: any; // Replace `any` with a specific type if available from Builder API
  blogData: BlogData;
}

// Fetch content for `/post/` URLs
export async function fetchPostContent(urlPath: string): Promise<FetchPostContentReturn> {
  const apiKey = process.env.BUILDERIO_API_KEY;
  const path = "/" + urlPath.split("/post/")[1];

  // Fetch blog data from Builder API
  let blogData: BlogData = await fetch(
    `https://cdn.builder.io/api/v2/content/blog?apiKey=${apiKey}&query.data.slug=${path}&limit=1`
  )
    .then((res) => res.json())
    .then((data) => data.results[0]);

  // Calculate and add reading time
  blogData.readingTime = calculateReadingTime(blogData.data.body);

  return {
    contentType: "post",
    model: "symbol",
    page: await builder.get("symbol", { query: { id: "7a9ae2a603a24f58971a9f137a337ab8" } }).toPromise(),
    blogData,
  };
}
