import type { providersTable } from "./schemas/providers";
import type { searchLogsTable } from "./schemas/search-logs";
import type { settingsTable } from "./schemas/settings";

export type ProviderRow = typeof providersTable.$inferSelect;
export type SearchLogRow = typeof searchLogsTable.$inferSelect;
export type SettingRow = typeof settingsTable.$inferSelect;
