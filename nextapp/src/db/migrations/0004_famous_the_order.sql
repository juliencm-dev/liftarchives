ALTER TABLE "users" ADD COLUMN "informationSetup" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "image";--> statement-breakpoint
ALTER TABLE "usersInformations" DROP COLUMN IF EXISTS "height";