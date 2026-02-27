CREATE TYPE "public"."club_membership_role" AS ENUM('admin', 'coach', 'lifter');--> statement-breakpoint
CREATE TYPE "public"."club_membership_status" AS ENUM('active', 'pending', 'banned');--> statement-breakpoint
CREATE TYPE "public"."competitive_division" AS ENUM('junior', 'senior', 'masters');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('male', 'female');--> statement-breakpoint
CREATE TYPE "public"."lift_category" AS ENUM('olympic', 'accessory', 'pull_variation', 'drill');--> statement-breakpoint
CREATE TYPE "public"."lift_unit" AS ENUM('kg', 'lb');--> statement-breakpoint
CREATE TYPE "public"."pr_source" AS ENUM('session', 'manual', 'competition');--> statement-breakpoint
CREATE TYPE "public"."program_assignment_status" AS ENUM('active', 'completed', 'paused');--> statement-breakpoint
CREATE TYPE "public"."set_type" AS ENUM('warmup', 'working', 'backoff', 'dropset', 'amrap');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"first_name" text,
	"last_name" text,
	"locked" boolean DEFAULT false NOT NULL,
	"plan" text DEFAULT 'free' NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "club_memberships" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"club_id" text NOT NULL,
	"role" "club_membership_role" NOT NULL,
	"status" "club_membership_status" DEFAULT 'active' NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "club_memberships_user_club_uniq" UNIQUE("user_id","club_id")
);
--> statement-breakpoint
CREATE TABLE "clubs" (
	"id" text PRIMARY KEY NOT NULL,
	"owner_id" text NOT NULL,
	"name" text NOT NULL,
	"location" text,
	"description" text,
	"image_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session_comments" (
	"id" text PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"user_id" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "coach_lifters" (
	"id" text PRIMARY KEY NOT NULL,
	"coach_id" text NOT NULL,
	"lifter_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "coach_lifters_coach_lifter_uniq" UNIQUE("coach_id","lifter_id")
);
--> statement-breakpoint
CREATE TABLE "coach_profile" (
	"user_id" text PRIMARY KEY NOT NULL,
	"bio" text,
	"club_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lifter_profile" (
	"user_id" text PRIMARY KEY NOT NULL,
	"date_of_birth" date NOT NULL,
	"weight" double precision NOT NULL,
	"gender" "gender" NOT NULL,
	"lift_unit" "lift_unit" NOT NULL,
	"competitive_division" "competitive_division" NOT NULL,
	"club_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "competition_categories" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"qualifying_total" integer,
	"min_date_of_birth" date NOT NULL,
	"max_date_of_birth" date,
	"min_weight" double precision NOT NULL,
	"max_weight" double precision,
	"gender" "gender" NOT NULL,
	"division" "competitive_division" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "competition_categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "lifts" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"category" "lift_category" NOT NULL,
	"is_core" boolean DEFAULT false NOT NULL,
	"created_by_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "program_assignments" (
	"id" text PRIMARY KEY NOT NULL,
	"program_id" text NOT NULL,
	"lifter_id" text NOT NULL,
	"assigned_at" timestamp DEFAULT now() NOT NULL,
	"start_date" date,
	"status" "program_assignment_status" DEFAULT 'active' NOT NULL,
	CONSTRAINT "program_assignments_program_lifter_uniq" UNIQUE("program_id","lifter_id")
);
--> statement-breakpoint
CREATE TABLE "program_day_exercise_sets" (
	"id" text PRIMARY KEY NOT NULL,
	"exercise_id" text NOT NULL,
	"set_number" integer NOT NULL,
	"prescribed_reps" integer,
	"prescribed_weight" double precision,
	"prescribed_rpe" double precision,
	"prescribed_percentage" double precision,
	"prescribed_tempo" text,
	"prescribed_rest_seconds" integer,
	"set_type" "set_type" NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "program_day_exercises" (
	"id" text PRIMARY KEY NOT NULL,
	"day_id" text NOT NULL,
	"lift_id" text NOT NULL,
	"order" integer NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "program_days" (
	"id" text PRIMARY KEY NOT NULL,
	"week_id" text NOT NULL,
	"day_number" integer NOT NULL,
	"name" text,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "program_weeks" (
	"id" text PRIMARY KEY NOT NULL,
	"program_id" text NOT NULL,
	"week_number" integer NOT NULL,
	"name" text,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "programs" (
	"id" text PRIMARY KEY NOT NULL,
	"coach_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"duration_weeks" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exercise_media" (
	"id" text PRIMARY KEY NOT NULL,
	"session_exercise_id" text NOT NULL,
	"uploaded_by_id" text NOT NULL,
	"url" text NOT NULL,
	"title" text,
	"description" text,
	"file_type" text,
	"file_size" integer,
	"is_private" boolean DEFAULT true NOT NULL,
	"uploaded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session_exercises" (
	"id" text PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"lift_id" text NOT NULL,
	"order" integer NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session_sets" (
	"id" text PRIMARY KEY NOT NULL,
	"session_exercise_id" text NOT NULL,
	"set_number" integer NOT NULL,
	"weight" double precision NOT NULL,
	"reps" integer NOT NULL,
	"rpe" double precision,
	"percentage_of_1rm" double precision,
	"tempo" text,
	"rest_seconds" integer,
	"set_type" "set_type" NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "training_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"program_day_id" text,
	"date" date NOT NULL,
	"title" text,
	"notes" text,
	"duration_minutes" integer,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "personal_records" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"lift_id" text NOT NULL,
	"weight" double precision NOT NULL,
	"reps" integer NOT NULL,
	"estimated_one_rep_max" double precision,
	"session_set_id" text,
	"date" date NOT NULL,
	"source" "pr_source" NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "club_memberships" ADD CONSTRAINT "club_memberships_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "club_memberships" ADD CONSTRAINT "club_memberships_club_id_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clubs" ADD CONSTRAINT "clubs_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_comments" ADD CONSTRAINT "session_comments_session_id_training_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."training_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_comments" ADD CONSTRAINT "session_comments_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coach_lifters" ADD CONSTRAINT "coach_lifters_coach_id_coach_profile_user_id_fk" FOREIGN KEY ("coach_id") REFERENCES "public"."coach_profile"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coach_lifters" ADD CONSTRAINT "coach_lifters_lifter_id_lifter_profile_user_id_fk" FOREIGN KEY ("lifter_id") REFERENCES "public"."lifter_profile"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coach_profile" ADD CONSTRAINT "coach_profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coach_profile" ADD CONSTRAINT "coach_profile_club_id_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lifter_profile" ADD CONSTRAINT "lifter_profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lifter_profile" ADD CONSTRAINT "lifter_profile_club_id_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lifts" ADD CONSTRAINT "lifts_created_by_id_user_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "program_assignments" ADD CONSTRAINT "program_assignments_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "program_assignments" ADD CONSTRAINT "program_assignments_lifter_id_lifter_profile_user_id_fk" FOREIGN KEY ("lifter_id") REFERENCES "public"."lifter_profile"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "program_day_exercise_sets" ADD CONSTRAINT "program_day_exercise_sets_exercise_id_program_day_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."program_day_exercises"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "program_day_exercises" ADD CONSTRAINT "program_day_exercises_day_id_program_days_id_fk" FOREIGN KEY ("day_id") REFERENCES "public"."program_days"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "program_day_exercises" ADD CONSTRAINT "program_day_exercises_lift_id_lifts_id_fk" FOREIGN KEY ("lift_id") REFERENCES "public"."lifts"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "program_days" ADD CONSTRAINT "program_days_week_id_program_weeks_id_fk" FOREIGN KEY ("week_id") REFERENCES "public"."program_weeks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "program_weeks" ADD CONSTRAINT "program_weeks_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "programs" ADD CONSTRAINT "programs_coach_id_coach_profile_user_id_fk" FOREIGN KEY ("coach_id") REFERENCES "public"."coach_profile"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercise_media" ADD CONSTRAINT "exercise_media_session_exercise_id_session_exercises_id_fk" FOREIGN KEY ("session_exercise_id") REFERENCES "public"."session_exercises"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercise_media" ADD CONSTRAINT "exercise_media_uploaded_by_id_user_id_fk" FOREIGN KEY ("uploaded_by_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_exercises" ADD CONSTRAINT "session_exercises_session_id_training_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."training_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_exercises" ADD CONSTRAINT "session_exercises_lift_id_lifts_id_fk" FOREIGN KEY ("lift_id") REFERENCES "public"."lifts"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_sets" ADD CONSTRAINT "session_sets_session_exercise_id_session_exercises_id_fk" FOREIGN KEY ("session_exercise_id") REFERENCES "public"."session_exercises"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "training_sessions" ADD CONSTRAINT "training_sessions_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "training_sessions" ADD CONSTRAINT "training_sessions_program_day_id_program_days_id_fk" FOREIGN KEY ("program_day_id") REFERENCES "public"."program_days"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personal_records" ADD CONSTRAINT "personal_records_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personal_records" ADD CONSTRAINT "personal_records_lift_id_lifts_id_fk" FOREIGN KEY ("lift_id") REFERENCES "public"."lifts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personal_records" ADD CONSTRAINT "personal_records_session_set_id_session_sets_id_fk" FOREIGN KEY ("session_set_id") REFERENCES "public"."session_sets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "club_memberships_user_id_idx" ON "club_memberships" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "club_memberships_club_id_idx" ON "club_memberships" USING btree ("club_id");--> statement-breakpoint
CREATE INDEX "clubs_owner_id_idx" ON "clubs" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "session_comments_session_id_idx" ON "session_comments" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "session_comments_user_id_idx" ON "session_comments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "coach_lifters_coach_id_idx" ON "coach_lifters" USING btree ("coach_id");--> statement-breakpoint
CREATE INDEX "coach_lifters_lifter_id_idx" ON "coach_lifters" USING btree ("lifter_id");--> statement-breakpoint
CREATE INDEX "coach_profile_club_id_idx" ON "coach_profile" USING btree ("club_id");--> statement-breakpoint
CREATE INDEX "lifter_profile_club_id_idx" ON "lifter_profile" USING btree ("club_id");--> statement-breakpoint
CREATE INDEX "lifts_created_by_id_idx" ON "lifts" USING btree ("created_by_id");--> statement-breakpoint
CREATE INDEX "program_assignments_program_id_idx" ON "program_assignments" USING btree ("program_id");--> statement-breakpoint
CREATE INDEX "program_assignments_lifter_id_idx" ON "program_assignments" USING btree ("lifter_id");--> statement-breakpoint
CREATE INDEX "program_day_exercise_sets_exercise_id_idx" ON "program_day_exercise_sets" USING btree ("exercise_id");--> statement-breakpoint
CREATE INDEX "program_day_exercises_day_id_idx" ON "program_day_exercises" USING btree ("day_id");--> statement-breakpoint
CREATE INDEX "program_day_exercises_lift_id_idx" ON "program_day_exercises" USING btree ("lift_id");--> statement-breakpoint
CREATE INDEX "program_days_week_id_idx" ON "program_days" USING btree ("week_id");--> statement-breakpoint
CREATE INDEX "program_weeks_program_id_idx" ON "program_weeks" USING btree ("program_id");--> statement-breakpoint
CREATE INDEX "programs_coach_id_idx" ON "programs" USING btree ("coach_id");--> statement-breakpoint
CREATE INDEX "exercise_media_session_exercise_id_idx" ON "exercise_media" USING btree ("session_exercise_id");--> statement-breakpoint
CREATE INDEX "exercise_media_uploaded_by_id_idx" ON "exercise_media" USING btree ("uploaded_by_id");--> statement-breakpoint
CREATE INDEX "session_exercises_session_id_idx" ON "session_exercises" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "session_exercises_lift_id_idx" ON "session_exercises" USING btree ("lift_id");--> statement-breakpoint
CREATE INDEX "session_sets_session_exercise_id_idx" ON "session_sets" USING btree ("session_exercise_id");--> statement-breakpoint
CREATE INDEX "training_sessions_user_id_date_idx" ON "training_sessions" USING btree ("user_id","date");--> statement-breakpoint
CREATE INDEX "training_sessions_program_day_id_idx" ON "training_sessions" USING btree ("program_day_id");--> statement-breakpoint
CREATE INDEX "personal_records_user_lift_reps_idx" ON "personal_records" USING btree ("user_id","lift_id","reps");--> statement-breakpoint
CREATE INDEX "personal_records_session_set_id_idx" ON "personal_records" USING btree ("session_set_id");