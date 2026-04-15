import type {Metadata} from "next";
import {hasLocale} from "next-intl";
import {setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";

import {StructuredData} from "@/components/common/structured-data";
import {GuideIndexShell} from "@/components/guides/guide-index-shell";
import {routing} from "@/i18n/routing";
import {
  getGuideIndexContent,
  getGuideIndexMetadata,
  getGuideIndexStructuredData,
} from "@/lib/guides";

type Props = {
  params: Promise<{locale: string}>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale: requestedLocale} = await params;
  const locale = hasLocale(routing.locales, requestedLocale)
    ? requestedLocale
    : routing.defaultLocale;

  return getGuideIndexMetadata(locale);
}

export default async function GuideIndexPage({params}: Props) {
  const {locale} = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const [page, structuredData] = await Promise.all([
    getGuideIndexContent(locale),
    getGuideIndexStructuredData(locale),
  ]);

  return (
    <>
      <StructuredData data={structuredData} />
      <GuideIndexShell {...page} />
    </>
  );
}
