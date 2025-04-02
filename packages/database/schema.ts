import { boolean, pgTable, serial, text, varchar, integer, vector  } from "drizzle-orm/pg-core";

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


export const products = pgTable('products', {
  id: serial("id").primaryKey(),
  canEmbroider: boolean('can_embroider'),
  canScreenPrint: boolean('can_screen_print'),
  canDigitalPrint: boolean('can_digital_print'),
  canPrint: boolean('can_print'),
  active: boolean('active'),
  manufacturerId: integer('manufacturer_id'),
  slug: varchar('slug', { length: 255 }),
  keywords: text('keywords'),
  decoratedProductSides: text('decorated_product_sides'),
  categories: text('categories'),
  styles: text('styles'),
  imageFilePathFront: varchar('image_file_path_front', { length: 255 }),
  title: varchar('title', { length: 255 }),
  sides: text('sides'),
  color: varchar('color', { length: 100 }),
  productType: varchar('product_type', { length: 100 }),
  // salePrice: float('sale_price'),
  // unitPrice: float('unit_price'),
  // currentPrice: float('current_price'),
  // unitCost: float('unit_cost'),
  manufacturerBrandImageUrl: varchar('manufacturer_brand_image_url', { length: 255 }),
  longDescription: text('long_description'),
  sizeUnit: varchar('size_unit', { length: 50 }),
  sku: varchar('sku', { length: 100 }),
  supplier: varchar('supplier', { length: 100 }),
  manufacturerSku: varchar('manufacturer_sku', { length: 100 }),
  manufacturer: varchar('manufacturer', { length: 100 }),
  embedding: vector("embedding", {
    dimensions:3
  })
});