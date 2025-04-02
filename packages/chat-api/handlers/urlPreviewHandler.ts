import axios from "axios";
import * as cheerio from "cheerio";
import { NextApiRequest, NextApiResponse } from "next";

interface Metadata {
  title: string;
  description: string;
  image: string;
  url: string;
}

export async function urlPreviewHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { url } = req.query;
  if (req.method === "GET") {
    try {
      const { data } = await axios.get(url as string);
      const $ = cheerio.load(data);
      const metadata: Metadata = {
        title: $("title").text(),
        description:
          $("meta[name='description']").attr("content") ||
          $("meta[property='og:description']").attr("content") ||
          $("meta[name='twitter:description']").attr("content") ||
          "",
        image:
          $("meta[property='og:image']").attr("content") ||
          $("meta[name='twitter:image']").attr("content") ||
          "",
        url: url as string,
      };
      res.status(200).json(metadata);
    } catch (error) {
      res.status(500).json({
        error: "Failed to fetch metadata",
        details: (error as Error).message,
      });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

export default urlPreviewHandler;
