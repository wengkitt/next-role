CREATE TABLE `resume_awards` (
	`id` text PRIMARY KEY NOT NULL,
	`resume_id` text NOT NULL,
	`title` text NOT NULL,
	`issuer` text,
	`date` text,
	`description` text,
	`sort_order` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`resume_id`) REFERENCES `resumes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `resume_awards_resume_sort_idx` ON `resume_awards` (`resume_id`,`sort_order`);--> statement-breakpoint
CREATE TABLE `resume_certifications` (
	`id` text PRIMARY KEY NOT NULL,
	`resume_id` text NOT NULL,
	`name` text NOT NULL,
	`issuer` text,
	`date` text,
	`credential_url` text,
	`sort_order` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`resume_id`) REFERENCES `resumes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `resume_certifications_resume_sort_idx` ON `resume_certifications` (`resume_id`,`sort_order`);--> statement-breakpoint
CREATE TABLE `resume_languages` (
	`id` text PRIMARY KEY NOT NULL,
	`resume_id` text NOT NULL,
	`language` text NOT NULL,
	`proficiency` text,
	`sort_order` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`resume_id`) REFERENCES `resumes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `resume_languages_resume_sort_idx` ON `resume_languages` (`resume_id`,`sort_order`);--> statement-breakpoint
CREATE TABLE `resume_volunteer` (
	`id` text PRIMARY KEY NOT NULL,
	`resume_id` text NOT NULL,
	`organization` text NOT NULL,
	`role` text,
	`start_date` text,
	`end_date` text,
	`description` text,
	`sort_order` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`resume_id`) REFERENCES `resumes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `resume_volunteer_resume_sort_idx` ON `resume_volunteer` (`resume_id`,`sort_order`);