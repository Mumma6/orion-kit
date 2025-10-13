ALTER TABLE "user_preferences" ADD COLUMN "plan" varchar(50) DEFAULT 'free';--> statement-breakpoint
ALTER TABLE "user_preferences" ADD COLUMN "stripe_customer_id" varchar(255);--> statement-breakpoint
ALTER TABLE "user_preferences" ADD COLUMN "stripe_subscription_id" varchar(255);--> statement-breakpoint
ALTER TABLE "user_preferences" ADD COLUMN "stripe_subscription_status" varchar(50);--> statement-breakpoint
ALTER TABLE "user_preferences" ADD COLUMN "stripe_price_id" varchar(255);--> statement-breakpoint
ALTER TABLE "user_preferences" ADD COLUMN "stripe_current_period_end" timestamp;