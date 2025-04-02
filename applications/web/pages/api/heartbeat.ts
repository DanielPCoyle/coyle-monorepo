import { NextApiRequest, NextApiResponse } from "next";
import { JSDOM } from "jsdom";

async function decodeSecretMessage(url) {
  try {
    const response = await fetch(url);

    const html = await response.text();
    const dom = new JSDOM(html);
    const doc = dom.window.document;
    const table = doc.querySelector("table");
    const text = table ? table.innerText : "";
    // Extract data from the Google Doc format

    console.log(text);
    const lines = text.split("\n");
    const coordinates = [];

    lines.forEach((line) => {
      const match = line.match(/\((\d+),\s*(\d+)\)\s*:\s*(.+)/);
      if (match) {
        const x = parseInt(match[1], 10);
        const y = parseInt(match[2], 10);
        const char = match[3];
        coordinates.push({ x, y, char });
      }
    });

    // Find the grid size
    const maxX = Math.max(...coordinates.map((coord) => coord.x));
    const maxY = Math.max(...coordinates.map((coord) => coord.y));

    // Create the grid
    const grid = Array.from({ length: maxY + 1 }, () =>
      Array(maxX + 1).fill(" "),
    );

    // Fill the grid with characters
    coordinates.forEach(({ x, y, char }) => {
      grid[y][x] = char;
    });

    // Print the grid
    grid.forEach((row) => {
      console.log(row.join(""));
    });
  } catch (error) {
    console.error("Error fetching or parsing the document:", error);
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const result = await decodeSecretMessage(
    "https://docs.google.com/document/d/e/2PACX-1vRMx5YQlZNa3ra8dYYxmv-QIQ3YJe8tbI3kqcuC7lQiZm-CSEznKfN_HYNSpoXcZIV3Y_O3YoUB1ecq/pub",
  );
  console.log({ result });
  res.status(200).json({ message: "Hello from the API!" });
}
