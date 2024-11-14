// pages/api/searchProducts.js

import algoliasearch from 'algoliasearch';

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_CLIENT_ID,
  process.env.NEXT_PUBLIC_ALGOLIA_CLIENT_KEY
);
const index = client.initIndex('products_index'); // Replace with your actual index name

export default async function handler(req, res) {
  let { color = [], category = [], keyword = '', manufacturer = [], page = 0 } = req.query;

  console.log(">?>>>>>>>",page)
  // Convert page to an integer for Algolia pagination
  page = parseInt(page, 10) || 0;

  // Ensure filter arrays are properly formatted
  manufacturer = Array.isArray(manufacturer) ? manufacturer : manufacturer.split(',');
  color = Array.isArray(color) ? color : color.split(',');
  category = Array.isArray(category) ? category : category.split(',');

  try {
    // Set up filters based on provided parameters
    const filters = [];

    if (manufacturer.length > 0) {
      filters.push(manufacturer.map(m => `Manufacturer:"${m}"`).join(' OR '));
    }

    if (color.length > 0) {
      filters.push(color.map(c => `Styles.Color:"${c}"`).join(' OR '));
    }

    if (category.length > 0) {
      filters.push(category.map(cat => `Categories:"${cat}"`).join(' OR '));
    }

    // Perform search with keyword, combined filters, and pagination
    const response = await index.search(keyword, {
      filters: filters.join(' AND '), // Combine filters with AND operator
      page, // Pass the page parameter to Algolia
    });

    res.status(200).json(response); // Send the response back
  } catch (error) {
    console.error('Error querying Algolia:', error);
    res.status(500).json({ error: 'Error querying Algolia' });
  }
}
