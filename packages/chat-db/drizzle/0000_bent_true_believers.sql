CREATE TABLE "conversations" (
	"id" serial PRIMARY KEY NOT NULL,
	"conversation_key" varchar NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "get_a_store_signups" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_name" text NOT NULL,
	"contact_person" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"website" text NOT NULL,
	"store_domain" text NOT NULL,
	"custom_domain" boolean NOT NULL,
	"products" text NOT NULL,
	"order_fulfillment" text NOT NULL,
	"additional_requests" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "knowledge" (
	"id" uuid PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"embedding" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"conversation_id" integer NOT NULL,
	"sender" varchar NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"seen" boolean NOT NULL,
	"parent_id" integer,
	"reaction" jsonb,
	"files" jsonb
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"is_active" boolean NOT NULL,
	"role" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"last_login" timestamp
);
