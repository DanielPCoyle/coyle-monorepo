import { searchClient } from "@algolia/client-search";
import algoliasearch from "algoliasearch";
import chroma from "chroma-js";
import { NextApiRequest, NextApiResponse } from "next";

const aClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_CLIENT_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_CLIENT_KEY!,
);
const client = searchClient(
  process.env.NEXT_PUBLIC_ALGOLIA_CLIENT_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_CLIENT_KEY!,
);

// Define the index you want to work with
const index = aClient.initIndex("products_index");

// Fetch facet values for a given attribute
// Fetch facet values for a given attribute with filters
const getFacetValues = async (
  facetAttribute: string,
  facetFilters: string[],
) => {
  try {
    const response = await index.search("", {
      facets: [facetAttribute],
      facetFilters, // Apply filters here
    });
    return response.facets[facetAttribute];
  } catch (error) {
    console.error("Error fetching facet values:", error);
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { filters } = req.body;

  // Helper to generate facetFilters based on existing filters but excluding the current facet
  const createFacetFilters = (excludeFacet: string): string[] => {
    return filters
      ? Object.entries(filters)
          .filter(([key]) => key !== excludeFacet)
          .flatMap(([key, values]) =>
            Array.isArray(values)
              ? values.map((value) => `${key}:${value}`)
              : `${key}:${values}`,
          )
      : [];
  };

  // Fetch each facet with other filters applied to narrow down the options
  const manufacturer = await getFacetValues(
    "Manufacturer",
    createFacetFilters("Manufacturer"),
  );
  const categories = await getFacetValues(
    "Categories",
    createFacetFilters("Categories"),
  );
  const color = await getFacetValues(
    "Styles.Color",
    createFacetFilters("Styles.Color"),
  );

  console.log(
    "Color Sum",
    Object.values(color).reduce((a, b) => a + b, 0),
  );
  // Sort colors by brightness for display
  const sortedColors = Object.keys(color)
    .map((hex) => ({
      hex,
      count: color[hex],
      brightness: chroma(`#${hex}`).luminance(),
    }))
    .sort((a, b) => a.brightness - b.brightness);

  const nColors: { [key: string]: number } = {};
  sortedColors.reverse().forEach((c) => {
    nColors[c.hex] = c.count;
  });

  res.status(200).json({ manufacturer, color: nColors, categories });
}
