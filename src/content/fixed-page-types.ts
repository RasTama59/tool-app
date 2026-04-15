import type {FixedPageSlug} from "./site-chrome";

export type FixedPageSectionContent = {
  body: string[];
  subsections: Record<
    string,
    {
      body: string[];
      title: string;
    }
  >;
  title: string;
};

export type FixedPagePanelContent = {
  items: Record<string, string>;
  title: string;
};

export type FixedPageEntry = {
  description: string;
  metadata: {
    description: string;
    title: string;
  };
  notice: {
    description: string;
    title: string;
  };
  panel?: FixedPagePanelContent;
  sections: Record<string, FixedPageSectionContent>;
  title: string;
};

export type FixedPageLocaleMap = Record<FixedPageSlug, FixedPageEntry>;
