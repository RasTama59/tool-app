import type {ToolFaqItem, ToolStep, ToolSlug} from "@/content/tools/tool-types";

import type {GuideSlug} from "./guide-slugs";

export type GuideSectionContent = {
  body: string[];
  list?: string[];
  subsections?: Array<{
    body: string[];
    list?: string[];
    title: string;
  }>;
  title: string;
};

export type GuideArticleContent = {
  category: string;
  description: string;
  faq: ToolFaqItem[];
  intro: string[];
  metadata: {
    description: string;
    keywords: string[];
    title: string;
  };
  publishedAt: string;
  readTimeMinutes: number;
  relatedGuideSlugs: GuideSlug[];
  relatedToolSlugs: ToolSlug[];
  sections: GuideSectionContent[];
  slug: GuideSlug;
  steps: ToolStep[];
  summary: string;
  title: string;
  updatedAt: string;
};

export type GuideContentDictionary = Record<GuideSlug, GuideArticleContent>;
