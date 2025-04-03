CREATE TABLE "brands" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"website" varchar
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"seo_title" varchar,
	"seo_description" text,
	"seo_keywords" text,
	"photo_url" text,
	"parent_id" integer
);
--> statement-breakpoint
CREATE TABLE "product_categories" (
	"product_id" integer NOT NULL,
	"category_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sides" (
	"id" serial PRIMARY KEY NOT NULL,
	"style_id" integer,
	"side" varchar,
	"image_file_path" varchar,
	"height" integer,
	"width" integer
);
--> statement-breakpoint
CREATE TABLE "sizes" (
	"id" integer PRIMARY KEY NOT NULL,
	"style_id" integer,
	"name" varchar,
	"long_name" varchar,
	"unit_price" real,
	"weight" real,
	"in_stock" boolean
);
--> statement-breakpoint
CREATE TABLE "styles" (
	"id" integer PRIMARY KEY NOT NULL,
	"product_id" integer,
	"name" varchar,
	"is_default" boolean,
	"is_light_color" boolean,
	"is_dark_color" boolean,
	"is_heathered" boolean,
	"html_color1" varchar,
	"html_color2" varchar,
	"unit_price" real
);
--> statement-breakpoint
CREATE TABLE "suppliers" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"contact_email" varchar,
	"contact_phone" varchar,
	"address" text,
	"website" varchar
);
--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "supplier" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "manufacturer" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "supplier_id" integer;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "is_static" boolean;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "buy_blank" boolean;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "name" varchar;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "seo_title" varchar;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "seo_description" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "seo_keywords" text;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sides" ADD CONSTRAINT "sides_style_id_styles_id_fk" FOREIGN KEY ("style_id") REFERENCES "public"."styles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sizes" ADD CONSTRAINT "sizes_style_id_styles_id_fk" FOREIGN KEY ("style_id") REFERENCES "public"."styles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "styles" ADD CONSTRAINT "styles_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_manufacturer_id_brands_id_fk" FOREIGN KEY ("manufacturer_id") REFERENCES "public"."brands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "slug";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "keywords";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "decorated_product_sides";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "categories";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "styles";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "image_file_path_front";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "title";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "sides";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "color";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "product_type";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "manufacturer_brand_image_url";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "size_unit";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "sku";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "manufacturer_sku";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "embedding";