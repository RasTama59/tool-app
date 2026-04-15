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

function normalizeSiteOrigin(value: string) {
  try {
    const normalized = /^https?:\/\//i.test(value) ? value : `https://${value}`;

    return new URL(normalized).origin;
  } catch {
    return undefined;
  }
}

export function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  const vercelDeploymentUrl = process.env.VERCEL_URL?.trim();

  return (
    normalizeSiteOrigin(configuredUrl ?? "") ??
    normalizeSiteOrigin(vercelProductionUrl ?? "") ??
    normalizeSiteOrigin(vercelDeploymentUrl ?? "") ??
    "https://example.com"
  );
}
