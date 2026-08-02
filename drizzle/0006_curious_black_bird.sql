ALTER TABLE `resumes` ADD `section_order` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `resumes` ADD `hidden_sections` text DEFAULT '[]' NOT NULL;