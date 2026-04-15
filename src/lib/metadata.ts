import type {Metadata} from "next";
import {getTranslations} from "next-intl/server";

import {getSiteUrl, localeMetadata} from "@/config/site";
import type {AppLocale} from "@/config/site";
import {faqItems, themeItems} from "@/content/home";
import {getPathname} from "@/i18n/navigation";
import {buildLanguageAlternates} from "@/lib/seo";

function toStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

async function getLocalizedPath(locale: AppLocale) {
  return await getPathname({locale, href: "/"});
}

export async function getHomeMetadata(locale: AppLocale): Promise<Metadata> {
  const metadataMessages = await getTranslations({
    locale,
    namespace: "Metadata",
  });
  const pathname = await getLocalizedPath(locale);

  return {
    metadataBase: new URL(getSiteUrl()),
    title: metadataMessages("title"),
    description: metadataMessages("description"),
    keywords: toStringArray(metadataMessages.raw("keywords")),
    alternates: {
      canonical: pathname,
      languages: await buildLanguageAlternates(getLocalizedPath),
    },
    openGraph: {
      type: "website",
      locale: localeMetadata[locale].ogLocale,
      siteName: metadataMessages("siteName"),
      title: metadataMessages("title"),
      description: metadataMessages("description"),
      url: pathname,
    },
    twitter: {
      card: "summary_large_image",
      title: metadataMessages("title"),
      description: metadataMessages("description"),
    },
  };
}

export async function getHomeStructuredData(locale: AppLocale) {
  const metadataMessages = await getTranslations({
    locale,
    namespace: "Metadata",
  });
  const homeMessages = await getTranslations({
    locale,
    namespace: "HomePage",
  });
  const localizedPath = await getLocalizedPath(locale);
  const localizedUrl = new URL(localizedPath, getSiteUrl()).toString();

  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      description: metadataMessages("description"),
      inLanguage: localeMetadata[locale].htmlLang,
      name: metadataMessages("siteName"),
      url: localizedUrl,
    },
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      about: themeItems.map((item) => ({
        "@type": "Thing",
        description: homeMessages(`themes.items.${item.id}.description`),
        name: homeMessages(`themes.items.${item.id}.title`),
      })),
      description: homeMessages("structuredData.pageDescription"),
      inLanguage: localeMetadata[locale].htmlLang,
      isPartOf: {
        "@type": "WebSite",
        name: metadataMessages("siteName"),
        url: getSiteUrl(),
      },
      name: homeMessages("structuredData.pageName"),
      url: localizedUrl,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      inLanguage: localeMetadata[locale].htmlLang,
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        acceptedAnswer: {
          "@type": "Answer",
          text: homeMessages(`faq.items.${item.id}.answer`),
        },
        name: homeMessages(`faq.items.${item.id}.question`),
      })),
    },
  ];
}
