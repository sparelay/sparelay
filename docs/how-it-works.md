# How It Works

This page covers the routing behavior behind `POST /search` and the `search_web` MCP tool. For request and response shapes, see the [API](../README.md#api) section of the README.

## Routing pipeline

1. **Filter providers.** Only enabled providers are considered, ordered by their saved position.
2. **Skip cooling providers.** A provider whose `cooldownUntil` is in the future is skipped.
3. **Apply time budgets.** Each provider receives `min(provider timeout, remaining overall timeout)`.
4. **Call the provider.** Adapters normalize the native response into `{ link, title, snippet }`.
5. **Fall back when needed.** Errors, timeouts, and empty responses (when `fallbackOnEmpty` is enabled) move the request to the next provider. A provider that returns results ends the loop.
6. **Record the outcome.** The attempt is stored with its provider, latency, status, source, and result JSON.

When no provider can be tried — because every provider is disabled or cooling down — the response is an empty result array with a status message explaining why.

## Timeouts

- **Overall timeout** — 1 to 300 seconds, default 30. Set it in **Settings**.
- **Provider timeout** — configured per provider.
- Each attempt gets `min(provider timeout, remaining overall timeout)`, so a slow provider cannot consume more than what is left of the overall budget.
- When the overall budget runs out, the loop stops and the last error is returned.

## Cooldowns

- A `429` starts the provider's cooldown, but only when its cooldown value is greater than 0.
- Cooldowns accept 0 to 86,400 seconds (24 hours) and are shown in the provider list.
- A cooling provider is skipped until `cooldownUntil` passes; it is not called again before that.

## Logging

Every request is recorded in `search_logs`:

| Field                           | Description                                |
| ------------------------------- | ------------------------------------------ |
| `query`                         | The search query, trimmed                  |
| `providerName` / `providerType` | The provider that returned results, if any |
| `source`                        | `api`, `mcp`, or `playground`              |
| `attempts`                      | How many providers were tried              |
| `resultsCount` / `resultsJson`  | Normalized results, stored as JSON         |
| `durationMs`                    | Total time for the request                 |
| `success`                       | Whether a provider returned results        |
| `createdAt`                     | When the request was made                  |

These records power the dashboard, per-provider statistics, and the logs page.
