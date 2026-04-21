import type {Metadata} from "next";
import {getTranslations} from "next-intl/server";

import {getContactProfile} from "@/config/contact";
import {getSiteUrl, localeMetadata, type AppLocale} from "@/config/site";
import {fixedPageContentEn} from "@/content/fixed-page-content-en";
import {fixedPageContentJa} from "@/content/fixed-page-content-ja";
import {fixedPageSpecs} from "@/content/fixed-pages";
import type {FixedPageSlug} from "@/content/site-chrome";
import {getPathname} from "@/i18n/navigation";
import {buildLanguageAlternates} from "@/lib/seo";
import {getOpenGraphImages, getTwitterImages} from "@/lib/share-image";
import {getSiteChromeContent} from "@/lib/site-chrome";

type PagePanel = {
  title: string;
  items: Array<{
    href?: string;
    label: string;
    value: string;
  }>;
};

function getFixedPageDictionary(locale: AppLocale) {
  return locale === "ja" ? fixedPageContentJa : fixedPageContentEn;
}

async function getFixedPagePath(locale: AppLocale, slug: FixedPageSlug) {
  return await getPathname({locale, href: `/${slug}`});
}

export async function getFixedPageMetadata(
  locale: AppLocale,
  slug: FixedPageSlug,
): Promise<Metadata> {
  const metadataMessages = await getTranslations({
    locale,
    namespace: "Metadata",
  });
  const entry = getFixedPageDictionary(locale)[slug];
  const pathname = await getFixedPagePath(locale, slug);

  return {
    metadataBase: new URL(getSiteUrl()),
    title: entry.metadata.title,
    description: entry.metadata.description,
    alternates: {
      canonical: pathname,
      languages: await buildLanguageAlternates((alternateLocale) =>
        getFixedPagePath(alternateLocale, slug),
      ),
    },
    openGraph: {
      type: "website",
      locale: localeMetadata[locale].ogLocale,
      siteName: metadataMessages("siteName"),
      title: entry.metadata.title,
      description: entry.metadata.description,
      url: pathname,
      images: getOpenGraphImages(locale),
    },
    twitter: {
      card: "summary_large_image",
      title: entry.metadata.title,
      description: entry.metadata.description,
      images: getTwitterImages(locale),
    },
  };
}

function getPagePanels(locale: AppLocale, slug: FixedPageSlug): PagePanel[] | undefined {
  const entry = getFixedPageDictionary(locale)[slug];

  if (!entry.panel || slug !== "contact") {
    return undefined;
  }

  const contact = getContactProfile(locale);

  return [
    {
      title: entry.panel.title,
      items: [
        {
          href: contact.contactUrl,
          label: entry.panel.items.emailLabel,
          value: contact.contactLabel,
        },
        {
          label: entry.panel.items.responseLabel,
          value: contact.responseTime,
        },
        {
          label: entry.panel.items.hoursLabel,
          value: contact.supportHours,
        },
      ],
    },
  ];
}

export async function getFixedPageContent(locale: AppLocale, slug: FixedPageSlug) {
  const entry = getFixedPageDictionary(locale)[slug];
  const siteChrome = await getSiteChromeContent(locale);
  const spec = fixedPageSpecs[slug];

  return {
    breadcrumbLabel: siteChrome.breadcrumbs.label,
    currentLabel: entry.title,
    description: entry.description,
    homeHref: siteChrome.breadcrumbs.homeHref,
    homeLabel: siteChrome.breadcrumbs.homeLabel,
    notice: entry.notice,
    panels: getPagePanels(locale, slug),
    sections: spec.sectionIds.map((section) => ({
      title: entry.sections[section.id].title,
      body: entry.sections[section.id].body,
      subsections: section.subsectionIds.map((subsectionId) => ({
        title: entry.sections[section.id].subsections[subsectionId].title,
        body: entry.sections[section.id].subsections[subsectionId].body,
      })),
    })),
    title: entry.title,
  };
}

export async function getFixedPageStructuredData(locale: AppLocale, slug: FixedPageSlug) {
  const metadataMessages = await getTranslations({
    locale,
    namespace: "Metadata",
  });
  const siteChrome = await getSiteChromeContent(locale);
  const entry = getFixedPageDictionary(locale)[slug];
  const pagePath = await getFixedPagePath(locale, slug);
  const siteUrl = getSiteUrl();
  const pageUrl = new URL(pagePath, siteUrl).toString();
  const homeUrl = new URL(siteChrome.breadcrumbs.homeHref, siteUrl).toString();

  return [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      description: entry.metadata.description,
      inLanguage: localeMetadata[locale].htmlLang,
      isPartOf: {
        "@type": "WebSite",
        name: metadataMessages("siteName"),
        url: getSiteUrl(),
      },
      name: entry.title,
      url: pageUrl,
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
          item: pageUrl,
          name: entry.title,
          position: 2,
        },
      ],
    },
  ];
}
