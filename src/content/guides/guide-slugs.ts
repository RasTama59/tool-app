export const guideSlugs = [
  "rename-files-in-bulk",
  "clean-csv-empty-lines-duplicates",
  "reorder-pdf-pages",
  "shift-srt-vtt-subtitles",
] as const;

export type GuideSlug = (typeof guideSlugs)[number];
