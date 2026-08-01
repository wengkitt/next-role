CREATE TABLE `education_entries` (
	`id` text PRIMARY KEY NOT NULL,
	`resume_id` text NOT NULL,
	`institution` text NOT NULL,
	`qualification` text NOT NULL,
	`field_of_study` text,
	`location` text,
	`start_date` text,
	`end_date` text,
	`description` text,
	`sort_order` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`resume_id`) REFERENCES `resumes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `education_entries_resume_sort_idx` ON `education_entries` (`resume_id`,`sort_order`);--> statement-breakpoint
CREATE TABLE `resume_projects` (
	`id` text PRIMARY KEY NOT NULL,
	`resume_id` text NOT NULL,
	`name` text NOT NULL,
	`role` text,
	`description` text,
	`technologies` text,
	`project_url` text,
	`repository_url` text,
	`start_date` text,
	`end_date` text,
	`sort_order` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`resume_id`) REFERENCES `resumes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `resume_projects_resume_sort_idx` ON `resume_projects` (`resume_id`,`sort_order`);--> statement-breakpoint
CREATE TABLE `resume_skills` (
	`id` text PRIMARY KEY NOT NULL,
	`resume_id` text NOT NULL,
	`name` text NOT NULL,
	`sort_order` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`resume_id`) REFERENCES `resumes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `resume_skills_resume_sort_idx` ON `resume_skills` (`resume_id`,`sort_order`);--> statement-breakpoint
CREATE TABLE `resume_summaries` (
	`id` text PRIMARY KEY NOT NULL,
	`resume_id` text NOT NULL,
	`content` text DEFAULT '' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`resume_id`) REFERENCES `resumes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `resume_summaries_resume_id_unique` ON `resume_summaries` (`resume_id`);--> statement-breakpoint
CREATE TABLE `work_experiences` (
	`id` text PRIMARY KEY NOT NULL,
	`resume_id` text NOT NULL,
	`job_title` text NOT NULL,
	`company` text NOT NULL,
	`location` text,
	`start_date` text NOT NULL,
	`end_date` text,
	`is_current` integer DEFAULT false NOT NULL,
	`description` text,
	`sort_order` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`resume_id`) REFERENCES `resumes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `work_experiences_resume_sort_idx` ON `work_experiences` (`resume_id`,`sort_order`);