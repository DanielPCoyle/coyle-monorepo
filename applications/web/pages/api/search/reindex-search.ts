import { searchClient } from "@algolia/client-search";
import algoliasearch from "algoliasearch";
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";

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

const processRecords = async (): Promise<
  { count: number; tooBig: number } | undefined
> => {
  const categoryRequest = await fetch(
    `https://cdn.inksoft.com/${process.env.NEXT_PUBLIC_INKSOFT_STORE}/Api2/GetProductCategories?IncludeAllPublisherCategories=false&BlankProducts=true&StaticProducts=true&ProductType=all`,
  );
  const categories = await categoryRequest.json();
  const datasetRequest = await fetch(
    `https://cdn.inksoft.com/${process.env.NEXT_PUBLIC_INKSOFT_STORE}/Api2/GetProductBaseList?Format=JSON&Index=0&MaxResults=-1&SortFilters=%5B%7B%22Property%22%3A%22Name%22%2C%22Direction%22%3A%22Ascending%22%7D%5D&IncludePrices=true&IncludeAllStyles=true&IncludeSizes=false&StoreVersion=638659111691800000-58100&IncludeQuantityPacks=true`,
  );
  const products = await datasetRequest.json();

  let extractedProducts: Product[] = products.Data.map((product: Product) => ({
    CanEmbroider: product.CanEmbroider,
    CanScreenPrint: product.CanScreenPrint,
    CanDigitalPrint: product.CanDigitalPrint,
    CanPrint: product.CanPrint,
    Active: product.Active,
    ManufacturerId: product.ManufacturerId,
    ID: product.ID,
    Slug: product.Name.replace(/ /g, "-")
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, "")
      .replace(/--/g, "-")
      .replace(/---/g, "-"),
    Keywords: product.Keywords,
    DecoratedProductSides: product.DecoratedProductSides,
    Categories: categories.Data.filter((category: any) =>
      category.ItemIds.includes(product.ID),
    ).map((category: any) => category.Name),
    Styles: product.Styles.map((style: any) => ({
      ImageFilePath_Front: style.ImageFilePath_Front,
      Name: style.Name,
      Sides: null,
      Color: style.HtmlColor1,
      ID: style.ID,
    })),
    ProductType: product.ProductType,
    SalePrice: product.SalePrice,
    UnitPrice: product.UnitPrice,
    CurrentPrice: product.SalePrice ?? product.UnitPrice,
    UnitCost: product.UnitCost,
    ManufacturerBrandImageUrl: product.ManufacturerBrandImageUrl,
    LongDescription: product.LongDescription,
    SizeUnit: product.SizeUnit,
    Name: product.Name,
    Sku: product.Sku,
    Supplier: product.Supplier,
    ManufacturerSku: product.ManufacturerSku,
    Manufacturer: product.Manufacturer,
  }));

  let tooBig = 0;
  extractedProducts = extractedProducts.filter(
    (product: Product) => {
      if (JSON.stringify(product).length < 10000) {
        return true;
      } else {
        tooBig++;
      }
    },
  );

  try {
    const index = aClient.initIndex("products_index");
    const facets = [
      "Name",
      "Keywords",
      "LongDescription",
      "Manufacturer",
      "Sku",
      "ManufacturerSku",
      "ID",
      "CurrentPrice",
      "CanEmbroider",
      "CanScreenPrint",
      "CanDigitalPrint",
    ];
    await index.clearObjects();
    await client.saveObjects({
      indexName: "products_index",
      objects: extractedProducts as unknown as Record<string, unknown>[],
    });

    await index.setSettings({
      customRanking: ["asc(Name)"],
      searchableAttributes: facets,
    });

    const slugIds = extractedProducts.map((product) => ({
      slug: product.Slug,
      id: product.ID,
    }));

    fs.writeFileSync("./data/slugIds.json", JSON.stringify(slugIds, null, 2));

    return { count: extractedProducts.length, tooBig };
  } catch (e: unknown) {
    console.error(e);
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
