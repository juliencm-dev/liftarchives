CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `account_user_id_idx` ON `account` (`user_id`);--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE INDEX `session_user_id_idx` ON `session` (`user_id`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer DEFAULT false NOT NULL,
	`image` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`first_name` text,
	`last_name` text,
	`locked` integer DEFAULT false NOT NULL,
	`plan` text DEFAULT 'free' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `verification_identifier_idx` ON `verification` (`identifier`);--> statement-breakpoint
CREATE TABLE `club_memberships` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`club_id` text NOT NULL,
	`role` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`joined_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`club_id`) REFERENCES `clubs`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `club_memberships_user_club_uniq` ON `club_memberships` (`user_id`,`club_id`);--> statement-breakpoint
CREATE INDEX `club_memberships_user_id_idx` ON `club_memberships` (`user_id`);--> statement-breakpoint
CREATE INDEX `club_memberships_club_id_idx` ON `club_memberships` (`club_id`);--> statement-breakpoint
CREATE TABLE `clubs` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`name` text NOT NULL,
	`location` text,
	`description` text,
	`image_url` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`owner_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `clubs_owner_id_idx` ON `clubs` (`owner_id`);--> statement-breakpoint
CREATE TABLE `session_comments` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`user_id` text NOT NULL,
	`content` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`session_id`) REFERENCES `training_sessions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `session_comments_session_id_idx` ON `session_comments` (`session_id`);--> statement-breakpoint
CREATE INDEX `session_comments_user_id_idx` ON `session_comments` (`user_id`);--> statement-breakpoint
CREATE TABLE `coach_lifters` (
	`id` text PRIMARY KEY NOT NULL,
	`coach_id` text NOT NULL,
	`lifter_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`coach_id`) REFERENCES `coach_profile`(`user_id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`lifter_id`) REFERENCES `lifter_profile`(`user_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `coach_lifters_coach_lifter_uniq` ON `coach_lifters` (`coach_id`,`lifter_id`);--> statement-breakpoint
CREATE INDEX `coach_lifters_coach_id_idx` ON `coach_lifters` (`coach_id`);--> statement-breakpoint
CREATE INDEX `coach_lifters_lifter_id_idx` ON `coach_lifters` (`lifter_id`);--> statement-breakpoint
CREATE TABLE `coach_profile` (
	`user_id` text PRIMARY KEY NOT NULL,
	`bio` text,
	`club_id` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`club_id`) REFERENCES `clubs`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `coach_profile_club_id_idx` ON `coach_profile` (`club_id`);--> statement-breakpoint
CREATE TABLE `lifter_profile` (
	`user_id` text PRIMARY KEY NOT NULL,
	`date_of_birth` text NOT NULL,
	`weight` real NOT NULL,
	`gender` text NOT NULL,
	`lift_unit` text NOT NULL,
	`competitive_division` text NOT NULL,
	`club_id` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`club_id`) REFERENCES `clubs`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `lifter_profile_club_id_idx` ON `lifter_profile` (`club_id`);--> statement-breakpoint
CREATE TABLE `competition_categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`qualifying_total` integer,
	`min_date_of_birth` text NOT NULL,
	`max_date_of_birth` text,
	`min_weight` real NOT NULL,
	`max_weight` real,
	`gender` text NOT NULL,
	`division` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `competition_categories_name_unique` ON `competition_categories` (`name`);--> statement-breakpoint
CREATE TABLE `lift_translations` (
	`id` text PRIMARY KEY NOT NULL,
	`lift_id` text NOT NULL,
	`en` text NOT NULL,
	`fr` text NOT NULL,
	FOREIGN KEY (`lift_id`) REFERENCES `lifts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `lift_translations_lift_id_unique` ON `lift_translations` (`lift_id`);--> statement-breakpoint
CREATE TABLE `lifts` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`category` text NOT NULL,
	`is_core` integer DEFAULT false NOT NULL,
	`parent_lift_id` text,
	`created_by_id` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`created_by_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `lifts_created_by_id_idx` ON `lifts` (`created_by_id`);--> statement-breakpoint
CREATE INDEX `lifts_parent_lift_id_idx` ON `lifts` (`parent_lift_id`);--> statement-breakpoint
CREATE TABLE `program_assignments` (
	`id` text PRIMARY KEY NOT NULL,
	`program_id` text NOT NULL,
	`user_id` text NOT NULL,
	`assigned_at` integer DEFAULT (unixepoch()) NOT NULL,
	`start_date` text,
	`status` text DEFAULT 'active' NOT NULL,
	`current_week_number` integer DEFAULT 1 NOT NULL,
	`current_cycle` integer DEFAULT 1 NOT NULL,
	`current_week_started_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`program_id`) REFERENCES `programs`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `program_assignments_program_user_uniq` ON `program_assignments` (`program_id`,`user_id`);--> statement-breakpoint
CREATE INDEX `program_assignments_program_id_idx` ON `program_assignments` (`program_id`);--> statement-breakpoint
CREATE INDEX `program_assignments_user_id_idx` ON `program_assignments` (`user_id`);--> statement-breakpoint
CREATE TABLE `program_block_movements` (
	`id` text PRIMARY KEY NOT NULL,
	`block_id` text NOT NULL,
	`lift_id` text NOT NULL,
	`display_order` integer NOT NULL,
	`reps` integer DEFAULT 1 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`block_id`) REFERENCES `program_blocks`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`lift_id`) REFERENCES `lifts`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE INDEX `program_block_movements_block_id_idx` ON `program_block_movements` (`block_id`);--> statement-breakpoint
CREATE INDEX `program_block_movements_lift_id_idx` ON `program_block_movements` (`lift_id`);--> statement-breakpoint
CREATE TABLE `program_blocks` (
	`id` text PRIMARY KEY NOT NULL,
	`day_id` text NOT NULL,
	`display_order` integer NOT NULL,
	`sets` integer DEFAULT 1 NOT NULL,
	`reps` integer DEFAULT 1 NOT NULL,
	`up_to` integer DEFAULT false NOT NULL,
	`up_to_percent` real,
	`up_to_rpe` real,
	`set_details` text,
	`notes` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`day_id`) REFERENCES `program_days`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `program_blocks_day_id_idx` ON `program_blocks` (`day_id`);--> statement-breakpoint
CREATE TABLE `program_days` (
	`id` text PRIMARY KEY NOT NULL,
	`week_id` text NOT NULL,
	`day_number` integer NOT NULL,
	`name` text,
	`notes` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`week_id`) REFERENCES `program_weeks`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `program_days_week_id_idx` ON `program_days` (`week_id`);--> statement-breakpoint
CREATE TABLE `program_weeks` (
	`id` text PRIMARY KEY NOT NULL,
	`program_id` text NOT NULL,
	`week_number` integer NOT NULL,
	`name` text,
	`notes` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`program_id`) REFERENCES `programs`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `program_weeks_program_id_idx` ON `program_weeks` (`program_id`);--> statement-breakpoint
CREATE TABLE `programs` (
	`id` text PRIMARY KEY NOT NULL,
	`created_by_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`duration_weeks` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`created_by_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `programs_created_by_id_idx` ON `programs` (`created_by_id`);--> statement-breakpoint
CREATE TABLE `exercise_media` (
	`id` text PRIMARY KEY NOT NULL,
	`session_exercise_id` text NOT NULL,
	`uploaded_by_id` text NOT NULL,
	`url` text NOT NULL,
	`title` text,
	`description` text,
	`file_type` text,
	`file_size` integer,
	`is_private` integer DEFAULT true NOT NULL,
	`uploaded_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`session_exercise_id`) REFERENCES `session_exercises`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`uploaded_by_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `exercise_media_session_exercise_id_idx` ON `exercise_media` (`session_exercise_id`);--> statement-breakpoint
CREATE INDEX `exercise_media_uploaded_by_id_idx` ON `exercise_media` (`uploaded_by_id`);--> statement-breakpoint
CREATE TABLE `session_exercises` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`lift_id` text NOT NULL,
	`program_block_id` text,
	`order` integer NOT NULL,
	`notes` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`session_id`) REFERENCES `training_sessions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`lift_id`) REFERENCES `lifts`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`program_block_id`) REFERENCES `program_blocks`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `session_exercises_session_id_idx` ON `session_exercises` (`session_id`);--> statement-breakpoint
CREATE INDEX `session_exercises_lift_id_idx` ON `session_exercises` (`lift_id`);--> statement-breakpoint
CREATE TABLE `session_sets` (
	`id` text PRIMARY KEY NOT NULL,
	`session_exercise_id` text NOT NULL,
	`set_number` integer NOT NULL,
	`weight` real NOT NULL,
	`reps` integer NOT NULL,
	`rpe` real,
	`percentage_of_1rm` real,
	`tempo` text,
	`rest_seconds` integer,
	`set_type` text NOT NULL,
	`feedback` text,
	`notes` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`session_exercise_id`) REFERENCES `session_exercises`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `session_sets_session_exercise_id_idx` ON `session_sets` (`session_exercise_id`);--> statement-breakpoint
CREATE TABLE `training_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`program_day_id` text,
	`date` text NOT NULL,
	`title` text,
	`notes` text,
	`duration_minutes` integer,
	`started_at` integer,
	`completed_at` integer,
	`is_shared_with_coach` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`program_day_id`) REFERENCES `program_days`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `training_sessions_user_id_date_idx` ON `training_sessions` (`user_id`,`date`);--> statement-breakpoint
CREATE INDEX `training_sessions_program_day_id_idx` ON `training_sessions` (`program_day_id`);--> statement-breakpoint
CREATE TABLE `personal_records` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`lift_id` text NOT NULL,
	`weight` real NOT NULL,
	`reps` integer NOT NULL,
	`estimated_one_rep_max` real,
	`session_set_id` text,
	`date` text NOT NULL,
	`source` text NOT NULL,
	`notes` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`lift_id`) REFERENCES `lifts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`session_set_id`) REFERENCES `session_sets`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `personal_records_user_lift_reps_idx` ON `personal_records` (`user_id`,`lift_id`,`reps`);--> statement-breakpoint
CREATE INDEX `personal_records_session_set_id_idx` ON `personal_records` (`session_set_id`);--> statement-breakpoint
CREATE TABLE `training_settings` (
	`user_id` text PRIMARY KEY NOT NULL,
	`bar_weight` real DEFAULT 20 NOT NULL,
	`snatch_increment` real DEFAULT 5 NOT NULL,
	`clean_and_jerk_increment` real DEFAULT 10 NOT NULL,
	`powerlifting_increment` real DEFAULT 2.5 NOT NULL,
	`accessory_increment` real DEFAULT 2.5 NOT NULL,
	`default_rest_seconds` integer DEFAULT 120 NOT NULL,
	`default_block_rest_seconds` integer DEFAULT 180 NOT NULL,
	`intensity_mode` text DEFAULT 'percent' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
