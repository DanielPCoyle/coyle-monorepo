ALTER TABLE "products" RENAME COLUMN "manufacturer_id" TO "brand_id";--> statement-breakpoint
ALTER TABLE "products" DROP CONSTRAINT "products_manufacturer_id_brands_id_fk";
--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE no action ON UPDATE no action;