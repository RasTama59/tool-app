export const sectionIds = {
  themes: "themes",
  principles: "principles",
  process: "process",
  faq: "faq",
} as const;

export const navigationSectionIds = [
  sectionIds.themes,
  sectionIds.principles,
  sectionIds.faq,
] as const;

export const principleItems = [
  {
    id: "localFirst",
    indexLabel: "01",
  },
  {
    id: "reviewBeforeExport",
    indexLabel: "02",
  },
  {
    id: "noInstall",
    indexLabel: "03",
  },
  {
    id: "multiTool",
    indexLabel: "04",
  },
] as const;

export const themeItems = [
  {
    id: "textCleanup",
    tone: "sun",
  },
  {
    id: "tablePrep",
    tone: "sea",
  },
  {
    id: "fileNaming",
    tone: "berry",
  },
] as const;

export const processItems = [
  {
    id: "paste",
    stepNumber: "01",
  },
  {
    id: "preview",
    stepNumber: "02",
  },
  {
    id: "finish",
    stepNumber: "03",
  },
] as const;

export const faqItems = [
  {
    id: "upload",
  },
  {
    id: "languages",
  },
  {
    id: "devices",
  },
] as const;

export type ThemeTone = (typeof themeItems)[number]["tone"];
