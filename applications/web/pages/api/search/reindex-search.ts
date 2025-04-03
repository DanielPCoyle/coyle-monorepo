import { searchClient } from "@algolia/client-search";
import algoliasearch from "algoliasearch";
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "@coyle/chat-db";
import { sql } from 'drizzle-orm' 
import { products as productsModel } from "@coyle/database/schema";
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

interface Product {
  CanEmbroider: boolean;
  CanScreenPrint: boolean;
  CanDigitalPrint: boolean;
  CanPrint: boolean;
  Active: boolean;
  ManufacturerId: number;
  ID: number;
  Slug: string;
  Keywords: string[];
  DecoratedProductSides: any[];
  Categories: string[];
  Styles: Style[];
  ProductType: string;
  SalePrice: number;
  UnitPrice: number;
  CurrentPrice: number;
  UnitCost: number;
  ManufacturerBrandImageUrl: string;
  LongDescription: string;
  SizeUnit: string;
  Name: string;
  Sku: string;
  Supplier: string;
  ManufacturerSku: string;
  Manufacturer: string;
}

interface Style {
  ImageFilePath_Front: string;
  Name: string;
  Sides: any;
  Color: string;
  ID: number;
}

const aClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_CLIENT_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_CLIENT_KEY!,
);
const client = searchClient(
  process.env.NEXT_PUBLIC_ALGOLIA_CLIENT_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_CLIENT_KEY!,
);


async function generateEmbedding(product) {
  const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPEN_AI_KEY });
 

  try {
    const inputText = [
      product.title,
      product.keywords,
      product.longDescription,
      product.manufacturer,
      product.sku,
      product.productType
    ].filter(Boolean).join(" ");

    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: inputText,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    return null;
  }
}

const processRecords = async (): Promise<{ count: number; tooBig: number } | undefined> => {
  const db = getDB();

  try {
    const [categoryRequest, datasetRequest] = await Promise.all([
      fetch(`https://cdn.inksoft.com/${process.env.NEXT_PUBLIC_INKSOFT_STORE}/Api2/GetProductCategories?IncludeAllPublisherCategories=false&BlankProducts=true&StaticProducts=true&ProductType=all`),
      fetch(`https://cdn.inksoft.com/${process.env.NEXT_PUBLIC_INKSOFT_STORE}/Api2/GetProductBaseList?Format=JSON&Index=0&MaxResults=-1&SortFilters=%5B%7B%22Property%22%3A%22Name%22%2C%22Direction%22%3A%22Ascending%22%7D%5D&IncludePrices=true&IncludeAllStyles=true&IncludeSizes=false&StoreVersion=638659111691800000-58100&IncludeQuantityPacks=true`),
    ]);
    const [categories, products] = await Promise.all([categoryRequest.json(), datasetRequest.json()]);

    let extractedProducts = products.Data.map((product) => ({
      inksoftId: product.ID,
      canEmbroider: product.CanEmbroider,
      canScreenPrint: product.CanScreenPrint,
      canDigitalPrint: product.CanDigitalPrint,
      canPrint: product.CanPrint,
      active: product.Active,
      manufacturerId: product.ManufacturerId,
      slug: product.Name.replace(/ /g, '-')
        .toLowerCase()
        .replace(/[^a-zA-Z0-9-]/g, '')
        .replace(/--/g, '-')
        .replace(/---/g, '-'),
      keywords: product.Keywords,
      decoratedProductSides: product.DecoratedProductSides,
      categories: JSON.stringify(categories.Data.filter((category) => category.ItemIds.includes(product.ID)).map((category) => category.Name)),
      styles: JSON.stringify(product.Styles.map((style) => ({
        imageFilePathFront: style.ImageFilePath_Front,
        name: style.Name,
        sides: null,
        color: style.HtmlColor1,
        id: style.ID,
      }))),
      productType: product.ProductType,
      manufacturerBrandImageUrl: product.ManufacturerBrandImageUrl,
      longDescription: product.LongDescription,
      sizeUnit: product.SizeUnit,
      title: product.Name,
      sku: product.Sku,
      supplier: product.Supplier,
      manufacturerSku: product.ManufacturerSku,
      manufacturer: product.Manufacturer,
    }));

    let tooBig = 0;
    extractedProducts = extractedProducts.filter((product) => {
      if (JSON.stringify(product).length < 10000) {
        return true;
      } else {
        tooBig++;
        return false;
      }
    });
    
    await Promise.all(
      extractedProducts.map(async (product) => {
      // const embedding = await generateEmbedding(product);
      await fetch(process.env.REACT_APP_API_BASE_URL+"/api/search/product-extract?id=" + product.inksoftId);
      })
    );

    console.log('Products and embeddings have been updated.');
    return { count: extractedProducts.length, tooBig };
  } catch (error) {
    console.error('Error processing records:', error);
  }
};



const reindexSearch = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const results = await processRecords();
    return res.status(200).json({ message: "Indexing complete", results });
  } catch (e: unknown) {
    console.error(e);
  }
};

export default reindexSearch;
