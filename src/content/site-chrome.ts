import {sectionIds} from "./home";

export const categorySectionIds = [
  sectionIds.themes,
  sectionIds.principles,
  sectionIds.faq,
] as const;

export const fixedPageSlugs = [
  "about",
  "guide",
  "faq",
  "privacy",
  "terms",
  "contact",
] as const;

export const publicFixedPageSlugs = fixedPageSlugs;

export type FixedPageSlug = (typeof fixedPageSlugs)[number];

export function isPublicFixedPageSlug(slug: string): slug is FixedPageSlug {
  return publicFixedPageSlugs.includes(slug as FixedPageSlug);
}
