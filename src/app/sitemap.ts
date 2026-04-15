import type {MetadataRoute} from "next";

import {appLocales, getSiteUrl} from "@/config/site";
import {guideSlugs} from "@/content/guides/guide-slugs";
import {publicFixedPageSlugs} from "@/content/site-chrome";
import {toolSlugs} from "@/content/tools/tool-types";
import {getPathname} from "@/i18n/navigation";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const lastModified = new Date();
  const pageHrefs = [
    "/",
    "/tools",
    ...publicFixedPageSlugs.map((slug) => `/${slug}`),
    ...toolSlugs.map((slug) => `/tools/${slug}`),
    ...guideSlugs.map((slug) => `/guide/${slug}`),
  ] as const;

  const sitemapEntries = await Promise.all(
    pageHrefs.map(async (href) => {
      const alternates = Object.fromEntries(
        await Promise.all(
          appLocales.map(async (locale) => [
            locale,
            siteUrl + (await getPathname({locale, href})),
          ]),
        ),
      );

      return Promise.all(
        appLocales.map(async (locale) => ({
          url: siteUrl + (await getPathname({locale, href})),
          lastModified,
          alternates: {
            languages: alternates,
          },
        })),
      );
    }),
  );

  return sitemapEntries.flat();
}
