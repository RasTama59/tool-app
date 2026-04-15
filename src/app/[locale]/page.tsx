import type {Metadata} from "next";
import {hasLocale} from "next-intl";
import {setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";

import {StructuredData} from "@/components/common/structured-data";
import {FaqSection} from "@/components/home/faq-section";
import {HomeHero} from "@/components/home/home-hero";
import {PrinciplesSection} from "@/components/home/principles-section";
import {ProcessSection} from "@/components/home/process-section";
import {ThemeGrid} from "@/components/home/theme-grid";
import {routing} from "@/i18n/routing";
import {getHomePageContent} from "@/lib/home-content";
import {getHomeMetadata, getHomeStructuredData} from "@/lib/metadata";

type Props = {
  params: Promise<{locale: string}>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale: requestedLocale} = await params;
  const locale = hasLocale(routing.locales, requestedLocale)
    ? requestedLocale
    : routing.defaultLocale;

  return getHomeMetadata(locale);
}

export default async function LocaleHomePage({params}: Props) {
  const {locale} = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const content = await getHomePageContent(locale);
  const structuredData = await getHomeStructuredData(locale);

  return (
    <>
      <StructuredData data={structuredData} />
      <main className="relative" id="main-content">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[460px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.56),transparent_58%)]" />
        <HomeHero {...content.hero} />
        <ThemeGrid {...content.themes} />
        <PrinciplesSection {...content.principles} />
        <ProcessSection {...content.process} />
        <FaqSection {...content.faq} />
      </main>
    </>
  );
}
