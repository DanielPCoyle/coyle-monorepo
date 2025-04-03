ALTER TABLE "brands" ADD CONSTRAINT "brands_inksoft_id_unique" UNIQUE("inksoft_id");--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_inksoft_id_unique" UNIQUE("inksoft_id");--> statement-breakpoint
ALTER TABLE "sizes" ADD CONSTRAINT "sizes_inksoft_id_unique" UNIQUE("inksoft_id");--> statement-breakpoint
ALTER TABLE "styles" ADD CONSTRAINT "styles_inksoft_id_unique" UNIQUE("inksoft_id");--> statement-breakpoint
ALTER TABLE "suppliers" ADD CONSTRAINT "suppliers_inksoft_id_unique" UNIQUE("inksoft_id");