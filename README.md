<p align="center">
  <a href="README.md">English</a> · <a href="README.ja.md">日本語</a>
</p>

<p align="center">
  <img src="docs/images/logo.svg" width="104" alt="Sparelay logo" />
</p>

<h1 align="center">Sparelay</h1>

<p align="center">
  <strong>One search API. Many providers. Automatic fallback.</strong><br />
  A self-hosted search gateway for OpenWebUI, LLM agents, and RAG pipelines.
</p>

---

Sparelay sits between your application and search APIs. Register the providers you already pay for, put them in the order you prefer, and call one stable endpoint. If a provider errors, times out, is rate-limited, or returns nothing, Sparelay tries the next one automatically and records what happened.

It ships with a web UI for provider management, a search playground, usage analytics, search logs, and an MCP endpoint for AI agents.

## Features

- **Fallback-first routing.** Providers are tried in a drag-and-drop order. Failures, timeouts, empty result sets, and `429` responses move the request to the next provider.
- **Bring your own search.** Use commercial APIs such as Tavily, Brave, Exa, and SerpApi, or self-hosted engines such as SearXNG and Mwmbl.
- **One interface for everything.** OpenWebUI-compatible HTTP search, an MCP tool for agents, and a browser playground share the same fallback engine.
- **Cooldown awareness.** A `429` puts that provider on cooldown for a configurable window instead of hammering it on every request.
- **Observability built in.** Track total searches, successes, success rate, average latency, P95 latency, fallbacks, per-provider stats, and trends over 1 hour to 30 days.
- **Inspect every request.** Search logs capture the query, selected provider, attempt count, latency, status, source, and result JSON.
- **Self-hosted by default.** Everything runs in your own environment, with no external SaaS control plane required.
- **Single-key authentication.** The same `API_KEY` protects the admin UI session and the Bearer-authenticated API.

## Quick Setup

1. [Install Docker](https://docs.docker.com/engine/install/) and Docker Compose.

2. Create `compose.yml` with the following content:

   ```yaml
   services:
     sparelay:
       image: ghcr.io/sparelay/sparelay:latest
       init: true
       restart: unless-stopped
       ports:
         - "3000:3000"
       environment:
         API_KEY: "${API_KEY:?Set API_KEY in the .env file}"
       volumes:
         - ./data:/app/data
       healthcheck:
         test:
           - CMD
           - bun
           - -e
           - "fetch('http://127.0.0.1:3000/healthz').then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"
         interval: 30s
         timeout: 5s
         retries: 3
         start_period: 20s
   ```

3. Create `.env` and set your API key:

   ```bash
   echo "API_KEY=your-api-key" > .env
   ```

4. Start the stack:

   ```bash
   docker compose up -d
   ```

5. Open [http://localhost:3000](http://localhost:3000) and sign in with the `API_KEY` value.

## How it works

A search request goes through the following path:

1. **Filter providers.** Only enabled providers are considered, ordered by their saved position.
2. **Skip cooling providers.** A provider whose `cooldownUntil` is in the future is skipped.
3. **Apply time budgets.** Each provider receives `min(provider timeout, remaining overall timeout)`. The overall timeout comes from **Settings** and defaults to 30 seconds.
4. **Call the provider.** Providers normalize their native response into `{ link, title, snippet }`.
5. **Fall back when needed.** Errors, timeouts, and empty responses (when `fallbackOnEmpty` is enabled) cause the next provider to be tried.
6. **Record the outcome.** The request is logged with attempts, latency, status, and source (`api`, `mcp`, or `playground`).

A `429` response triggers the provider's cooldown when its cooldown value is greater than zero. Cooldowns range from 0 to 86,400 seconds and are visible in the provider list.

## Integrations

### OpenWebUI

In OpenWebUI, open **Admin Settings → Web Search**, enable web search, select **External** as the engine, and set:

- **URL:** `http://your-sparelay-host:3000/search`
- **API key:** the same value as `API_KEY`

The **Usage** page in Sparelay shows the exact URLs and copy-ready snippets for the current deployment.

### API

#### `POST /search`

Search through the configured fallback chain. This endpoint is intentionally compatible with OpenWebUI's external search engine integration.

**Headers**

```http
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

**Body**

| Field   | Type    | Required | Description                                               |
| ------- | ------- | -------- | --------------------------------------------------------- |
| `query` | string  | Yes      | Search query. Leading and trailing whitespace is trimmed. |
| `count` | integer | No       | Maximum results, from 1 to 50. Defaults to `10`.          |

**Response**

Returns `200` with an array of results, even when every provider fails. In that case the array is empty. Authentication failures return `401`; malformed JSON or invalid input returns `400`.

#### `GET /healthz`

Returns `{"status":"ok"}` when the application is running.

### MCP

#### `POST /mcp`

A stateless [Model Context Protocol](https://modelcontextprotocol.io/) Streamable HTTP endpoint. A fresh MCP server and transport are created for every request.

The endpoint exposes one tool named `search_web`:

| Argument | Type    | Description                                      |
| -------- | ------- | ------------------------------------------------ |
| `query`  | string  | Search query.                                    |
| `count`  | integer | Maximum results, from 1 to 50. Defaults to `10`. |

The tool returns the result array as JSON text.

Example client configuration:

```json
{
  "mcpServers": {
    "sparelay": {
      "url": "http://your-sparelay-host:3000/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

## Supported providers

| Provider  | API key  | Default base URL               |
| --------- | -------- | ------------------------------ |
| SearXNG   | Optional | Your own instance              |
| Exa       | Required | `https://api.exa.ai`           |
| Tavily    | Required | `https://api.tavily.com`       |
| Parallel  | Required | `https://api.parallel.ai`      |
| Linkup    | Required | `https://api.linkup.so`        |
| You.com   | Required | `https://ydc-index.io`         |
| Mwmbl     | Optional | `https://mwmbl.org`            |
| Brave     | Required | `https://api.search.brave.com` |
| Apify     | Required | `https://api.apify.com`        |
| SerpApi   | Required | `https://serpapi.com`          |
| Zenserp   | Required | `https://app.zenserp.com`      |
| Firecrawl | Optional | `https://api.firecrawl.dev`    |
| Scrape.do | Required | `https://api.scrape.do`        |

If you need an additional provider, please open a pull request.

## Configuration

### Environment Variables

| Variable  | Required | Default                  | Description                                                                         |
| --------- | -------- | ------------------------ | ----------------------------------------------------------------------------------- |
| `API_KEY` | Yes      | —                        | Protects UI login and every Bearer-authenticated API call. Use a long random value. |
| `DB_PATH` | No       | `./data/database.sqlite` | SQLite database file. In Docker this resolves to `/app/data/database.sqlite`.       |

`DB_PATH` is only needed when you want to use a different SQLite file, such as a separate test database.

### Application Settings

- **Timezone** — used to format timestamps in the UI. Defaults to `UTC`.
- **Overall timeout** — maximum total time for a search across all providers, from 1 to 300 seconds. Defaults to 30 seconds.

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before opening a pull request. For security issues, see [SECURITY.md](SECURITY.md).

Please keep changes focused and include tests for behavior changes.

1. Fork the repository and create a branch.
2. Run `bun install`.
3. Make your change.
4. Run `bun run typecheck`, `bun run lint`, and `bun run test`.
5. Run `bun run format` before committing.
6. Open a pull request with a short description of the problem and the approach.

When adding a provider:

1. Add its schema and default configuration under `features/provider/model/<type>/`.
2. Register it in `PROVIDER_REGISTRY`.
3. Add its adapter under `features/search/server/providers/`.
4. Add the factory entry in `features/search/server/create-provider.ts`.
5. Add a form fragment if the provider needs custom fields.
6. Add tests for request building and response normalization.

## License

[MIT License](LICENSE)
