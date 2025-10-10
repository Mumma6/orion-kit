CREATE TYPE "public"."task_status" AS ENUM('todo', 'in-progress', 'completed', 'cancelled');--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "tasks_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"clerk_user_id" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"status" "task_status" DEFAULT 'todo' NOT NULL,
	"due_date" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_preferences" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_preferences_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"clerk_user_id" varchar(255) NOT NULL,
	"theme" varchar(50) DEFAULT 'system',
	"language" varchar(10) DEFAULT 'en',
	"timezone" varchar(100),
	"email_notifications" varchar(50) DEFAULT 'enabled',
	"push_notifications" varchar(50) DEFAULT 'disabled',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_preferences_clerk_user_id_unique" UNIQUE("clerk_user_id")
);
