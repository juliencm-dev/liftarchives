CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"firstName" text,
	"lastName" text,
	"emailVerified" timestamp,
	"image" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "usersInformations" (
	"userId" text NOT NULL,
	"age" integer NOT NULL,
	"height" text NOT NULL,
	"weight" text NOT NULL,
	"liftsUnits" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "usersLifts" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"liftId" text NOT NULL,
	"oneRepMax" double precision NOT NULL,
	"oneRepMaxDate" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lifts" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"description" text,
	"category" text
);
--> statement-breakpoint
DROP TABLE "account";--> statement-breakpoint
DROP TABLE "session";--> statement-breakpoint
DROP TABLE "user";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "usersInformations" ADD CONSTRAINT "usersInformations_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "usersLifts" ADD CONSTRAINT "usersLifts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "usersLifts" ADD CONSTRAINT "usersLifts_liftId_lifts_id_fk" FOREIGN KEY ("liftId") REFERENCES "public"."lifts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
