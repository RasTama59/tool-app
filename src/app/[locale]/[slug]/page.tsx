import type {Metadata} from "next";
import {hasLocale} from "next-intl";
import {setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";

import {StructuredData} from "@/components/common/structured-data";
import {StaticPageShell} from "@/components/common/static-page-shell";
import {routing} from "@/i18n/routing";
import {
  getFixedPageContent,
  getFixedPageMetadata,
  getFixedPageStructuredData,
} from "@/lib/fixed-pages";
import {isPublicFixedPageSlug, publicFixedPageSlugs} from "@/content/site-chrome";

type Props = {
  params: Promise<{locale: string; slug: string}>;
};

export function generateStaticParams() {
  return publicFixedPageSlugs
    .filter((slug) => slug !== "guide")
    .map((slug) => ({slug}));
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale: requestedLocale, slug} = await params;

  if (
    !hasLocale(routing.locales, requestedLocale) ||
    !isPublicFixedPageSlug(slug)
  ) {
    return {};
  }

  return getFixedPageMetadata(requestedLocale, slug);
}

export default async function FixedPage({params}: Props) {
  const {locale, slug} = await params;

  if (
    !hasLocale(routing.locales, locale) ||
    !isPublicFixedPageSlug(slug)
  ) {
    notFound();
  }

  setRequestLocale(locale);

  const [page, structuredData] = await Promise.all([
    getFixedPageContent(locale, slug),
    getFixedPageStructuredData(locale, slug),
  ]);

  return (
    <>
      <StructuredData data={structuredData} />
      <StaticPageShell {...page} />
    </>
  );
}
