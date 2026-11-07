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

export interface SearchResponse {
  results: SearchResult[];
  provider: { name: string; type: string } | null;
  attempts: number;
  status: { type: "success" | "error"; message: string | null };
}
