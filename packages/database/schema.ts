import { type InferSelectModel } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const getAStoreSignUps = pgTable("get_a_store_signups", {
  id: serial("id").primaryKey(),
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
