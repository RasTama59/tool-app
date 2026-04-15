import type {Metadata} from "next";
import {getTranslations} from "next-intl/server";

import {
  getSiteUrl,
  localeMetadata,
  type AppLocale,
} from "@/config/site";
import {toolContentEn} from "@/content/tools/tool-content-en";
import {toolContentJa} from "@/content/tools/tool-content-ja";
import {
  toolSlugs,
  type ToolLinkItem,
  type ToolPageContent,
  type ToolSlug,
} from "@/content/tools/tool-types";
import {getPathname} from "@/i18n/navigation";
import {buildLanguageAlternates} from "@/lib/seo";
import {getSiteChromeContent} from "@/lib/site-chrome";

type LocalizedToolLinkItem = Omit<ToolLinkItem, "href"> & {
  href: string;
};

export type ToolPageShellContent = {
  breadcrumbLabel: string;
  breadcrumbs: Array<{
    href?: string;
    label: string;
  }>;
  emptyStates: {
    relatedArticles: {
      description: string;
      eyebrow: string;
      title: string;
    };
    relatedTools: {
      description: string;
      eyebrow: string;
      title: string;
    };
  };
  exampleLabels: {
    after: string;
    before: string;
    note: string;
  };
  localProcessingLabel: string;
  sectionLabels: {
    capabilities: string;
    cautions: string;
    examples: string;
    faq: string;
    history: string;
    idealFor: string;
    relatedArticles: string;
    relatedTools: string;
    steps: string;
    supportedFormats: string;
  };
  tool: Omit<ToolPageContent, "relatedArticles" | "relatedTools"> & {
    relatedArticles: LocalizedToolLinkItem[];
    relatedTools: LocalizedToolLinkItem[];
  };
};

export type ToolDirectoryContent = {
  breadcrumbLabel: string;
  breadcrumbs: Array<{
    href?: string;
    label: string;
  }>;
  description: string;
  eyebrow: string;
  localProcessingLabel: string;
  openToolLabel: string;
  supportedFormatsLabel: string;
  title: string;
  tools: Array<{
    category: string;
    description: string;
    href: string;
    supportedFormats: string[];
    title: string;
  }>;
};

function getToolDictionary(locale: AppLocale) {
  return locale === "ja" ? toolContentJa : toolContentEn;
}

async function getToolPath(locale: AppLocale, slug: ToolSlug) {
  return await getPathname({locale, href: `/tools/${slug}`});
}

async function getToolIndexPath(locale: AppLocale) {
  return await getPathname({locale, href: "/tools"});
}

async function localizeLink(locale: AppLocale, item: ToolLinkItem) {
  return {
    ...item,
    href: await getPathname({locale, href: item.href}),
  };
}

export function isToolSlug(value: string): value is ToolSlug {
  return toolSlugs.includes(value as ToolSlug);
}

export async function getToolMetadata(
  locale: AppLocale,
  slug: ToolSlug,
): Promise<Metadata> {
  const metadataMessages = await getTranslations({
    locale,
    namespace: "Metadata",
  });
  const tool = getToolDictionary(locale)[slug];
  const pathname = await getToolPath(locale, slug);

  return {
    metadataBase: new URL(getSiteUrl()),
    title: tool.metadata.title,
    description: tool.metadata.description,
    keywords: tool.metadata.keywords,
    alternates: {
      canonical: pathname,
      languages: await buildLanguageAlternates((alternateLocale) =>
        getToolPath(alternateLocale, slug),
      ),
    },
    openGraph: {
      type: "website",
      locale: localeMetadata[locale].ogLocale,
      siteName: metadataMessages("siteName"),
      title: tool.metadata.title,
      description: tool.metadata.description,
      url: pathname,
    },
    twitter: {
      card: "summary_large_image",
      title: tool.metadata.title,
      description: tool.metadata.description,
    },
  };
}

export async function getToolIndexMetadata(locale: AppLocale): Promise<Metadata> {
  const metadataMessages = await getTranslations({
    locale,
    namespace: "Metadata",
  });
  const indexMessages = await getTranslations({
    locale,
    namespace: "ToolIndex",
  });
  const pathname = await getToolIndexPath(locale);

  return {
    metadataBase: new URL(getSiteUrl()),
    title: indexMessages("metadataTitle"),
    description: indexMessages("metadataDescription"),
    alternates: {
      canonical: pathname,
      languages: await buildLanguageAlternates(getToolIndexPath),
    },
    openGraph: {
      type: "website",
      locale: localeMetadata[locale].ogLocale,
      siteName: metadataMessages("siteName"),
      title: indexMessages("metadataTitle"),
      description: indexMessages("metadataDescription"),
      url: pathname,
    },
    twitter: {
      card: "summary_large_image",
      title: indexMessages("metadataTitle"),
      description: indexMessages("metadataDescription"),
    },
  };
}

export async function getToolPageContent(
  locale: AppLocale,
  slug: ToolSlug,
): Promise<ToolPageShellContent> {
  const tool = getToolDictionary(locale)[slug];
  const siteChrome = await getSiteChromeContent(locale);
  const template = await getTranslations({
    locale,
    namespace: "ToolTemplate",
  });
  const indexMessages = await getTranslations({
    locale,
    namespace: "ToolIndex",
  });

  const [toolIndexHref, relatedTools, relatedArticles] = await Promise.all([
    getToolIndexPath(locale),
    Promise.all(tool.relatedTools.map((item) => localizeLink(locale, item))),
    Promise.all(tool.relatedArticles.map((item) => localizeLink(locale, item))),
  ]);

  return {
    breadcrumbLabel: siteChrome.breadcrumbs.label,
    breadcrumbs: [
      {
        href: siteChrome.breadcrumbs.homeHref,
        label: siteChrome.breadcrumbs.homeLabel,
      },
      {
        href: toolIndexHref,
        label: indexMessages("title"),
      },
      {
        label: tool.title,
      },
    ],
    emptyStates: {
      relatedArticles: {
        eyebrow: template("emptyStates.relatedArticles.eyebrow"),
        title: template("emptyStates.relatedArticles.title"),
        description: template("emptyStates.relatedArticles.description"),
      },
      relatedTools: {
        eyebrow: template("emptyStates.relatedTools.eyebrow"),
        title: template("emptyStates.relatedTools.title"),
        description: template("emptyStates.relatedTools.description"),
      },
    },
    exampleLabels: {
      before: template("examplesLabels.before"),
      after: template("examplesLabels.after"),
      note: template("examplesLabels.note"),
    },
    localProcessingLabel: siteChrome.header.badge,
    sectionLabels: {
      supportedFormats: template("supportedFormats"),
      capabilities: template("capabilities"),
      idealFor: template("idealFor"),
      steps: template("steps"),
      examples: template("examples"),
      cautions: template("cautions"),
      faq: template("faq"),
      relatedTools: template("relatedTools"),
      relatedArticles: template("relatedArticles"),
      history: template("history"),
    },
    tool: {
      ...tool,
      relatedArticles,
      relatedTools,
    },
  };
}

export async function getToolIndexContent(
  locale: AppLocale,
): Promise<ToolDirectoryContent> {
  const toolDictionary = getToolDictionary(locale);
  const siteChrome = await getSiteChromeContent(locale);
  const indexMessages = await getTranslations({
    locale,
    namespace: "ToolIndex",
  });
  const template = await getTranslations({
    locale,
    namespace: "ToolTemplate",
  });

  const tools = await Promise.all(
    toolSlugs.map(async (slug) => {
      const tool = toolDictionary[slug];

      return {
        category: tool.category,
        description: tool.description,
        href: await getToolPath(locale, slug),
        supportedFormats: tool.supportedFormats,
        title: tool.title,
      };
    }),
  );

  return {
    breadcrumbLabel: siteChrome.breadcrumbs.label,
    breadcrumbs: [
      {
        href: siteChrome.breadcrumbs.homeHref,
        label: siteChrome.breadcrumbs.homeLabel,
      },
      {
        label: indexMessages("title"),
      },
    ],
    description: indexMessages("description"),
    eyebrow: indexMessages("eyebrow"),
    localProcessingLabel: siteChrome.header.badge,
    openToolLabel: indexMessages("openTool"),
    supportedFormatsLabel: template("supportedFormats"),
    title: indexMessages("title"),
    tools,
  };
}

export async function getToolStructuredData(locale: AppLocale, slug: ToolSlug) {
  const metadataMessages = await getTranslations({
    locale,
    namespace: "Metadata",
  });
  const indexMessages = await getTranslations({
    locale,
    namespace: "ToolIndex",
  });
  const siteChrome = await getSiteChromeContent(locale);
  const tool = getToolDictionary(locale)[slug];
  const [toolPath, toolIndexPath] = await Promise.all([
    getToolPath(locale, slug),
    getToolIndexPath(locale),
  ]);
  const siteUrl = getSiteUrl();
  const toolUrl = new URL(toolPath, siteUrl).toString();
  const toolDirectoryUrl = new URL(toolIndexPath, siteUrl).toString();
  const homeUrl = new URL(siteChrome.breadcrumbs.homeHref, siteUrl).toString();

  return [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      description: tool.description,
      inLanguage: localeMetadata[locale].htmlLang,
      isPartOf: {
        "@type": "WebSite",
        name: metadataMessages("siteName"),
        url: getSiteUrl(),
      },
      name: tool.title,
      url: toolUrl,
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      applicationCategory: tool.structuredData.applicationCategory,
      description: tool.description,
      featureList: tool.capabilities,
      inLanguage: localeMetadata[locale].htmlLang,
      name: tool.title,
      operatingSystem: tool.structuredData.operatingSystem,
      url: toolUrl,
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      description: tool.description,
      inLanguage: localeMetadata[locale].htmlLang,
      name: tool.title,
      step: tool.steps.map((item) => ({
        "@type": "HowToStep",
        name: item.title,
        text: item.description,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      inLanguage: localeMetadata[locale].htmlLang,
      mainEntity: tool.faq.map((item) => ({
        "@type": "Question",
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
        name: item.question,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: homeUrl,
          name: siteChrome.breadcrumbs.homeLabel,
        },
        {
          "@type": "ListItem",
          position: 2,
          item: toolDirectoryUrl,
          name: indexMessages("title"),
        },
        {
          "@type": "ListItem",
          position: 3,
          item: toolUrl,
          name: tool.title,
        },
      ],
    },
  ];
}

export async function getToolIndexStructuredData(locale: AppLocale) {
  const metadataMessages = await getTranslations({
    locale,
    namespace: "Metadata",
  });
  const indexMessages = await getTranslations({
    locale,
    namespace: "ToolIndex",
  });
  const siteChrome = await getSiteChromeContent(locale);
  const [toolIndexPath, tools] = await Promise.all([
    getToolIndexPath(locale),
    Promise.all(
      toolSlugs.map(async (slug) => {
        const tool = getToolDictionary(locale)[slug];

        return {
          description: tool.description,
          name: tool.title,
          url: new URL(await getToolPath(locale, slug), getSiteUrl()).toString(),
        };
      }),
    ),
  ]);
  const siteUrl = getSiteUrl();
  const indexUrl = new URL(toolIndexPath, siteUrl).toString();
  const homeUrl = new URL(siteChrome.breadcrumbs.homeHref, siteUrl).toString();

  return [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      description: indexMessages("metadataDescription"),
      hasPart: tools.map((tool) => ({
        "@type": "SoftwareApplication",
        description: tool.description,
        name: tool.name,
        url: tool.url,
      })),
      inLanguage: localeMetadata[locale].htmlLang,
      isPartOf: {
        "@type": "WebSite",
        name: metadataMessages("siteName"),
        url: getSiteUrl(),
      },
      name: indexMessages("title"),
      url: indexUrl,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: homeUrl,
          name: siteChrome.breadcrumbs.homeLabel,
        },
        {
          "@type": "ListItem",
          position: 2,
          item: indexUrl,
          name: indexMessages("title"),
        },
      ],
    },
  ];
}
