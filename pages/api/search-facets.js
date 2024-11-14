import { searchClient } from '@algolia/client-search';
import algoliasearch from 'algoliasearch';
import chroma from 'chroma-js';

const aClient = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_CLIENT_ID, process.env.NEXT_PUBLIC_ALGOLIA_CLIENT_KEY);
const client = searchClient(process.env.NEXT_PUBLIC_ALGOLIA_CLIENT_ID, process.env.NEXT_PUBLIC_ALGOLIA_CLIENT_KEY);

// Define the index you want to work with
const index = aClient.initIndex('products_index');

// Fetch facet values for a given attribute
const getFacetValues = async (facetAttribute) => {
  try {
    const response = await index.search('', {
      facets: [facetAttribute],
      facetFilters: [], // Use this to filter facet results if needed
    });
    
    return response.facets[facetAttribute];
  } catch (error) {
    console.error('Error fetching facet values:', error);
  }
};

const getBrightness = (hex) => {
  // Convert hex to RGB
  const rgb = parseInt(hex.replace('#', ''), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = rgb & 0xff;

  // Calculate brightness (relative luminance)
  return 0.299 * r + 0.587 * g + 0.114 * b;
};

export default async function handler(req, res) {
  const manufacturer = await getFacetValues('Manufacturer'); // Replace 'category' with your facet attribute
  const categories = await getFacetValues('Categories'); // Replace 'category' with your facet attribute
  const color = await getFacetValues('Styles.Color'); // Replace 'category' with your facet attribute
  const sortedColors = Object.keys(color)
      .map((hex) => ({
        hex,
        count: color[hex],
        brightness: chroma(`#${hex}`).luminance(),
      }))
      .sort((a, b) => a.brightness - b.brightness);
 const nColors = {};
  sortedColors.reverse().forEach((c) => {
    nColors[c.hex] = c.count;
  });
    
  res.status(200).json({ manufacturer, color:nColors, categories });
};
