import type {
  FileBatchRenameOptions,
  FileRenamePreviewItem,
  RenameSortOrder,
  ToolPreviewIssueCode,
} from "@/content/tools/tool-types";

const invalidCharactersPattern = /[<>:"/\\|?*\u0000-\u001F]/u;
const reservedNamePattern = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/iu;

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function splitFileName(name: string) {
  const lastDotIndex = name.lastIndexOf(".");

  if (lastDotIndex <= 0) {
    return {
      extension: "",
      stem: name,
    };
  }

  return {
    extension: name.slice(lastDotIndex),
    stem: name.slice(0, lastDotIndex),
  };
}

function padSequenceNumber(value: number, digits: number) {
  return String(value).padStart(digits, "0");
}

function replaceMatchingText(
  source: string,
  search: string,
  replacement: string,
  caseSensitive: boolean,
) {
  if (!search) {
    return source;
  }

  if (caseSensitive) {
    return source.split(search).join(replacement);
  }

  return source.replace(
    new RegExp(escapeRegExp(search), "giu"),
    () => replacement,
  );
}

function sortFiles(files: File[], sortOrder: RenameSortOrder) {
  const nextFiles = [...files];

  if (sortOrder === "added") {
    return nextFiles;
  }

  nextFiles.sort((left, right) =>
    left.name.localeCompare(right.name, undefined, {numeric: true}),
  );

  if (sortOrder === "nameDesc") {
    nextFiles.reverse();
  }

  return nextFiles;
}

function buildRenamedStem(
  originalStem: string,
  options: FileBatchRenameOptions,
  previewIndex: number,
) {
  const sequenceNumber = options.startNumber + previewIndex;
  const paddedSequence = padSequenceNumber(sequenceNumber, options.digits);

  let stem = originalStem;

  if (options.findText) {
    stem = replaceMatchingText(
      stem,
      options.findText,
      options.replaceText,
      options.caseSensitiveReplace,
    );
  }

  stem = `${options.prefix}${stem}${options.suffix}`;

  if (options.sequenceEnabled) {
    stem =
      options.sequencePosition === "prefix"
        ? stem
          ? `${paddedSequence}-${stem}`
          : paddedSequence
        : stem
          ? `${stem}-${paddedSequence}`
          : paddedSequence;
  }

  return {
    sequenceNumber,
    stem,
  };
}

function collectStemIssues(stem: string): ToolPreviewIssueCode[] {
  const issues: ToolPreviewIssueCode[] = [];

  if (stem.trim().length === 0) {
    issues.push("emptyName");
  }

  if (invalidCharactersPattern.test(stem)) {
    issues.push("invalidCharacters");
  }

  if (reservedNamePattern.test(stem.trim())) {
    issues.push("reservedName");
  }

  return issues;
}

export function createInitialRenameOptions(): FileBatchRenameOptions {
  return {
    caseSensitiveReplace: true,
    digits: 3,
    findText: "",
    prefix: "",
    replaceText: "",
    sequenceEnabled: true,
    sequencePosition: "prefix",
    sortOrder: "nameAsc",
    startNumber: 1,
    suffix: "",
  };
}

export function mergeUniqueFiles(
  currentFiles: File[],
  incomingFiles: Iterable<File>,
) {
  const fileMap = new Map<string, File>();

  for (const file of currentFiles) {
    fileMap.set(`${file.name}-${file.size}-${file.lastModified}`, file);
  }

  for (const file of incomingFiles) {
    fileMap.set(`${file.name}-${file.size}-${file.lastModified}`, file);
  }

  return [...fileMap.values()];
}

export function buildFileRenamePreview(
  files: File[],
  options: FileBatchRenameOptions,
): FileRenamePreviewItem[] {
  const orderedFiles = sortFiles(files, options.sortOrder);
  const previewItems = orderedFiles.map((file, index) => {
    const {extension, stem: originalStem} = splitFileName(file.name);
    const {sequenceNumber, stem} = buildRenamedStem(originalStem, options, index);

    return {
      file,
      issues: collectStemIssues(stem),
      renamedName: stem ? `${stem}${extension}` : extension,
      sequenceNumber,
    };
  });

  const duplicateMap = new Map<string, number>();

  for (const item of previewItems) {
    if (!item.renamedName) {
      continue;
    }

    const normalizedName = item.renamedName.toLocaleLowerCase();
    duplicateMap.set(normalizedName, (duplicateMap.get(normalizedName) ?? 0) + 1);
  }

  return previewItems.map((item) => {
    const normalizedName = item.renamedName.toLocaleLowerCase();

    if ((duplicateMap.get(normalizedName) ?? 0) < 2) {
      return item;
    }

    return {
      ...item,
      issues: item.issues.includes("duplicateName")
        ? item.issues
        : [...item.issues, "duplicateName"],
    };
  });
}
