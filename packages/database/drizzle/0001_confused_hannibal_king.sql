ALTER TABLE "conversations" ALTER COLUMN "conversation_key" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "conversations" ALTER COLUMN "name" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "conversations" ALTER COLUMN "email" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "sender" SET DATA TYPE varchar(255);