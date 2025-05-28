ALTER TABLE "User" ALTER COLUMN "email" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "password" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "username" varchar(30);--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "ai_preferences" text;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "interests" text;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "occupation" varchar(100);--> statement-breakpoint
ALTER TABLE "User" ADD CONSTRAINT "User_email_unique" UNIQUE("email");