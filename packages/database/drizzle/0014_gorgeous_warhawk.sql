CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"can_embroider" boolean,
	"can_screen_print" boolean,
	"can_digital_print" boolean,
	"can_print" boolean,
	"active" boolean,
	"manufacturer_id" integer,
	"slug" varchar(255),
	"keywords" text,
	"decorated_product_sides" text,
	"categories" text,
	"styles" text,
	"image_file_path_front" varchar(255),
	"title" varchar(255),
	"sides" text,
	"color" varchar(100),
	"product_type" varchar(100),
	"manufacturer_brand_image_url" varchar(255),
	"long_description" text,
	"size_unit" varchar(50),
	"sku" varchar(100),
	"supplier" varchar(100),
	"manufacturer_sku" varchar(100),
	"manufacturer" varchar(100),
	"embedding" vector(3)
);
--> statement-breakpoint
ALTER TABLE "get_a_store_signups" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "conversations" ALTER COLUMN "language" DROP NOT NULL;