import {getTranslations} from "next-intl/server";

import type {AppLocale} from "@/config/site";
import {
  faqItems,
  principleItems,
  processItems,
  sectionIds,
  themeItems,
  type ThemeTone,
} from "@/content/home";
import {getPathname} from "@/i18n/navigation";

function toStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

export type HomePageContent = {
  hero: {
    badge: string;
    eyebrow: string;
    title: string;
    description: string;
    chips: string[];
    primaryAction: {
      href: string;
      label: string;
    };
    secondaryAction: {
      href: string;
      label: string;
    };
    panelLabel: string;
    panelTitle: string;
    panelItems: string[];
    footnote: string;
    notice: {
      title: string;
      description: string;
    };
  };
  principles: {
    id: string;
    title: string;
    description: string;
    items: Array<{
      indexLabel: string;
      title: string;
      description: string;
    }>;
  };
  themes: {
    id: string;
    title: string;
    description: string;
    statusLabel?: string;
    items: Array<{
      title: string;
      description: string;
      examples: string[];
      tone: ThemeTone;
    }>;
    emptyState: {
      action: {
        href: string;
        label: string;
      };
      eyebrow: string;
      title: string;
      description: string;
    };
  };
  process: {
    id: string;
    title: string;
    description: string;
    items: Array<{
      stepNumber: string;
      title: string;
      description: string;
    }>;
  };
  faq: {
    id: string;
    title: string;
    description: string;
    items: Array<{
      question: string;
      answer: string;
    }>;
  };
};

export async function getHomePageContent(
  locale: AppLocale,
): Promise<HomePageContent> {
  const common = await getTranslations({locale, namespace: "Common"});
  const home = await getTranslations({locale, namespace: "HomePage"});
  const [toolIndexHref, guideIndexHref] = await Promise.all([
    getPathname({locale, href: "/tools"}),
    getPathname({locale, href: "/guide"}),
  ]);

  return {
    hero: {
      badge: common("badge"),
      eyebrow: home("hero.eyebrow"),
      title: home("hero.title"),
      description: home("hero.description"),
      chips: toStringArray(home.raw("hero.chips")),
      primaryAction: {
        href: toolIndexHref,
        label: home("hero.primaryCta"),
      },
      secondaryAction: {
        href: guideIndexHref,
        label: home("hero.secondaryCta"),
      },
      panelLabel: home("hero.panelLabel"),
      panelTitle: home("hero.panelTitle"),
      panelItems: toStringArray(home.raw("hero.panelItems")),
      footnote: home("hero.footnote"),
      notice: {
        title: home("hero.notice.title"),
        description: home("hero.notice.description"),
      },
    },
    principles: {
      id: sectionIds.principles,
      title: home("principles.title"),
      description: home("principles.description"),
      items: principleItems.map((item) => ({
        indexLabel: item.indexLabel,
        title: home(`principles.items.${item.id}.title`),
        description: home(`principles.items.${item.id}.description`),
      })),
    },
    themes: {
      id: sectionIds.themes,
      title: home("themes.title"),
      description: home("themes.description"),
      statusLabel: home("themes.statusLabel"),
      items: themeItems.map((item) => ({
        title: home(`themes.items.${item.id}.title`),
        description: home(`themes.items.${item.id}.description`),
        examples: toStringArray(home.raw(`themes.items.${item.id}.examples`)),
        tone: item.tone,
      })),
      emptyState: {
        action: {
          href: toolIndexHref,
          label: home("themes.emptyState.action"),
        },
        eyebrow: home("themes.emptyState.eyebrow"),
        title: home("themes.emptyState.title"),
        description: home("themes.emptyState.description"),
      },
    },
    process: {
      id: sectionIds.process,
      title: home("process.title"),
      description: home("process.description"),
      items: processItems.map((item) => ({
        stepNumber: item.stepNumber,
        title: home(`process.items.${item.id}.title`),
        description: home(`process.items.${item.id}.description`),
      })),
    },
    faq: {
      id: sectionIds.faq,
      title: home("faq.title"),
      description: home("faq.description"),
      items: faqItems.map((item) => ({
        question: home(`faq.items.${item.id}.question`),
        answer: home(`faq.items.${item.id}.answer`),
      })),
    },
  };
}
