ALTER TABLE "User" ADD COLUMN "current_mood" text;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "communication_style" text;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "goals" text;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "updated_at" timestamp DEFAULT now();