import { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

interface BlogContent {
  content: string;
  seoTitleTag: string;
  seoDescription: string;
  tagLine: string;
  tags: string[];
}

interface BlogPost {
  title: string;
  content: BlogContent;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const content = await generateBlogContent();
      return res.status(201).json(content);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to save the blog post" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function generateBlogContent(): Promise<BlogPost[]> {
  const apiKey = process.env.NEXT_PUBLIC_OPEN_AI_KEY;

  try {
    const promptsResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are an expert blog writer. You are an AI assistant that outputs valid JSON only.",
            },
            {
              role: "user",
              content:
                "create a json array of 3 interesting blog titles for philaPrints screen printing jobs. Give just the array, no other explination",
            },
          ],
          max_tokens: 500,
        }),
      },
    );

    const promptData = await promptsResponse.json();
    const titles: string[] = JSON.parse(promptData.choices[0].message.content);
    if (!titles || !Array.isArray(titles)) {
      throw new Error("Failed to generate blog titles");
    }

    const posts: BlogPost[] = await Promise.all(
      titles.map(async (title) => {
        const response = await fetch(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: "gpt-4-turbo",
              messages: [
                {
                  role: "system",
                  content:
                    "You are an expert blog writer. You are an AI assistant that outputs valid JSON only. Return an object with content, seoTitleTag, seoDescription, tagLine, and tags(an array of keywords) attribute keys",
                },
                {
                  role: "user",
                  content: `Write an SEO optimized blog post named:"${title}" in HTML syntax for PhilaPrints.com, a screen printing company serving the Philadelphia area. Give just the html for the <article> tag of the post. Hyper link anchor text to the home page.`,
                },
              ],
              max_tokens: 2000,
            }),
          },
        );

        const data = await response.json();
        if (!data.choices || !data.choices[0].message?.content) {
          throw new Error("Failed to generate blog content");
        }
        const content: BlogContent = JSON.parse(
          data.choices[0].message.content,
        );
        await saveBlogPost({ title, content });
        return { title, content };
      }),
    );

    return posts;
  } catch (error) {
    console.error("Error generating blog content:", error);
    return [];
  }
}

async function saveBlogPost(postData: BlogPost): Promise<unknown> {
  const apiKey = process.env.NEXT_PUBLIC_BUILDER_IO_PRIVATE_KEY;
  const modelName = "blog"; // Replace with your actual model name

  const featuredImage = await generateFeaturedImage(postData.content);
  try {
    const response = await fetch(
      `https://builder.io/api/v1/write/${modelName}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: postData.title,
          data: {
            title: postData.title,
            featuredImage,
            body: postData.content.content,
            slug: "/" + postData.title.toLowerCase().replace(/\s+/g, "-"),
            tags: postData.content.tags,
            tagLine: postData.content.tagLine,
            seo: {
              titleTag: postData.content.seoTitleTag,
              metaDescription: postData.content.seoDescription,
            },
          },
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to save the blog post");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error saving blog post:", error);
    throw error;
  }
}

async function generateFeaturedImage(
  blogContent: BlogContent,
): Promise<string | null> {
  const apiKey = process.env.NEXT_PUBLIC_OPEN_AI_KEY;

  try {
    const response = await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "dall-e-3", // Latest model for high-quality images
          prompt: `Create a high-quality, realistic, eye-catching featured image for a blog post about: "${blogContent.tagLine}". The image should visually represent screen printing, custom apparel, promotional materials.`,
          n: 1, // Generate one image
          size: "1024x1024", // Optimal size for featured images
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`API error: ${data.error?.message || "Unknown error"}`);
    }

    // Extract and return the image URL
    return await uploadImage(data.data[0].url);
  } catch (error) {
    console.error("Error generating featured image:", error.message);
    return null; // Return null if image generation fails
  }
}

async function uploadImage(fileURL: string): Promise<string | null> {
  const apiKey = process.env.NEXT_PUBLIC_BUILDER_IO_PRIVATE_KEY;

  try {
    const response = await fetch(fileURL);
    const fileData = await response.buffer();

    const uploadUrl =
      "https://builder.io/api/v1/upload?name=banner.jpg&altText=Promo Banner";

    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      body: fileData,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "image/jpg",
      },
    });

    const data = await uploadResponse.json();

    return data?.url || null;
  } catch (error) {
    console.error("Upload failed:", error);
    return null;
  }
}
