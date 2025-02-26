// pages/api/searchProducts.ts

import { NextApiRequest, NextApiResponse } from "next";
import algoliasearch from "algoliasearch";

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_CLIENT_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_CLIENT_KEY!,
);
const index = client.initIndex("products_index"); // Replace with your actual index name

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  let {
    color = [],
    category = [],
    keyword = "",
    manufacturer = [],
    page = 0,
  } = req.query;

  // Convert page to an integer for Algolia pagination
  page = parseInt(page as string, 10) || 0;

  // Ensure filter arrays are properly formatted
  manufacturer = Array.isArray(manufacturer)
    ? manufacturer
    : (manufacturer as string).split(",");
  color = Array.isArray(color) ? color : (color as string).split(",");
  category = Array.isArray(category)
    ? category
    : (category as string).split(",");

  try {
    // Set up filters based on provided parameters
    const filters: string[] = [];

    if (manufacturer.length > 0) {
      filters.push(
        (manufacturer as string[])
          .map((m) => `Manufacturer:"${m}"`)
          .join(" OR "),
      );
    }

    if (color.length > 0) {
      filters.push(
        (color as string[]).map((c) => `Styles.Color:"${c}"`).join(" OR "),
      );
    }

    if (category.length > 0) {
      filters.push(
        (category as string[]).map((cat) => `Categories:"${cat}"`).join(" OR "),
      );
    }

    // Perform search with keyword, combined filters, and pagination
    const response = await index.search(keyword as string, {
      filters: filters.join(" AND "), // Combine filters with AND operator
      facets: ["Manufacturer", "Styles.Color", "Categories"], // Request facet counts
      page, // Pass the page parameter to Algolia
    });

    res.status(200).json(response); // Send the response back
  } catch (error) {
    console.error("Error querying Algolia:", error);
    res.status(500).json({ error: "Error querying Algolia" });
  }
}
