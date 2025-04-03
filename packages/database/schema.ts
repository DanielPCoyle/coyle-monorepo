import { boolean, pgTable, serial, text, varchar, integer, vector  } from "drizzle-orm/pg-core";
import {  real } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
export * from "@coyle/chat-db/schema";

export const getAStoreSignUps = pgTable("get_a_store_signups", {
  id: integer("id").primaryKey(),
  organizationName: text("organization_name").notNull(),
  contactPerson: text("contact_person").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  website: text("website").notNull(),
  storeDomain: text("store_domain").notNull(),
  customDomain: boolean("custom_domain").notNull(),
  products: text("products").notNull(),
  orderFulfillment: text("order_fulfillment").notNull(),
  additionalRequests: text("additional_requests").notNull(),
});


// Brands Table
export const brands = pgTable('brands', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity({ startWith: 1 }),
  name: varchar('name'),
  description: text('description'),
  inksoftId: integer('inksoft_id').unique(),
  website: varchar('website'),
  seoTitle: varchar('seo_title'),
  seoDescription: text('seo_description'),
  seoKeywords: text('seo_keywords'),
  imageUrl: text('image_url'),
});

// Update statements for PostgreSQL
const updateBrandName = (title, value) => {
  return `UPDATE brands SET name = '${title}' WHERE inksoft_id = ${value};`;
};

// Suppliers Table
export const suppliers = pgTable('suppliers', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity({ startWith: 1 }),
  inksoftId: integer('inksoft_id').unique(),
  name: varchar('name'),
  contactEmail: varchar('contact_email'),
  contactPhone: varchar('contact_phone'),
  address: text('address'),
  website: varchar('website')
});

// Categories Table
export const categories = pgTable('categories', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity({ startWith: 1 }),
  name: varchar('name'),
  description: text('description'),
  seoTitle: varchar('seo_title'),
  seoDescription: text('seo_description'),
  seoKeywords: text('seo_keywords'),
  photoUrl: text('photo_url'), 
  parentId: integer('parent_id').references(() => categories.id) 
});

// Product-Category Relationship
export const productCategories = pgTable('product_categories', {
  productId: integer('product_id').references(() => products.id).notNull(),
  categoryId: integer('category_id').references(() => categories.id).notNull()
});

export const products = pgTable('products', {
  id: integer('id').primaryKey(),
  inksoftId: integer('inksoft_id').unique(),
  active: boolean('active'),
  brandId: integer('brand_id').references(() => brands.id),
  supplierId: integer('supplier_id').references(() => suppliers.id),
  canPrint: boolean('can_print'),
  canDigitalPrint: boolean('can_digital_print'),
  canScreenPrint: boolean('can_screen_print'),
  canEmbroider: boolean('can_embroider'),
  isStatic: boolean('is_static'),
  buyBlank: boolean('buy_blank'),
  name: varchar('name'),
  longDescription: text('long_description'),
  seoTitle: varchar('seo_title'),
  seoDescription: text('seo_description'),
  seoKeywords: text('seo_keywords')
});

// Product-Brand Relationship
export const productBrands = relations(products, ({ one }) => ({
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id]
  })
}));

// Product-Supplier Relationship
export const productSuppliers = relations(products, ({ one }) => ({
  supplier: one(suppliers, {
    fields: [products.supplierId],
    references: [suppliers.id]
  })
}));

// Styles Table
export const styles = pgTable('styles', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity({ startWith: 1 }),
    inksoftId: integer('inksoft_id').unique(),
    productId: integer('product_id').references(() => products.id, { onDelete: 'cascade' }),
    name: varchar('name'),
    isDefault: boolean('is_default'),
    isLightColor: boolean('is_light_color'),
    isDarkColor: boolean('is_dark_color'),
    isHeathered: boolean('is_heathered'),
    htmlColor1: varchar('html_color1'),
    htmlColor2: varchar('html_color2'),
    unitPrice: real('unit_price')
});

// Sizes Table
export const sizes = pgTable('sizes', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity({ startWith: 1 }),
    inksoftId: integer('inksoft_id').unique(),
    styleId: integer('style_id').references(() => styles.id),
    name: varchar('name'),
    longName: varchar('long_name'),
    unitPrice: real('unit_price'),
    weight: real('weight'),
    inStock: boolean('in_stock')
});

// Sides Table
export const sides = pgTable('sides', {
    id: serial('id').primaryKey(),
    styleId: integer('style_id').references(() => styles.id),
    side: varchar('side'),
    imageFilePath: varchar('image_file_path'),
    height: integer('height'),
    width: integer('width')
});

// Product-Style Relationship
export const productStyles = relations(products, ({ many }) => ({
    styles: many(styles)
}));

// Style-Sizes Relationship
export const styleSizes = relations(styles, ({ many }) => ({
    sizes: many(sizes)
}));

// Style-Sides Relationship
export const styleSides = relations(styles, ({ many }) => ({
    sides: many(sides)
}));
