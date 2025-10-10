CREATE TYPE "public"."log_level" AS ENUM('debug', 'info', 'warn', 'error', 'fatal');--> statement-breakpoint
CREATE TABLE "logs" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "logs_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"level" "log_level" NOT NULL,
	"message" text NOT NULL,
	"context" text,
	"user_id" varchar(255),
	"request_id" varchar(255),
	"method" varchar(10),
	"path" varchar(500),
	"status_code" integer,
	"duration" integer,
	"error_message" text,
	"error_stack" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
