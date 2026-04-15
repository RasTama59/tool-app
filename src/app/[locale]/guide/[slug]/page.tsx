import type {Metadata} from "next";
import {hasLocale} from "next-intl";
import {setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";

import {StructuredData} from "@/components/common/structured-data";
import {GuideArticleShell} from "@/components/guides/guide-article-shell";
import {guideSlugs} from "@/content/guides/guide-slugs";
import {routing} from "@/i18n/routing";
import {
  getGuideArticleContent,
  getGuideMetadata,
  getGuideStructuredData,
  isGuideSlug,
} from "@/lib/guides";

type Props = {
  params: Promise<{locale: string; slug: string}>;
};

export function generateStaticParams() {
  return guideSlugs.map((slug) => ({slug}));
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale: requestedLocale, slug} = await params;

  if (!hasLocale(routing.locales, requestedLocale) || !isGuideSlug(slug)) {
    return {};
  }

  return getGuideMetadata(requestedLocale, slug);
}

export default async function GuideArticlePage({params}: Props) {
  const {locale, slug} = await params;

  if (!hasLocale(routing.locales, locale) || !isGuideSlug(slug)) {
    notFound();
  }

  setRequestLocale(locale);

  const [page, structuredData] = await Promise.all([
    getGuideArticleContent(locale, slug),
    getGuideStructuredData(locale, slug),
  ]);

  return (
    <>
      <StructuredData data={structuredData} />
      <GuideArticleShell {...page} />
    </>
  );
}
