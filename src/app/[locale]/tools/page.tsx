import type {Metadata} from "next";
import {hasLocale} from "next-intl";
import {setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";

import {StructuredData} from "@/components/common/structured-data";
import {ToolDirectoryShell} from "@/components/tools/tool-directory-shell";
import {routing} from "@/i18n/routing";
import {
  getToolIndexContent,
  getToolIndexMetadata,
  getToolIndexStructuredData,
} from "@/lib/tools";

type Props = {
  params: Promise<{locale: string}>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale: requestedLocale} = await params;
  const locale = hasLocale(routing.locales, requestedLocale)
    ? requestedLocale
    : routing.defaultLocale;

  return getToolIndexMetadata(locale);
}

export default async function ToolIndexPage({params}: Props) {
  const {locale} = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const [page, structuredData] = await Promise.all([
    getToolIndexContent(locale),
    getToolIndexStructuredData(locale),
  ]);

  return (
    <>
      <StructuredData data={structuredData} />
      <ToolDirectoryShell {...page} />
    </>
  );
}
