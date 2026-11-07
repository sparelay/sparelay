import "server-only";
import { apifyProviderConfigSchema } from "@/features/provider/model/apify";
import { braveProviderConfigSchema } from "@/features/provider/model/brave";
import { exaProviderConfigSchema } from "@/features/provider/model/exa";
import { firecrawlProviderConfigSchema } from "@/features/provider/model/firecrawl";
import { linkupProviderConfigSchema } from "@/features/provider/model/linkup";
import { mwmblProviderConfigSchema } from "@/features/provider/model/mwmbl";
import { parallelProviderConfigSchema } from "@/features/provider/model/parallel";
import { providerTypeSchema, type ProviderType } from "@/features/provider/model/provider";
import { scrapedoProviderConfigSchema } from "@/features/provider/model/scrapedo";
import { searxngProviderConfigSchema } from "@/features/provider/model/searxng";
import { serpapiProviderConfigSchema } from "@/features/provider/model/serpapi";
import { tavilyProviderConfigSchema } from "@/features/provider/model/tavily";
import { youcomProviderConfigSchema } from "@/features/provider/model/youcom";
import { zenserpProviderConfigSchema } from "@/features/provider/model/zenserp";
import type { ProviderRow } from "@/shared/db/types";

import type { SearchProvider } from "../model/provider";
import { ApifyProvider } from "./providers/apify";
import { BraveProvider } from "./providers/brave";
import { ExaProvider } from "./providers/exa";
import { FirecrawlProvider } from "./providers/firecrawl";
import { LinkupProvider } from "./providers/linkup";
import { MwmblProvider } from "./providers/mwmbl";
import { ParallelProvider } from "./providers/parallel";
import { ScrapedoProvider } from "./providers/scrapedo";
import { SearxngProvider } from "./providers/searxng";
import { SerpapiProvider } from "./providers/serpapi";
import { TavilyProvider } from "./providers/tavily";
import { YoucomProvider } from "./providers/youcom";
import { ZenserpProvider } from "./providers/zenserp";

type ProviderFactory = (row: ProviderRow) => SearchProvider;

const FACTORIES: Record<ProviderType, ProviderFactory> = {
  searxng: (row) => new SearxngProvider(searxngProviderConfigSchema.parse(row)),
  exa: (row) => new ExaProvider(exaProviderConfigSchema.parse(row)),
  tavily: (row) => new TavilyProvider(tavilyProviderConfigSchema.parse(row)),
  parallel: (row) => new ParallelProvider(parallelProviderConfigSchema.parse(row)),
  linkup: (row) => new LinkupProvider(linkupProviderConfigSchema.parse(row)),
  youcom: (row) => new YoucomProvider(youcomProviderConfigSchema.parse(row)),
  mwmbl: (row) => new MwmblProvider(mwmblProviderConfigSchema.parse(row)),
  brave: (row) => new BraveProvider(braveProviderConfigSchema.parse(row)),
  apify: (row) => new ApifyProvider(apifyProviderConfigSchema.parse(row)),
  serpapi: (row) => new SerpapiProvider(serpapiProviderConfigSchema.parse(row)),
  zenserp: (row) => new ZenserpProvider(zenserpProviderConfigSchema.parse(row)),
  firecrawl: (row) => new FirecrawlProvider(firecrawlProviderConfigSchema.parse(row)),
  scrapedo: (row) => new ScrapedoProvider(scrapedoProviderConfigSchema.parse(row)),
};

export function createProvider(p: ProviderRow): SearchProvider {
  return FACTORIES[providerTypeSchema.parse(p.type)](p);
}
