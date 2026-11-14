import type { SearchStatus } from "../model/search";

export interface SearchTally {
  /** Number of enabled providers in the database. */
  enabledProviders: number;
  /** Enabled providers that were not cooling down. */
  availableProviders: number;
  attempts: number;
  /** Number of results collected. */
  results: number;
  /** A provider responded without results and the chain moved on. */
  sawEmptyResponse: boolean;
  /** At least one provider attempt failed. */
  sawError: boolean;
  /** The overall timeout ran out before every provider was tried. */
  timedOut: boolean;
  lastError: string | null;
}

/**
 * Classifies how a search attempt ended.
 *
 * - `success`: results were found
 * - `empty`: providers responded without errors but found nothing
 * - `error`: no provider produced results and something went wrong
 *   (no providers configured, all cooling down, every attempt failed,
 *   or the overall timeout ran out)
 */
export function resolveSearchStatus(tally: SearchTally): SearchStatus {
  if (tally.enabledProviders === 0) {
    return { type: "error", reason: "no-providers", message: "No providers are configured" };
  }
  if (tally.availableProviders === 0) {
    return { type: "error", reason: "all-cooling", message: "All providers are cooling down" };
  }
  if (tally.results > 0) {
    return { type: "success", reason: null, message: null };
  }
  if (tally.timedOut) {
    return { type: "error", reason: "timeout", message: tally.lastError ?? "Search timed out" };
  }
  if (tally.sawEmptyResponse) {
    return { type: "empty", reason: "all-empty", message: null };
  }
  return {
    type: "error",
    reason: "all-failed",
    message: tally.lastError ?? "No provider returned results",
  };
}
