CREATE TABLE IF NOT EXISTS `providers` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`name` text NOT NULL,
	`base_url` text DEFAULT '' NOT NULL,
	`api_key` text DEFAULT '' NOT NULL,
	`enabled` integer DEFAULT true NOT NULL,
	`fallback_on_empty` integer DEFAULT true NOT NULL,
	`timeout_sec` integer DEFAULT 5 NOT NULL,
	`cooldown` integer DEFAULT 60 NOT NULL,
	`cooldown_until` text,
	`order` integer NOT NULL,
	`extra` text DEFAULT '{}' NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `search_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`query` text NOT NULL,
	`provider_name` text,
	`provider_type` text,
	`attempts` integer DEFAULT 0 NOT NULL,
	`results_count` integer DEFAULT 0 NOT NULL,
	`duration_ms` integer DEFAULT 0 NOT NULL,
	`success` integer DEFAULT false NOT NULL,
	`source` text NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`results_json` text DEFAULT '[]' NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_logs_created` ON `search_logs` (`created_at`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_logs_provider` ON `search_logs` (`provider_name`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text DEFAULT '' NOT NULL
);
