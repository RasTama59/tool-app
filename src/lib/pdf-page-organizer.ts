import JSZip from "jszip";
import {PDFDocument} from "pdf-lib";

export type PdfOrganizerErrorCode =
  | "unsupportedFormat"
  | "loadFailed"
  | "emptyFile"
  | "exportFailed"
  | "noPagesRemaining"
  | "invalidSplitRange"
  | "noSplitTargets";

export type PdfSourceDocument = {
  baseName: string;
  file: File;
  id: string;
  pageCount: number;
  sourceBytes: Uint8Array;
};

export type PdfPageItem = {
  height: number;
  id: string;
  isSelected: boolean;
  originalIndex: number;
  rotation: number;
  sourceDocumentId: string;
  sourceFileName: string;
  width: number;
};

export type PdfOrganizerDocument = {
  baseName: string;
  originalPageCount: number;
  pages: PdfPageItem[];
  sourceDocuments: PdfSourceDocument[];
};

type PdfOrganizerError = Error & {
  code: PdfOrganizerErrorCode;
};

type PdfSplitGroup = {
  fileName: string;
  pages: PdfPageItem[];
};

const CLEANED_FILE_SUFFIX = "-organized";
const SPLIT_ARCHIVE_SUFFIX = "-split";
const FILE_NAME_SANITIZE_PATTERN = /[<>:"/\\|?*\u0000-\u001f]/g;
const SPLIT_RANGE_PATTERN = /^(\d+)(?:\s*-\s*(\d+))?$/;

function createPdfOrganizerError(code: PdfOrganizerErrorCode): PdfOrganizerError {
  const error = new Error(code) as PdfOrganizerError;

  error.code = code;

  return error;
}

function sanitizeFileNameSegment(value: string) {
  return value.replace(FILE_NAME_SANITIZE_PATTERN, " ").trim().replace(/\s+/g, "-");
}

function toBlobBuffer(bytes: Uint8Array) {
  return Uint8Array.from(bytes).buffer;
}

function getFileBaseName(fileName: string) {
  const lastDotIndex = fileName.lastIndexOf(".");
  const baseName = lastDotIndex > 0 ? fileName.slice(0, lastDotIndex) : fileName;

  return sanitizeFileNameSegment(baseName) || "pdf";
}

function getWorkspaceBaseName(sourceDocuments: PdfSourceDocument[]) {
  if (sourceDocuments.length === 1) {
    return sourceDocuments[0].baseName;
  }

  return `${sourceDocuments[0].baseName}-merged`;
}

function isPdfFile(file: File) {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

function buildPageId(sourceDocumentId: string, pageIndex: number) {
  return `${sourceDocumentId}-page-${pageIndex + 1}`;
}

async function loadPdfDocument(sourceBytes: Uint8Array) {
  return await PDFDocument.load(sourceBytes);
}

async function loadSourceDocuments(document: PdfOrganizerDocument) {
  const loadedDocuments = new Map<string, PDFDocument>();

  for (const sourceDocument of document.sourceDocuments) {
    loadedDocuments.set(sourceDocument.id, await loadPdfDocument(sourceDocument.sourceBytes));
  }

  return loadedDocuments;
}

async function buildPdfBytesFromPages(
  document: PdfOrganizerDocument,
  pages: PdfPageItem[],
  loadedDocuments?: Map<string, PDFDocument>,
) {
  const sourceDocumentMap =
    loadedDocuments ?? (await loadSourceDocuments(document));
  const nextDocument = await PDFDocument.create();

  for (const page of pages) {
    const sourceDocument = sourceDocumentMap.get(page.sourceDocumentId);

    if (!sourceDocument) {
      throw createPdfOrganizerError("exportFailed");
    }

    const [copiedPage] = await nextDocument.copyPages(sourceDocument, [
      page.originalIndex,
    ]);

    nextDocument.addPage(copiedPage);
  }

  return Uint8Array.from(await nextDocument.save());
}

function buildSplitGroups(
  document: PdfOrganizerDocument,
  pages: PdfPageItem[],
  splitRangeInput: string,
): PdfSplitGroup[] {
  const trimmedInput = splitRangeInput.trim();

  if (!trimmedInput) {
    throw createPdfOrganizerError("noSplitTargets");
  }

  const tokens = trimmedInput
    .split(",")
    .map((token) => token.trim())
    .filter(Boolean);

  if (!tokens.length) {
    throw createPdfOrganizerError("noSplitTargets");
  }

  const usedIndexes = new Set<number>();

  return tokens.map((token, groupIndex) => {
    const match = SPLIT_RANGE_PATTERN.exec(token);

    if (!match) {
      throw createPdfOrganizerError("invalidSplitRange");
    }

    const start = Number(match[1]);
    const end = match[2] ? Number(match[2]) : start;

    if (
      !Number.isInteger(start) ||
      !Number.isInteger(end) ||
      start < 1 ||
      end < 1 ||
      start > end ||
      end > pages.length
    ) {
      throw createPdfOrganizerError("invalidSplitRange");
    }

    const rangeIndexes = Array.from({length: end - start + 1}, (_, index) => start + index);

    if (rangeIndexes.some((value) => usedIndexes.has(value))) {
      throw createPdfOrganizerError("invalidSplitRange");
    }

    for (const value of rangeIndexes) {
      usedIndexes.add(value);
    }

    const rangeLabel = start === end ? `${start}` : `${start}-${end}`;

    return {
      fileName: `${document.baseName}-pages-${String(groupIndex + 1).padStart(2, "0")}-${rangeLabel}.pdf`,
      pages: pages.slice(start - 1, end),
    };
  });
}

export function movePdfPageItems(
  pages: PdfPageItem[],
  fromIndex: number,
  toIndex: number,
) {
  if (fromIndex === toIndex) {
    return pages;
  }

  if (
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= pages.length ||
    toIndex >= pages.length
  ) {
    return pages;
  }

  const nextPages = [...pages];
  const [movedPage] = nextPages.splice(fromIndex, 1);

  nextPages.splice(toIndex, 0, movedPage);

  return nextPages;
}

export function setPdfPageSelection(
  pages: PdfPageItem[],
  pageIds: string[],
  isSelected: boolean,
) {
  const pageIdSet = new Set(pageIds);

  return pages.map((page) =>
    pageIdSet.has(page.id)
      ? {
          ...page,
          isSelected,
        }
      : page,
  );
}

export function togglePdfPageSelection(
  pages: PdfPageItem[],
  pageId: string,
  isSelected: boolean,
) {
  return setPdfPageSelection(pages, [pageId], isSelected);
}

export function removePdfPages(pages: PdfPageItem[], pageIds: string[]) {
  const pageIdSet = new Set(pageIds);

  return pages.filter((page) => !pageIdSet.has(page.id));
}

export async function parsePdfFiles(files: File[]): Promise<PdfOrganizerDocument> {
  if (!files.length) {
    throw createPdfOrganizerError("emptyFile");
  }

  if (files.some((file) => !isPdfFile(file))) {
    throw createPdfOrganizerError("unsupportedFormat");
  }

  try {
    const sourceDocumentsWithPages = await Promise.all(
      files.map(async (file, fileIndex) => {
        const sourceBytes = new Uint8Array(await file.arrayBuffer());
        const sourceDocument = await loadPdfDocument(sourceBytes);
        const sourceId = `source-${fileIndex + 1}`;
        const pageItems = sourceDocument.getPages().map((page, pageIndex) => ({
          height: Math.round(page.getHeight()),
          id: buildPageId(sourceId, pageIndex),
          isSelected: false,
          originalIndex: pageIndex,
          rotation: page.getRotation().angle,
          sourceDocumentId: sourceId,
          sourceFileName: file.name,
          width: Math.round(page.getWidth()),
        }));

        return {
          sourceDocument: {
            baseName: getFileBaseName(file.name),
            file,
            id: sourceId,
            pageCount: pageItems.length,
            sourceBytes,
          },
          pages: pageItems,
        };
      }),
    );

    const pages = sourceDocumentsWithPages.flatMap((entry) => entry.pages);

    if (!pages.length) {
      throw createPdfOrganizerError("emptyFile");
    }

    const sourceDocuments = sourceDocumentsWithPages.map((entry) => entry.sourceDocument);

    return {
      baseName: getWorkspaceBaseName(sourceDocuments),
      originalPageCount: pages.length,
      pages,
      sourceDocuments,
    };
  } catch (error) {
    if (typeof error === "object" && error && "code" in error) {
      throw error;
    }

    throw createPdfOrganizerError("loadFailed");
  }
}

export async function buildOrganizedPdf(
  document: PdfOrganizerDocument,
  pages: PdfPageItem[],
) {
  if (!pages.length) {
    throw createPdfOrganizerError("noPagesRemaining");
  }

  try {
    const pdfBytes = await buildPdfBytesFromPages(document, pages);

    return {
      blob: new Blob([toBlobBuffer(pdfBytes)], {type: "application/pdf"}),
      fileName: `${document.baseName}${CLEANED_FILE_SUFFIX}.pdf`,
    };
  } catch (error) {
    if (typeof error === "object" && error && "code" in error) {
      throw error;
    }

    throw createPdfOrganizerError("exportFailed");
  }
}

export async function buildSplitPdfArchive(
  document: PdfOrganizerDocument,
  pages: PdfPageItem[],
  splitRangeInput: string,
) {
  if (!pages.length) {
    throw createPdfOrganizerError("noPagesRemaining");
  }

  try {
    const groups = buildSplitGroups(document, pages, splitRangeInput);

    if (!groups.length) {
      throw createPdfOrganizerError("noSplitTargets");
    }

    const loadedDocuments = await loadSourceDocuments(document);
    const zip = new JSZip();

    for (const group of groups) {
      const pdfBytes = await buildPdfBytesFromPages(
        document,
        group.pages,
        loadedDocuments,
      );

      zip.file(group.fileName, pdfBytes);
    }

    const archiveBytes = await zip.generateAsync({type: "uint8array"});

    return {
      blob: new Blob([toBlobBuffer(archiveBytes)], {type: "application/zip"}),
      fileName: `${document.baseName}${SPLIT_ARCHIVE_SUFFIX}.zip`,
      groupCount: groups.length,
    };
  } catch (error) {
    if (typeof error === "object" && error && "code" in error) {
      throw error;
    }

    throw createPdfOrganizerError("exportFailed");
  }
}
