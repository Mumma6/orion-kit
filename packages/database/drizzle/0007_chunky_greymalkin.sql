ALTER TABLE "user_preferences" RENAME COLUMN "clerk_user_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "user_preferences" DROP CONSTRAINT "user_preferences_clerk_user_id_unique";--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "user_id" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" DROP COLUMN "clerk_user_id";--> statement-breakpoint
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_unique" UNIQUE("user_id");