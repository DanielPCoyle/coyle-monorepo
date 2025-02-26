import builder from "@builder.io/react";
import { apiKey } from "../pages/[[...page]]";

interface SEO {
  title: string;
  description: string;
  image: string | null;
}

interface PageData {
  data?: {
    title?: string;
    description?: string;
    featuredImage?: string;
  };
}

interface BlogPost {
  // Define the structure of a blog post here
}

interface BlogData {
  results: BlogPost[];
}

interface FetchGeneralPageContentReturn {
  contentType: string;
  model: string;
  page: PageData | null;
  seo: SEO;
  blogData: BlogPost[] | null;
  pagination: {
    offset: number;
    limit: number;
    search: string | null;
  };
}

// Fetch content for general pages
export async function fetchGeneralPageContent(
  urlPath: string,
  slug: string,
  offset: number,
  limit: number,
): Promise<FetchGeneralPageContentReturn> {
  const page = (await builder
    .get("page", {
      userAttributes: {
        urlPath: urlPath.includes("/blog") ? "/blog" : urlPath,
      },
    })
    .toPromise()) as PageData;

  const seoTitle = page?.data?.title || "Philadelphia Screen Printing";
  const seoDescription =
    page?.data?.description || "Philadelphia Screen Printing";
  const seoImage = page?.data?.featuredImage || null;

  let blogData: BlogPost[] | null = null;
  let search: string | null = null;
  if (urlPath.includes("/blog")) {
    const urlParts = urlPath.split("/");
    const lastPart = urlParts[urlParts.length - 1];
    const isNumber = /^\d+$/.test(lastPart);
    if (isNumber) {
      offset = parseInt(lastPart);
      search = urlParts[urlParts.length - 2];
    }
    if (slug !== "blog") {
      search = slug;
    }

    try {
      const url =
        `https://cdn.builder.io/api/v3/content/blog?apiKey=${apiKey}&offset=${offset * limit}&limit=${limit}` +
        (Boolean(search) &&
          `&query.data.title.$regex=${search}&query.data.title.$options=i`);
      const response = await fetch(url);
      const blogDataResponse: BlogData = await response.json();
      blogData = blogDataResponse.results;
    } catch (error) {
      console.error("Error fetching blog data:", error);
    }
  }

  return {
    contentType: "WebPage",
    model: "page",
    page: page || null,
    seo: { title: seoTitle, description: seoDescription, image: seoImage },
    blogData,
    pagination: { offset, limit, search },
  };
}
