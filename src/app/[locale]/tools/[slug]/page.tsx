import type {Metadata} from "next";
import {hasLocale} from "next-intl";
import {setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";

import {StructuredData} from "@/components/common/structured-data";
import {ToolPageShell} from "@/components/tools/tool-page-shell";
import {toolSlugs} from "@/content/tools/tool-types";
import {routing} from "@/i18n/routing";
import {
  getToolMetadata,
  getToolPageContent,
  getToolStructuredData,
  isToolSlug,
} from "@/lib/tools";

type Props = {
  params: Promise<{locale: string; slug: string}>;
};

export function generateStaticParams() {
  return toolSlugs.map((slug) => ({slug}));
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale: requestedLocale, slug} = await params;

  if (!hasLocale(routing.locales, requestedLocale) || !isToolSlug(slug)) {
    return {};
  }

  return getToolMetadata(requestedLocale, slug);
}

export default async function ToolPage({params}: Props) {
  const {locale, slug} = await params;

  if (!hasLocale(routing.locales, locale) || !isToolSlug(slug)) {
    notFound();
  }

  setRequestLocale(locale);

  const [page, structuredData] = await Promise.all([
    getToolPageContent(locale, slug),
    getToolStructuredData(locale, slug),
  ]);

  return (
    <>
      <StructuredData data={structuredData} />
      <ToolPageShell {...page} />
    </>
  );
}
