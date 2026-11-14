import { z } from "@/shared/lib/zod";

export const searchInputSchema = z.object({
  query: z.string().trim().min(1, "Query is required"),
  count: z.coerce.number().int().min(1).max(50).default(10),
});

export interface SearchResult {
  link: string;
  title: string;
  snippet: string;
}

export type SearchStatusType = "success" | "empty" | "error";

export type SearchStatusReason =
  | "no-providers"
  | "all-cooling"
  | "all-empty"
  | "all-failed"
  | "timeout";

export interface SearchStatus {
  type: SearchStatusType;
  reason: SearchStatusReason | null;
  message: string | null;
}

export interface SearchResponse {
  results: SearchResult[];
  provider: { name: string; type: string } | null;
  attempts: number;
  status: SearchStatus;
}
