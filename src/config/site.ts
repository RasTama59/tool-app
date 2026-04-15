export const appLocales = ["ja", "en"] as const;

export type AppLocale = (typeof appLocales)[number];

export const defaultLocale: AppLocale = "ja";

export const siteConfig = {
  siteName: "Cleanup & Conversion Toolkit",
  shortName: "Cleanup Toolkit",
} as const;

export const localeMetadata: Record<
  AppLocale,
  {
    htmlLang: string;
    ogLocale: string;
  }
> = {
  ja: {
    htmlLang: "ja",
    ogLocale: "ja_JP",
  },
  en: {
    htmlLang: "en",
    ogLocale: "en_US",
  },
};

export function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!configuredUrl) {
    return "https://example.com";
  }

  try {
    return new URL(configuredUrl).origin;
  } catch {
    return "https://example.com";
  }
}
