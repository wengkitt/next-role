CREATE TABLE `resume_profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`resume_id` text NOT NULL,
	`full_name` text,
	`professional_title` text,
	`email` text,
	`phone` text,
	`location` text,
	`website` text,
	`linkedin_url` text,
	`github_url` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`resume_id`) REFERENCES `resumes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `resume_profiles_resume_id_unique` ON `resume_profiles` (`resume_id`);--> statement-breakpoint
CREATE TABLE `resumes` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`title` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `resumes_user_id_idx` ON `resumes` (`user_id`);--> statement-breakpoint
CREATE INDEX `resumes_user_updated_at_idx` ON `resumes` (`user_id`,`updated_at`);