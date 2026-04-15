import type {ReactNode} from "react";
import type {Metadata, Viewport} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import {NextIntlClientProvider, hasLocale} from "next-intl";
import {setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";

import {SiteIntegrations} from "@/components/common/site-integrations";
import {SiteFooter} from "@/components/layout/site-footer";
import {SiteHeader} from "@/components/layout/site-header";
import {localeMetadata} from "@/config/site";
import {
  getAdSenseClientId,
  getGoogleSiteVerification,
} from "@/config/site-integrations";
import {routing} from "@/i18n/routing";
import {getSiteChromeContent} from "@/lib/site-chrome";

import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type Props = {
  children: ReactNode;
  params: Promise<{locale: string}>;
};

const googleSiteVerification = getGoogleSiteVerification();
const adSenseClientId = getAdSenseClientId();

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export const metadata: Metadata = {
  other: adSenseClientId
    ? {
        "google-adsense-account": adSenseClientId,
      }
    : undefined,
  verification: googleSiteVerification
    ? {
        google: googleSiteVerification,
      }
    : undefined,
};

export const viewport: Viewport = {
  themeColor: "#f4f8fc",
};

export default async function LocaleLayout({children, params}: Props) {
  const {locale} = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const siteChrome = await getSiteChromeContent(locale);

  return (
    <html
      className={`${geistSans.variable} ${geistMono.variable}`}
      lang={localeMetadata[locale].htmlLang}
    >
      <body className="min-h-screen text-foreground">
        <SiteIntegrations />
        <a
          className="sr-only absolute left-4 top-4 z-50 rounded-full bg-[#215da8] px-4 py-2 text-sm font-semibold text-white focus:not-sr-only"
          href="#main-content"
        >
          {siteChrome.skipToContent}
        </a>
        <NextIntlClientProvider>
          <div className="flex min-h-screen flex-col">
            <SiteHeader {...siteChrome.header} />
            <div className="flex-1">{children}</div>
            <SiteFooter {...siteChrome.footer} badge={siteChrome.header.badge} />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
