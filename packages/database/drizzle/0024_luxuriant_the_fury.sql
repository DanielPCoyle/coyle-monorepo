ALTER TABLE "styles" DROP CONSTRAINT "styles_product_id_products_id_fk";
--> statement-breakpoint
ALTER TABLE "styles" ADD CONSTRAINT "styles_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;