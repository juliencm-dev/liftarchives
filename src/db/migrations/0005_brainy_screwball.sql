ALTER TABLE "usersInformations" ADD PRIMARY KEY ("userId");--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "accountIsSetup" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "image" text;--> statement-breakpoint
ALTER TABLE "usersInformations" ADD COLUMN "heightUnits" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "informationSetup";