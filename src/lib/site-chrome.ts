import {getTranslations} from "next-intl/server";

import type {AppLocale} from "@/config/site";
import {appLocales} from "@/config/site";
import {publicFixedPageSlugs, categorySectionIds} from "@/content/site-chrome";
import {getPathname} from "@/i18n/navigation";

function toLocaleLabelMap(value: unknown) {
  if (!value || typeof value !== "object") {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value).filter(
      (entry): entry is [string, string] => typeof entry[1] === "string",
    ),
  );
}

export type SiteChromeContent = {
  breadcrumbs: {
    label: string;
    homeHref: string;
    homeLabel: string;
  };
  footer: {
    categoriesTitle: string;
    categoryLinks: Array<{
      href: string;
      label: string;
    }>;
    copyright: string;
    description: string;
    pageLinks: Array<{
      href: string;
      label: string;
    }>;
    pagesTitle: string;
    title: string;
  };
  header: {
    badge: string;
    brand: string;
    navItems: Array<{
      href: string;
      label: string;
    }>;
    navigationLabel: string;
    openMenuLabel: string;
    closeMenuLabel: string;
    pageLinks: Array<{
      href: string;
      label: string;
    }>;
    pagesTitle: string;
    localeSwitcher: {
      label: string;
      options: Array<{
        value: AppLocale;
        label: string;
      }>;
    };
  };
  skipToContent: string;
};

export async function getSiteChromeContent(
  locale: AppLocale,
): Promise<SiteChromeContent> {
  const common = await getTranslations({locale, namespace: "Common"});
  const chrome = await getTranslations({locale, namespace: "SiteChrome"});
  const toolIndex = await getTranslations({locale, namespace: "ToolIndex"});
  const guideIndex = await getTranslations({locale, namespace: "GuideIndex"});
  const localeLabels = toLocaleLabelMap(common.raw("locales"));
  const homeHref = await getPathname({locale, href: "/"});
  const toolIndexHref = await getPathname({locale, href: "/tools"});
  const guideIndexHref = await getPathname({locale, href: "/guide"});

  const categoryLinks = categorySectionIds.map((id) => ({
    href: `${homeHref}#${id}`,
    label: chrome(`categoryLinks.${id}`),
  }));
  const directoryLinks = [
    {
      href: toolIndexHref,
      label: toolIndex("title"),
    },
    {
      href: guideIndexHref,
      label: guideIndex("title"),
    },
  ];

  const pageLinks = await Promise.all(
    publicFixedPageSlugs.map(async (slug) => ({
      href: await getPathname({locale, href: `/${slug}`}),
      label: chrome(`pageLinks.${slug}`),
    })),
  );
  const pageAndDirectoryLinks = [
    ...directoryLinks.filter((item) => item.href !== guideIndexHref),
    ...pageLinks,
  ];

  return {
    breadcrumbs: {
      label: chrome("breadcrumbsLabel"),
      homeHref,
      homeLabel: chrome("homeLabel"),
    },
    footer: {
      categoriesTitle: chrome("footer.categoriesTitle"),
      categoryLinks,
      copyright: `${new Date().getFullYear()} ${common("brand")} | ${chrome("footer.copyright")}`,
      description: chrome("footer.description"),
      pageLinks: pageAndDirectoryLinks,
      pagesTitle: chrome("footer.pagesTitle"),
      title: chrome("footer.title"),
    },
    header: {
      badge: common("badge"),
      brand: common("brand"),
      navItems: [...directoryLinks, ...categoryLinks],
      navigationLabel: chrome("navigationLabel"),
      openMenuLabel: chrome("openMenuLabel"),
      closeMenuLabel: chrome("closeMenuLabel"),
      pageLinks: pageAndDirectoryLinks,
      pagesTitle: chrome("pagesTitle"),
      localeSwitcher: {
        label: common("localeSwitcherLabel"),
        options: appLocales.map((value) => ({
          value,
          label: localeLabels[value] ?? value.toUpperCase(),
        })),
      },
    },
    skipToContent: common("skipToContent"),
  };
}
