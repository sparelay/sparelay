import { z } from "@/shared/lib/zod";

import { apifyFormSchema } from "./apify";
import { braveFormSchema } from "./brave";
import { exaFormSchema } from "./exa";
import { firecrawlFormSchema } from "./firecrawl";
import { linkupFormSchema } from "./linkup";
import { mwmblFormSchema } from "./mwmbl";
import { parallelFormSchema } from "./parallel";
import { scrapedoFormSchema } from "./scrapedo";
import { searxngFormSchema } from "./searxng";
import { serpapiFormSchema } from "./serpapi";
import { tavilyFormSchema } from "./tavily";
import { youcomFormSchema } from "./youcom";
import { zenserpFormSchema } from "./zenserp";

interface ProviderMeta {
  label: string;
  icon: { light: string; dark?: string };
  schema: { add: z.ZodObject; edit: z.ZodObject };
}

function generateFormSchema<Shape extends z.ZodRawShape>(
  base: z.ZodObject<Shape & { id: z.ZodType; type: z.ZodType }>,
) {
  if (!Object.hasOwn(base.shape, "type")) {
    throw new Error("Provider form schema must define a `type` field");
  }
  return {
    add: base.omit({ id: true }),
    edit: base.extend({ apiKey: z.string().optional() }),
  };
}

export const PROVIDER_REGISTRY = {
  searxng: {
    label: "SearXNG",
    icon: { light: "/assets/images/brand/searxng.svg" },
    schema: generateFormSchema(searxngFormSchema),
  },
  exa: {
    label: "Exa",
    icon: { light: "/assets/images/brand/exa.svg" },
    schema: generateFormSchema(exaFormSchema),
  },
  tavily: {
    label: "Tavily",
    icon: {
      light: "/assets/images/brand/tavily-light.svg",
      dark: "/assets/images/brand/tavily-dark.svg",
    },
    schema: generateFormSchema(tavilyFormSchema),
  },
  parallel: {
    label: "Parallel",
    icon: {
      light: "/assets/images/brand/parallel-light.svg",
      dark: "/assets/images/brand/parallel-dark.svg",
    },
    schema: generateFormSchema(parallelFormSchema),
  },
  linkup: {
    label: "Linkup",
    icon: {
      light: "/assets/images/brand/linkup-icon.png",
      dark: "/assets/images/brand/linkup-icon-dark.png",
    },
    schema: generateFormSchema(linkupFormSchema),
  },
  youcom: {
    label: "You.com",
    icon: { light: "/assets/images/brand/youcom.svg" },
    schema: generateFormSchema(youcomFormSchema),
  },
  mwmbl: {
    label: "Mwmbl",
    icon: { light: "/assets/images/brand/mwmbl.svg" },
    schema: generateFormSchema(mwmblFormSchema),
  },
  brave: {
    label: "Brave",
    icon: { light: "/assets/images/brand/brave.svg" },
    schema: generateFormSchema(braveFormSchema),
  },
  apify: {
    label: "Apify",
    icon: { light: "/assets/images/brand/apify.svg" },
    schema: generateFormSchema(apifyFormSchema),
  },
  serpapi: {
    label: "SerpApi",
    icon: { light: "/assets/images/brand/serpapi.svg" },
    schema: generateFormSchema(serpapiFormSchema),
  },
  zenserp: {
    label: "Zenserp",
    icon: { light: "/assets/images/brand/zenserp-icon.png" },
    schema: generateFormSchema(zenserpFormSchema),
  },
  firecrawl: {
    label: "Firecrawl",
    icon: { light: "/assets/images/brand/firecrawl.png" },
    schema: generateFormSchema(firecrawlFormSchema),
  },
  scrapedo: {
    label: "Scrape.do",
    icon: { light: "/assets/images/brand/scrapedo.svg" },
    schema: generateFormSchema(scrapedoFormSchema),
  },
} satisfies Record<string, ProviderMeta>;

export const providerTypeSchema = z.custom<keyof typeof PROVIDER_REGISTRY>(
  (value): value is keyof typeof PROVIDER_REGISTRY =>
    typeof value === "string" && Object.hasOwn(PROVIDER_REGISTRY, value),
  "Invalid provider type",
);

export type ProviderType = z.infer<typeof providerTypeSchema>;

export function providerDefaultBaseUrl(type: ProviderType): string | undefined {
  const schema = PROVIDER_REGISTRY[type].schema.add.shape.baseUrl;
  const result = schema.safeParse(undefined);
  return result.success && typeof result.data === "string" ? result.data : undefined;
}

export type ProviderOutput = z.output<
  (typeof PROVIDER_REGISTRY)[ProviderType]["schema"]["edit"]
> & {
  cooldownUntil: string | null;
  coolingDown: boolean;
};
