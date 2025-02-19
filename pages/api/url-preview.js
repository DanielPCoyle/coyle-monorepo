import axios from "axios";
import * as cheerio from "cheerio";

export default async function handler(req, res) {
  const { url } = req.query;
  console.log("FIRED",url)
  if (req.method === "GET") {
      try {
          const { data } = await axios.get(url);
          const $ = cheerio.load(data);
    const metadata = {
      title: $("title").text(),
      description: $("meta[name='description']").attr("content") || $("meta[property='og:description']").attr("content") || $("meta[name='twitter:description']").attr("content") || "",
      image: $("meta[property='og:image']").attr("content") || $("meta[name='twitter:image']").attr("content") || "",
      url: url,
    };
      res.status(200).json(metadata);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch metadata", details: error.message});
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
