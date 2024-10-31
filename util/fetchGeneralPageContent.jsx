import builder from "@builder.io/react";
import { apiKey } from "../pages/[[...page]]";

// Fetch content for general pages
export async function fetchGeneralPageContent(urlPath, slug, offset, limit) {
  const page = await builder.get("page", {
    userAttributes: { urlPath: urlPath.includes("/blog") ? "/blog" : urlPath },
  }).toPromise();

  const seoTitle = page?.data?.title || "Philadelphia Screen Printing";
  const seoDescription = page?.data?.description || "Philadelphia Screen Printing";
  const seoImage = page?.data?.featuredImage || null;

  let blogData = null;
  if (urlPath.includes("/blog")) {
    if (slug !== "blog") offset = parseInt(slug);
    try {
      blogData = await fetch(`https://cdn.builder.io/api/v3/content/blog?apiKey=${apiKey}&offset=${offset * limit}&limit=${limit}`)
        .then(res => res.json());
      blogData = blogData.results;
    } catch (error) {
      console.error("Error fetching blog data:", error);
    }
  }

  return {
    contentType: "WebPage",
    model: "page",
    page,
    seo: { title: seoTitle, description: seoDescription, image: seoImage },
    blogData,
    pagination: { offset, limit }
  };
}
