export const toolSlugs = [
  "csv-excel-cleaner",
  "file-batch-rename",
  "image-batch-resize-webp",
  "pdf-page-organizer",
  "subtitle-shift-convert",
  "text-cleanup",
] as const;

export type ToolSlug = (typeof toolSlugs)[number];

export type ToolStep = {
  description: string;
  title: string;
};

export type ToolExample = {
  after: string;
  before: string;
  note?: string;
  title: string;
};

export type ToolFaqItem = {
  answer: string;
  question: string;
};

export type ToolLinkItem = {
  description: string;
  href: `/${string}`;
  label: string;
};

export type ToolHistoryEntry = {
  date: string;
  summary: string;
};

export type TextCleanupOperationContent = {
  clearLabel: string;
  copiedLabel: string;
  copyErrorLabel: string;
  copyLabel: string;
  description: string;
  inputLabel: string;
  inputPlaceholder: string;
  options: {
    collapseBlankLines: string;
    normalizeBullets: string;
    trimLineEdges: string;
  };
  optionsLegend: string;
  outputLabel: string;
  outputPlaceholder: string;
  title: string;
};

export type FileBatchRenameOperationContent = {
  actions: {
    downloadErrorLabel: string;
    downloadZipLabel: string;
    downloadingZipLabel: string;
    resetLabel: string;
    zipFileName: string;
  };
  dropzone: {
    activeLabel: string;
    browseLabel: string;
    description: string;
    hint: string;
    title: string;
  };
  emptyState: {
    description: string;
    title: string;
  };
  fields: {
    caseSensitiveReplaceLabel: string;
    digitsHint: string;
    digitsLabel: string;
    findLabel: string;
    findPlaceholder: string;
    numberingLabel: string;
    numberingPositionLabel: string;
    numberingPositionOptions: {
      prefix: string;
      suffix: string;
    };
    prefixLabel: string;
    prefixPlaceholder: string;
    replaceLabel: string;
    replacePlaceholder: string;
    sortOrderHint: string;
    sortOrderLabel: string;
    sortOrderOptions: {
      added: string;
      nameAsc: string;
      nameDesc: string;
    };
    startNumberHint: string;
    startNumberLabel: string;
    suffixLabel: string;
    suffixPlaceholder: string;
  };
  helper: {
    extensionNote: string;
    ruleOrder: string;
  };
  preview: {
    issuesLabel: string;
    newNameLabel: string;
    originalNameLabel: string;
    title: string;
  };
  status: {
    issue: string;
    ready: string;
  };
  summary: {
    issueCountLabel: string;
    readyCountLabel: string;
    selectedCountLabel: string;
  };
  title: string;
  description: string;
  validation: {
    duplicateName: string;
    emptyName: string;
    invalidCharacters: string;
    reservedName: string;
  };
};

export type ImageBatchOutputFormat = "original" | "webp";

export type ImageBatchResizeOperationContent = {
  actions: {
    downloadErrorLabel: string;
    downloadZipLabel: string;
    downloadingZipLabel: string;
    resetLabel: string;
    zipFileName: string;
  };
  dropzone: {
    activeLabel: string;
    browseLabel: string;
    description: string;
    hint: string;
    title: string;
  };
  emptyState: {
    description: string;
    title: string;
  };
  fields: {
    heightLabel: string;
    heightPlaceholder: string;
    keepAspectRatioLabel: string;
    outputFormatLabel: string;
    outputFormatOptions: {
      original: string;
      webp: string;
    };
    prefixLabel: string;
    prefixPlaceholder: string;
    qualityHint: string;
    qualityLabel: string;
    suffixLabel: string;
    suffixPlaceholder: string;
    widthLabel: string;
    widthPlaceholder: string;
  };
  helper: {
    filenameRuleNote: string;
    localProcessingNote: string;
    qualityNote: string;
    webpDescription: string;
  };
  preview: {
    originalInfoLabel: string;
    originalNameLabel: string;
    outputInfoLabel: string;
    outputNameLabel: string;
    reductionLabel: string;
    title: string;
  };
  progress: {
    processingLabel: string;
    readyLabel: string;
  };
  status: {
    error: string;
    processing: string;
    ready: string;
  };
  summary: {
    errorCountLabel: string;
    selectedCountLabel: string;
    successCountLabel: string;
  };
  title: string;
  description: string;
  validation: {
    convertFailed: string;
    duplicateName: string;
    invalidName: string;
    loadFailed: string;
    unsupportedFormat: string;
  };
};

export type TabularCleanerOperationContent = {
  actions: {
    clearColumnSelectionLabel: string;
    downloadLabel: string;
    downloadingLabel: string;
    resetLabel: string;
    selectAllColumnsLabel: string;
  };
  dropzone: {
    activeLabel: string;
    browseLabel: string;
    description: string;
    hint: string;
    title: string;
  };
  emptyState: {
    description: string;
    title: string;
  };
  fields: {
    columnsHint: string;
    columnsLabel: string;
    hasHeaderRowLabel: string;
    nonEmptyCountLabel: string;
    outputFormatLabel: string;
    outputFormatOptions: {
      csv: string;
      xlsx: string;
    };
    removeDuplicateRowsLabel: string;
    removeEmptyColumnsLabel: string;
    removeEmptyRowsLabel: string;
    sheetLabel: string;
    textDelimiterLabel: string;
    textDelimiterOptions: {
      comma: string;
      tab: string;
    };
    trimCellWhitespaceLabel: string;
  };
  helper: {
    delimiterNote: string;
    headerNote: string;
    localProcessingNote: string;
  };
  preview: {
    cleanedTitle: string;
    emptyCellLabel: string;
    originalTitle: string;
    rowNumberLabel: string;
    showingRowsLabel: string;
    title: string;
  };
  sections: {
    cleanupOptions: string;
    outputSettings: string;
    sourceSettings: string;
    summary: string;
  };
  summary: {
    afterColumnsLabel: string;
    afterRowsLabel: string;
    beforeColumnsLabel: string;
    beforeRowsLabel: string;
    detectedFormatLabel: string;
    fileLabel: string;
    removedDuplicateRowsLabel: string;
    removedEmptyColumnsLabel: string;
    removedEmptyRowsLabel: string;
    selectedColumnsLabel: string;
    sheetLabel: string;
  };
  status: {
    loading: string;
    previewUpdating: string;
    ready: string;
  };
  title: string;
  description: string;
  validation: {
    abnormalData: string;
    emptyFile: string;
    exportFailed: string;
    loadFailed: string;
    noColumnsSelected: string;
    unsupportedFormat: string;
  };
};

export type PdfPageOrganizerOperationContent = {
  actions: {
    clearSelectionLabel: string;
    deleteSelectedLabel: string;
    downloadLabel: string;
    downloadingLabel: string;
    resetLabel: string;
    selectAllLabel: string;
    splitDownloadLabel: string;
    splittingLabel: string;
  };
  dropzone: {
    activeLabel: string;
    browseLabel: string;
    description: string;
    hint: string;
    title: string;
  };
  emptyState: {
    description: string;
    title: string;
  };
  fields: {
    currentPageLabel: string;
    deletePageLabel: string;
    moveDownLabel: string;
    moveUpLabel: string;
    originalPageLabel: string;
    pageInfoLabel: string;
    pageListLabel: string;
    pageSizeLabel: string;
    rotationLabel: string;
    selectPageLabel: string;
    sourceFileLabel: string;
    splitRangeLabel: string;
    splitRangePlaceholder: string;
  };
  helper: {
    mergeNote: string;
    localProcessingNote: string;
    mobileNote: string;
    reorderNote: string;
    splitNote: string;
  };
  preview: {
    dragHintLabel: string;
    emptyLabel: string;
    renderingLabel: string;
    selectedLabel: string;
    title: string;
  };
  sections: {
    controls: string;
    split: string;
    summary: string;
  };
  summary: {
    currentCountLabel: string;
    fileLabel: string;
    originalCountLabel: string;
    removedCountLabel: string;
    selectedCountLabel: string;
    sourceCountLabel: string;
  };
  status: {
    loading: string;
    ready: string;
  };
  title: string;
  description: string;
  validation: {
    emptyFile: string;
    exportFailed: string;
    invalidSplitRange: string;
    loadFailed: string;
    noPagesRemaining: string;
    noSplitTargets: string;
    unsupportedFormat: string;
  };
};

export type SubtitleShiftConvertOperationContent = {
  actions: {
    downloadLabel: string;
    downloadingLabel: string;
    resetLabel: string;
  };
  dropzone: {
    activeLabel: string;
    browseLabel: string;
    description: string;
    hint: string;
    title: string;
  };
  emptyState: {
    description: string;
    title: string;
  };
  fields: {
    cueTextLabel: string;
    endLabel: string;
    offsetDirectionLabel: string;
    offsetDirectionOptions: {
      minus: string;
      plus: string;
    };
    offsetLabel: string;
    offsetPlaceholder: string;
    outputFormatLabel: string;
    outputFormatOptions: {
      srt: string;
      vtt: string;
    };
    shiftUnitLabel: string;
    shiftUnitOptions: {
      milliseconds: string;
      seconds: string;
    };
    startLabel: string;
    timestampListLabel: string;
  };
  helper: {
    clampNote: string;
    localProcessingNote: string;
    srtVttDifferenceNote: string;
  };
  preview: {
    originalTextTitle: string;
    processedTextTitle: string;
    processedTimingLabel: string;
    sourceTimingLabel: string;
    title: string;
  };
  sections: {
    conversion: string;
    summary: string;
    timingShift: string;
  };
  summary: {
    clampedCueCountLabel: string;
    cueCountLabel: string;
    fileLabel: string;
    offsetLabel: string;
    outputFormatLabel: string;
    sourceFormatLabel: string;
  };
  status: {
    loading: string;
    ready: string;
  };
  title: string;
  description: string;
  validation: {
    emptyFile: string;
    invalidFormat: string;
    invalidTimestamp: string;
    loadFailed: string;
    noCues: string;
    unsupportedFormat: string;
  };
};

export type ToolOperationContent =
  | {
      kind: "tabularCleaner";
      ui: TabularCleanerOperationContent;
    }
  | {
      kind: "fileBatchRename";
      ui: FileBatchRenameOperationContent;
    }
  | {
      kind: "imageBatchResize";
      ui: ImageBatchResizeOperationContent;
    }
  | {
      kind: "pdfPageOrganizer";
      ui: PdfPageOrganizerOperationContent;
    }
  | {
      kind: "subtitleShiftConvert";
      ui: SubtitleShiftConvertOperationContent;
    }
  | {
      kind: "textCleanup";
      ui: TextCleanupOperationContent;
    };

export type ToolContentDictionary = Record<ToolSlug, ToolPageContent>;

export type ToolPreviewIssueCode =
  | "duplicateName"
  | "emptyName"
  | "invalidCharacters"
  | "reservedName";

export type RenameSequencePosition = "prefix" | "suffix";
export type RenameSortOrder = "added" | "nameAsc" | "nameDesc";

export type FileBatchRenameOptions = {
  caseSensitiveReplace: boolean;
  digits: number;
  findText: string;
  prefix: string;
  replaceText: string;
  sequenceEnabled: boolean;
  sequencePosition: RenameSequencePosition;
  sortOrder: RenameSortOrder;
  startNumber: number;
  suffix: string;
};

export type FileRenamePreviewItem = {
  file: File;
  issues: ToolPreviewIssueCode[];
  renamedName: string;
  sequenceNumber: number;
};

export type ImageBatchProcessErrorCode =
  | "convertFailed"
  | "duplicateName"
  | "invalidName"
  | "loadFailed"
  | "unsupportedFormat";

export type ImageBatchOptions = {
  height: number | "";
  keepAspectRatio: boolean;
  outputFormat: ImageBatchOutputFormat;
  prefix: string;
  quality: number;
  suffix: string;
  width: number | "";
};

export type ImageBatchPreviewItem = {
  errorCode?: ImageBatchProcessErrorCode;
  file: File;
  originalDimensions?: {
    height: number;
    width: number;
  };
  originalSizeBytes: number;
  outputDimensions?: {
    height: number;
    width: number;
  };
  outputFile?: File;
  outputName: string;
  outputSizeBytes?: number;
  reductionRatio?: number;
  status: "error" | "processing" | "ready";
};

export type ToolPageContent = {
  capabilities: string[];
  category: string;
  cautions: string[];
  description: string;
  examples: ToolExample[];
  faq: ToolFaqItem[];
  history: ToolHistoryEntry[];
  idealFor: string[];
  metadata: {
    description: string;
    keywords: string[];
    title: string;
  };
  operation: ToolOperationContent;
  relatedArticles: ToolLinkItem[];
  relatedTools: ToolLinkItem[];
  slug: ToolSlug;
  steps: ToolStep[];
  structuredData: {
    applicationCategory: string;
    operatingSystem: string;
  };
  supportedFormats: string[];
  title: string;
};
