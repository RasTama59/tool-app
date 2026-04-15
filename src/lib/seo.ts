import {appLocales, defaultLocale, type AppLocale} from "@/config/site";

export async function buildLanguageAlternates(
  getLocalizedPath: (locale: AppLocale) => Promise<string>,
) {
  const entries = await Promise.all(
    appLocales.map(async (locale) => [locale, await getLocalizedPath(locale)] as const),
  );

  return {
    ...Object.fromEntries(entries),
    "x-default": await getLocalizedPath(defaultLocale),
  };
}
