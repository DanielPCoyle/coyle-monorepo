import { NextApiRequest, NextApiResponse } from "next";
import {
  products,
  styles,
  sizes,
  sides,
  suppliers,
  brands,
} from "@coyle/database/schema";
import { getDB, eq } from "@coyle/database";
import dotenv from "dotenv";
dotenv.config();

const fetchProductData = async (productId: number) => {
  const url = `https://cdn.inksoft.com/${process.env.NEXT_PUBLIC_INKSOFT_STORE}/Api2/GetProduct?ProductId=${productId}&IncludeQuantityPacks=true&IncludePricing=true`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch product data");
  return response.json();
};

const ensureSupplierExists = async (data: any) => {
  const db = getDB();
  const existingSupplier = await db
    .select()
    .from(suppliers)
    .where(eq(suppliers.inksoftId, data.SupplierId))
    .execute();
  if (existingSupplier.length > 0) {
    return existingSupplier[0].id;
  }
  const [supplier] = await db
    .insert(suppliers)
    .values({ inksoftId: data.SupplierId })
    .returning()
    .execute();
  return supplier.id;
};

const ensureBrandExists = async (data: any) => {
  const db = getDB();

  const existingBrand = await db
    .select()
    .from(brands)
    .where(eq(brands.inksoftId, data.ManufacturerId))
    .execute();
  if (existingBrand.length > 0) {
    return existingBrand[0].id;
  }
  const [brand] = await db
    .insert(brands)
    .values({ inksoftId: data.ManufacturerId })
    .returning()
    .execute();
  return brand.id;
};

const insertProductData = async (data: any) => {
  const db = getDB();
  let [productRow] = await db
    .select()
    .from(products)
    .where(eq(products.inksoftId, data.ID))
    .execute();
  if (productRow) {
    console.log(data.ID, "already exists");
    return; // Product already exists, no need to insert
  }
  const supplierId = await ensureSupplierExists(data);
  const brandId = await ensureBrandExists(data);

  const product = {
    active: data.Active,
    brandId: brandId,
    supplierId: supplierId,
    inksoftId: data.ID,
    canPrint: data.CanPrint,
    canDigitalPrint: data.CanDigitalPrint,
    canScreenPrint: data.CanScreenPrint,
    canEmbroider: data.CanEmbroider,
    isStatic: data.IsStatic,
    buyBlank: data.BuyBlank,
    name: data.Name,
    manufacturer: data.Manufacturer,
    longDescription: data.LongDescription,
    seoTitle: data.SeoTitle,
    seoDescription: data.SeoDescription,
    seoKeywords: data.SeoKeywords,
  };

  if (!productRow) {
    [productRow] = await db
      .insert(products)
      .values(product)
      .returning()
      .execute();
  }

  for (const style of data.Styles) {
    const styleData = {
      productId: productRow.id,
      name: style.Name,
      inksoftId: style.ID,
      isDefault: style.IsDefault,
      isLightColor: style.IsLightColor,
      isDarkColor: style.IsDarkColor,
      isHeathered: style.IsHeathered,
      htmlColor1: style.HtmlColor1,
      htmlColor2: style.HtmlColor2,
      unitPrice: style.UnitPrice,
    };

    let [styleRow] = await db
      .select()
      .from(styles)
      .where(eq(styles.inksoftId, style.ID))
      .execute();
    if (!styleRow) {
      [styleRow] = await db
        .insert(styles)
        .values(styleData)
        .returning()
        .execute();
    }

    for (const size of style.Sizes) {
      const sizeData = {
        styleId: styleRow.id,
        name: size.Name,
        longName: size.LongName,
        unitPrice: size.UnitPrice,
        weight: size.Weight,
        inStock: size.InStock,
      };
      await db.insert(sizes).values(sizeData).returning().execute();
    }

    for (const side of style.Sides) {
      const sideData = {
        styleId: styleRow.id,
        side: side.Side,
        imageFilePath: side.ImageFilePath,
        height: side.Height,
        width: side.Width,
      };
      await db.insert(sides).values(sideData).returning().execute();
    }
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const id = req.query.id;
    const data = await fetchProductData(id);
    await insertProductData(data.Data);
    res.status(200).json({ message: "Product data inserted successfully" });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ error: error.message });
  }
}
