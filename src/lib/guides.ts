import type {Metadata} from "next";
import {getTranslations} from "next-intl/server";

import {
  getSiteUrl,
  localeMetadata,
  type AppLocale,
} from "@/config/site";
import {guideContentEn} from "@/content/guides/guide-content-en";
import {guideContentJa} from "@/content/guides/guide-content-ja";
import {guideSlugs, type GuideSlug} from "@/content/guides/guide-slugs";
import type {GuideArticleContent} from "@/content/guides/guide-types";
import {toolContentEn} from "@/content/tools/tool-content-en";
import {toolContentJa} from "@/content/tools/tool-content-ja";
import type {ToolSlug} from "@/content/tools/tool-types";
import {getPathname} from "@/i18n/navigation";
import {buildLanguageAlternates} from "@/lib/seo";
import {getSiteChromeContent} from "@/lib/site-chrome";

type LocalizedLinkItem = {
  description: string;
  href: string;
  label: string;
};

export type GuideDirectoryContent = {
  articles: Array<{
    category: string;
    description: string;
    href: string;
    relatedTool?: {
      href: string;
      label: string;
    };
    title: string;
    updatedAt: string;
    readTime: string;
  }>;
  breadcrumbLabel: string;
  breadcrumbs: Array<{
    href?: string;
    label: string;
  }>;
  description: string;
  eyebrow: string;
  localProcessingLabel: string;
  openArticleLabel: string;
  relatedToolLabel: string;
  title: string;
  updatedLabel: string;
};

export type GuideArticlePageContent = {
  article: Omit<
    GuideArticleContent,
    "publishedAt" | "readTimeMinutes" | "relatedGuideSlugs" | "relatedToolSlugs" | "updatedAt"
  > & {
    primaryTool?: LocalizedLinkItem;
    publishedAt: string;
    readTime: string;
    relatedArticles: LocalizedLinkItem[];
    relatedTools: LocalizedLinkItem[];
    updatedAt: string;
  };
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
  labels: {
    faq: string;
    intro: string;
    openTool: string;
    published: string;
    readTime: string;
    relatedArticles: string;
    relatedTools: string;
    steps: string;
    summary: string;
    updated: string;
  };
  localProcessingLabel: string;
};

function getGuideDictionary(locale: AppLocale) {
  return locale === "ja" ? guideContentJa : guideContentEn;
}

function getToolDictionary(locale: AppLocale) {
  return locale === "ja" ? toolContentJa : toolContentEn;
}

function getDateParts(value: string) {
  const [year, month, day] = value.split("-").map((part) => Number(part));

  return {
    year,
    month,
    day,
  };
}

function formatDisplayDate(locale: AppLocale, value: string) {
  const {year, month, day} = getDateParts(value);

  return new Intl.DateTimeFormat(localeMetadata[locale].htmlLang, {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
    year: "numeric",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

async function getGuideIndexPath(locale: AppLocale) {
  return await getPathname({locale, href: "/guide"});
}

async function getGuidePath(locale: AppLocale, slug: GuideSlug) {
  return await getPathname({locale, href: `/guide/${slug}`});
}

async function getToolPath(locale: AppLocale, slug: ToolSlug) {
  return await getPathname({locale, href: `/tools/${slug}`});
}

async function localizeToolLink(locale: AppLocale, slug: ToolSlug): Promise<LocalizedLinkItem> {
  const tool = getToolDictionary(locale)[slug];

  return {
    description: tool.description,
    href: await getToolPath(locale, slug),
    label: tool.title,
  };
}

async function localizeGuideLink(
  locale: AppLocale,
  slug: GuideSlug,
): Promise<LocalizedLinkItem> {
  const guide = getGuideDictionary(locale)[slug];

  return {
    description: guide.description,
    href: await getGuidePath(locale, slug),
    label: guide.title,
  };
}

export function isGuideSlug(value: string): value is GuideSlug {
  return guideSlugs.includes(value as GuideSlug);
}

export async function getGuideIndexMetadata(locale: AppLocale): Promise<Metadata> {
  const metadataMessages = await getTranslations({
    locale,
    namespace: "Metadata",
  });
  const guideMessages = await getTranslations({
    locale,
    namespace: "GuideIndex",
  });
  const pathname = await getGuideIndexPath(locale);

  return {
    metadataBase: new URL(getSiteUrl()),
    title: guideMessages("metadataTitle"),
    description: guideMessages("metadataDescription"),
    keywords: guideSlugs.map((slug) => getGuideDictionary(locale)[slug].title),
    alternates: {
      canonical: pathname,
      languages: await buildLanguageAlternates(getGuideIndexPath),
    },
    openGraph: {
      type: "website",
      locale: localeMetadata[locale].ogLocale,
      siteName: metadataMessages("siteName"),
      title: guideMessages("metadataTitle"),
      description: guideMessages("metadataDescription"),
      url: pathname,
    },
    twitter: {
      card: "summary_large_image",
      title: guideMessages("metadataTitle"),
      description: guideMessages("metadataDescription"),
    },
  };
}

export async function getGuideMetadata(
  locale: AppLocale,
  slug: GuideSlug,
): Promise<Metadata> {
  const metadataMessages = await getTranslations({
    locale,
    namespace: "Metadata",
  });
  const guide = getGuideDictionary(locale)[slug];
  const pathname = await getGuidePath(locale, slug);

  return {
    metadataBase: new URL(getSiteUrl()),
    title: guide.metadata.title,
    description: guide.metadata.description,
    keywords: guide.metadata.keywords,
    alternates: {
      canonical: pathname,
      languages: await buildLanguageAlternates((alternateLocale) =>
        getGuidePath(alternateLocale, slug),
      ),
    },
    openGraph: {
      type: "article",
      locale: localeMetadata[locale].ogLocale,
      siteName: metadataMessages("siteName"),
      title: guide.metadata.title,
      description: guide.metadata.description,
      url: pathname,
    },
    twitter: {
      card: "summary_large_image",
      title: guide.metadata.title,
      description: guide.metadata.description,
    },
  };
}

export async function getGuideIndexContent(
  locale: AppLocale,
): Promise<GuideDirectoryContent> {
  const siteChrome = await getSiteChromeContent(locale);
  const guideMessages = await getTranslations({
    locale,
    namespace: "GuideIndex",
  });
  const guideDictionary = getGuideDictionary(locale);

  const articles = await Promise.all(
    guideSlugs.map(async (slug) => {
      const guide = guideDictionary[slug];
      const primaryToolSlug = guide.relatedToolSlugs[0];
      const primaryTool = primaryToolSlug
        ? await localizeToolLink(locale, primaryToolSlug)
        : undefined;

      return {
        category: guide.category,
        description: guide.description,
        href: await getGuidePath(locale, slug),
        relatedTool: primaryTool
          ? {
              href: primaryTool.href,
              label: primaryTool.label,
            }
          : undefined,
        title: guide.title,
        updatedAt: formatDisplayDate(locale, guide.updatedAt),
        readTime: guideMessages("readTime", {minutes: guide.readTimeMinutes}),
      };
    }),
  );

  return {
    articles,
    breadcrumbLabel: siteChrome.breadcrumbs.label,
    breadcrumbs: [
      {
        href: siteChrome.breadcrumbs.homeHref,
        label: siteChrome.breadcrumbs.homeLabel,
      },
      {
        label: guideMessages("title"),
      },
    ],
    description: guideMessages("description"),
    eyebrow: guideMessages("eyebrow"),
    localProcessingLabel: siteChrome.header.badge,
    openArticleLabel: guideMessages("openArticleLabel"),
    relatedToolLabel: guideMessages("relatedToolLabel"),
    title: guideMessages("title"),
    updatedLabel: guideMessages("updatedLabel"),
  };
}

export async function getGuideArticleContent(
  locale: AppLocale,
  slug: GuideSlug,
): Promise<GuideArticlePageContent> {
  const siteChrome = await getSiteChromeContent(locale);
  const guideIndexMessages = await getTranslations({
    locale,
    namespace: "GuideIndex",
  });
  const template = await getTranslations({
    locale,
    namespace: "GuideArticleTemplate",
  });
  const guide = getGuideDictionary(locale)[slug];
  const guideIndexPath = await getGuideIndexPath(locale);
  const relatedArticles = await Promise.all(
    guide.relatedGuideSlugs.map((guideSlug) => localizeGuideLink(locale, guideSlug)),
  );
  const relatedTools = await Promise.all(
    guide.relatedToolSlugs.map((toolSlug) => localizeToolLink(locale, toolSlug)),
  );

  return {
    article: {
      ...guide,
      primaryTool: relatedTools[0],
      publishedAt: formatDisplayDate(locale, guide.publishedAt),
      readTime: guideIndexMessages("readTime", {minutes: guide.readTimeMinutes}),
      relatedArticles,
      relatedTools,
      updatedAt: formatDisplayDate(locale, guide.updatedAt),
    },
    breadcrumbLabel: siteChrome.breadcrumbs.label,
    breadcrumbs: [
      {
        href: siteChrome.breadcrumbs.homeHref,
        label: siteChrome.breadcrumbs.homeLabel,
      },
      {
        href: guideIndexPath,
        label: guideIndexMessages("title"),
      },
      {
        label: guide.title,
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
    labels: {
      faq: template("faq"),
      intro: template("intro"),
      openTool: template("openTool"),
      published: template("published"),
      readTime: template("readTime"),
      relatedArticles: template("relatedArticles"),
      relatedTools: template("relatedTools"),
      steps: template("steps"),
      summary: template("summary"),
      updated: template("updated"),
    },
    localProcessingLabel: siteChrome.header.badge,
  };
}

export async function getGuideIndexStructuredData(locale: AppLocale) {
  const metadataMessages = await getTranslations({
    locale,
    namespace: "Metadata",
  });
  const guideMessages = await getTranslations({
    locale,
    namespace: "GuideIndex",
  });
  const siteChrome = await getSiteChromeContent(locale);
  const indexPath = await getGuideIndexPath(locale);
  const siteUrl = getSiteUrl();
  const indexUrl = new URL(indexPath, siteUrl).toString();
  const homeUrl = new URL(siteChrome.breadcrumbs.homeHref, siteUrl).toString();
  const guides = await Promise.all(
    guideSlugs.map(async (slug) => {
      const guide = getGuideDictionary(locale)[slug];

      return {
        "@type": "Article",
        articleSection: guide.category,
        description: guide.description,
        headline: guide.title,
        url: new URL(await getGuidePath(locale, slug), siteUrl).toString(),
      };
    }),
  );

  return [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      description: guideMessages("metadataDescription"),
      hasPart: guides,
      inLanguage: localeMetadata[locale].htmlLang,
      isPartOf: {
        "@type": "WebSite",
        name: metadataMessages("siteName"),
        url: getSiteUrl(),
      },
      name: guideMessages("title"),
      url: indexUrl,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          item: homeUrl,
          name: siteChrome.breadcrumbs.homeLabel,
          position: 1,
        },
        {
          "@type": "ListItem",
          item: indexUrl,
          name: guideMessages("title"),
          position: 2,
        },
      ],
    },
  ];
}

export async function getGuideStructuredData(locale: AppLocale, slug: GuideSlug) {
  const metadataMessages = await getTranslations({
    locale,
    namespace: "Metadata",
  });
  const guideMessages = await getTranslations({
    locale,
    namespace: "GuideIndex",
  });
  const siteChrome = await getSiteChromeContent(locale);
  const guide = getGuideDictionary(locale)[slug];
  const [guidePath, guideIndexPath] = await Promise.all([
    getGuidePath(locale, slug),
    getGuideIndexPath(locale),
  ]);
  const siteUrl = getSiteUrl();
  const guideUrl = new URL(guidePath, siteUrl).toString();
  const guideDirectoryUrl = new URL(guideIndexPath, siteUrl).toString();
  const homeUrl = new URL(siteChrome.breadcrumbs.homeHref, siteUrl).toString();

  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      articleSection: guide.category,
      dateModified: guide.updatedAt,
      datePublished: guide.publishedAt,
      description: guide.description,
      headline: guide.title,
      inLanguage: localeMetadata[locale].htmlLang,
      isPartOf: {
        "@type": "WebSite",
        name: metadataMessages("siteName"),
        url: getSiteUrl(),
      },
      keywords: guide.metadata.keywords,
      mainEntityOfPage: guideUrl,
      url: guideUrl,
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      description: guide.description,
      inLanguage: localeMetadata[locale].htmlLang,
      name: guide.title,
      step: guide.steps.map((step) => ({
        "@type": "HowToStep",
        name: step.title,
        text: step.description,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      inLanguage: localeMetadata[locale].htmlLang,
      mainEntity: guide.faq.map((item) => ({
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
          item: homeUrl,
          name: siteChrome.breadcrumbs.homeLabel,
          position: 1,
        },
        {
          "@type": "ListItem",
          item: guideDirectoryUrl,
          name: guideMessages("title"),
          position: 2,
        },
        {
          "@type": "ListItem",
          item: guideUrl,
          name: guide.title,
          position: 3,
        },
      ],
    },
  ];
}
