import type {FixedPageSlug} from "./site-chrome";

export const fixedPageSpecs: Record<
  FixedPageSlug,
  {
    sectionIds: Array<{
      id: string;
      subsectionIds: string[];
    }>;
  }
> = {
  about: {
    sectionIds: [
      {id: "purpose", subsectionIds: ["siteGoal", "whyStructure"]},
      {id: "audience", subsectionIds: ["primaryUsers", "tone"]},
      {id: "approach", subsectionIds: ["layout", "privacy"]},
    ],
  },
  guide: {
    sectionIds: [
      {id: "start", subsectionIds: ["input", "review"]},
      {id: "formats", subsectionIds: ["text", "files"]},
      {id: "tips", subsectionIds: ["local", "limitations"]},
    ],
  },
  faq: {
    sectionIds: [
      {id: "dataHandling", subsectionIds: ["localProcessing", "storagePolicy"]},
      {id: "usage", subsectionIds: ["supportedFormats", "mobile"]},
      {id: "support", subsectionIds: ["updates", "contact"]},
    ],
  },
  privacy: {
    sectionIds: [
      {id: "localFirst", subsectionIds: ["browserProcessing", "noRetention"]},
      {id: "limitations", subsectionIds: ["exceptions", "disclosure"]},
      {id: "updates", subsectionIds: ["changes", "contact"]},
    ],
  },
  terms: {
    sectionIds: [
      {id: "scope", subsectionIds: ["intendedUse", "unsupported"]},
      {id: "responsibility", subsectionIds: ["review", "disclaimer"]},
      {id: "changes", subsectionIds: ["updates", "availability"]},
    ],
  },
  contact: {
    sectionIds: [
      {id: "beforeContact", subsectionIds: ["checkGuide", "includeDetails"]},
      {id: "methods", subsectionIds: ["primaryRoute", "responseTime"]},
    ],
  },
};
