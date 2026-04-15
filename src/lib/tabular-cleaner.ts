import type {WorkBook, WorkSheet} from "xlsx";

export type TabularInputFormat = "csv" | "tsv" | "xlsx" | "xls";
export type TabularOutputFormat = "csv" | "xlsx";
export type TabularTextDelimiter = "comma" | "tab";

export type TabularFileErrorCode =
  | "unsupportedFormat"
  | "loadFailed"
  | "emptyFile"
  | "abnormalData";

export type TabularCleanerErrorCode =
  | TabularFileErrorCode
  | "noColumnsSelected"
  | "exportFailed";

export type TabularCleanerOptions = {
  hasHeaderRow: boolean;
  outputFormat: TabularOutputFormat;
  removeDuplicateRows: boolean;
  removeEmptyColumns: boolean;
  removeEmptyRows: boolean;
  selectedColumnIds: string[];
  textDelimiter: TabularTextDelimiter;
  trimCellWhitespace: boolean;
};

export type TabularSheet = {
  columnCount: number;
  id: string;
  name: string;
  rows: string[][];
  rowCount: number;
};

export type TabularWorkbook = {
  baseName: string;
  file: File;
  format: TabularInputFormat;
  sheets: TabularSheet[];
};

export type TabularColumnDefinition = {
  headerText: string;
  id: string;
  nonEmptyCellCount: number;
  originalIndex: number;
};

export type TabularPreviewTable = {
  columns: TabularColumnDefinition[];
  headerRow: string[] | null;
  rows: string[][];
  totalRowCount: number;
  visibleRowCount: number;
};

export type TabularCleanerSummary = {
  cleanedColumnCount: number;
  cleanedDataRowCount: number;
  originalColumnCount: number;
  originalDataRowCount: number;
  removedDuplicateRows: number;
  removedEmptyColumns: number;
  removedEmptyRows: number;
  selectedColumnCount: number;
};

export type TabularCleanerResult = {
  cleanedPreview: TabularPreviewTable;
  exportRows: string[][];
  originalPreview: TabularPreviewTable;
  summary: TabularCleanerSummary;
};

type TabularCleanerError = Error & {
  code: TabularCleanerErrorCode;
};

type SpreadsheetModule = typeof import("xlsx");

const PREVIEW_ROW_LIMIT = 10;
const CLEANED_FILE_SUFFIX = "-cleaned";
const FILE_NAME_SANITIZE_PATTERN = /[<>:"/\\|?*\u0000-\u001f]/g;
const WORKSHEET_NAME_SANITIZE_PATTERN = /[:\\/?*[\]]/g;

let spreadsheetModulePromise: Promise<SpreadsheetModule> | undefined;

function createTabularCleanerError(code: TabularCleanerErrorCode): TabularCleanerError {
  const error = new Error(code) as TabularCleanerError;

  error.code = code;

  return error;
}

async function loadSpreadsheetModule() {
  if (!spreadsheetModulePromise) {
    spreadsheetModulePromise = (async () => {
      const spreadsheet = await import("xlsx");

      try {
        const codepage = await import("xlsx/dist/cpexcel.full.mjs");

        spreadsheet.set_cptable((codepage as {default?: unknown}).default ?? codepage);
      } catch {
        // Older XLS files may be less compatible without codepage support,
        // but modern CSV/XLSX handling can still continue.
      }

      return spreadsheet;
    })();
  }

  return spreadsheetModulePromise;
}

function getFileExtension(fileName: string) {
  const parts = fileName.split(".");

  if (parts.length < 2) {
    return "";
  }

  return parts.at(-1)?.toLowerCase() ?? "";
}

function getFileBaseName(fileName: string) {
  const extension = getFileExtension(fileName);

  if (!extension) {
    return sanitizeFileNameSegment(fileName) || "cleaned-data";
  }

  return sanitizeFileNameSegment(fileName.slice(0, -(extension.length + 1))) || "cleaned-data";
}

function sanitizeFileNameSegment(value: string) {
  return value.replace(FILE_NAME_SANITIZE_PATTERN, " ").trim().replace(/\s+/g, "-");
}

function sanitizeWorksheetName(value: string) {
  const sanitized = value
    .replace(WORKSHEET_NAME_SANITIZE_PATTERN, " ")
    .trim()
    .slice(0, 31);

  return sanitized || "Cleaned Data";
}

function detectTabularInputFormat(file: File): TabularInputFormat | null {
  const extension = getFileExtension(file.name);

  if (extension === "csv") {
    return "csv";
  }

  if (extension === "tsv") {
    return "tsv";
  }

  if (extension === "xlsx") {
    return "xlsx";
  }

  if (extension === "xls") {
    return "xls";
  }

  return null;
}

function toCellText(value: unknown) {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "string") {
    return value.replace(/\r\n?/g, "\n");
  }

  if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") {
    return String(value);
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return String(value).replace(/\r\n?/g, "\n");
}

function getEffectiveColumnCount(rows: string[][]) {
  let columnCount = 0;

  for (const row of rows) {
    for (let index = row.length - 1; index >= 0; index -= 1) {
      if (row[index] !== "") {
        columnCount = Math.max(columnCount, index + 1);
        break;
      }
    }
  }

  return columnCount;
}

function normalizeParsedRows(rawRows: unknown[]) {
  if (!Array.isArray(rawRows)) {
    throw createTabularCleanerError("abnormalData");
  }

  const normalizedRows = rawRows.map((rawRow) => {
    if (!Array.isArray(rawRow)) {
      throw createTabularCleanerError("abnormalData");
    }

    return rawRow.map((cell) => toCellText(cell));
  });
  const effectiveColumnCount = getEffectiveColumnCount(normalizedRows);

  if (effectiveColumnCount === 0) {
    return normalizedRows.map(() => []);
  }

  return normalizedRows.map((row) => {
    if (row.length >= effectiveColumnCount) {
      return row.slice(0, effectiveColumnCount);
    }

    return [...row, ...Array.from({length: effectiveColumnCount - row.length}, () => "")];
  });
}

function hasMeaningfulContent(sheet: TabularSheet) {
  return sheet.rows.some((row) => row.some((cell) => cell !== ""));
}

function buildSheet(
  spreadsheet: SpreadsheetModule,
  sheet: WorkSheet | undefined,
  sheetName: string,
  index: number,
) {
  if (!sheet) {
    throw createTabularCleanerError("abnormalData");
  }

  const rawRows = spreadsheet.utils.sheet_to_json(sheet, {
    blankrows: true,
    defval: "",
    header: 1,
    raw: false,
  });
  const rows = normalizeParsedRows(rawRows);

  return {
    columnCount: rows.reduce((maxValue, row) => Math.max(maxValue, row.length), 0),
    id: `sheet-${index}`,
    name: sheetName || `Sheet ${index + 1}`,
    rowCount: rows.length,
    rows,
  } satisfies TabularSheet;
}

function pickColumnsFromRow(row: string[] | undefined, columns: TabularColumnDefinition[]) {
  return columns.map((column) => row?.[column.originalIndex] ?? "");
}

function isBlankCell(value: string) {
  return value.length === 0;
}

function isBlankRow(row: string[]) {
  return row.every((cell) => isBlankCell(cell));
}

function buildDuplicateRowKey(row: string[]) {
  return JSON.stringify(row);
}

function trimRows(rows: string[][], shouldTrim: boolean) {
  if (!shouldTrim) {
    return rows.map((row) => [...row]);
  }

  return rows.map((row) => row.map((cell) => cell.trim()));
}

function splitSheetRows(rows: string[][], hasHeaderRow: boolean) {
  if (!hasHeaderRow) {
    return {
      dataRows: rows.map((row) => [...row]),
      headerRow: null as string[] | null,
    };
  }

  return {
    dataRows: rows.slice(1).map((row) => [...row]),
    headerRow: rows[0] ? [...rows[0]] : [],
  };
}

function buildColumns(
  sheet: TabularSheet,
  hasHeaderRow: boolean,
  trimCellWhitespace: boolean,
) {
  const normalizedRows = trimRows(sheet.rows, trimCellWhitespace);
  const {dataRows, headerRow} = splitSheetRows(normalizedRows, hasHeaderRow);
  const rowsToInspect = dataRows.length > 0 ? dataRows : headerRow ? [headerRow] : normalizedRows;

  return Array.from({length: sheet.columnCount}, (_, index) => ({
    headerText: headerRow?.[index] ?? "",
    id: `column-${index}`,
    nonEmptyCellCount: rowsToInspect.reduce((count, row) => {
      return count + (row[index] ? 1 : 0);
    }, 0),
    originalIndex: index,
  }));
}

function getEmptyColumnIds(
  columns: TabularColumnDefinition[],
  dataRows: string[][],
  headerRow: string[] | null,
) {
  const rowsToInspect = dataRows.length > 0 ? dataRows : headerRow ? [headerRow] : [];

  if (!rowsToInspect.length) {
    return new Set<string>();
  }

  return new Set(
    columns
      .filter((column) =>
        rowsToInspect.every((row) => isBlankCell(row[column.originalIndex] ?? "")),
      )
      .map((column) => column.id),
  );
}

function buildPreviewTable(
  rows: string[][],
  columns: TabularColumnDefinition[],
  hasHeaderRow: boolean,
): TabularPreviewTable {
  const selectedRows = rows.map((row) => pickColumnsFromRow(row, columns));
  const headerRow = hasHeaderRow ? (selectedRows[0] ?? columns.map(() => "")) : null;
  const dataRows = hasHeaderRow ? selectedRows.slice(1) : selectedRows;

  return {
    columns,
    headerRow,
    rows: dataRows.slice(0, PREVIEW_ROW_LIMIT),
    totalRowCount: dataRows.length,
    visibleRowCount: Math.min(dataRows.length, PREVIEW_ROW_LIMIT),
  };
}

export function createInitialTabularCleanerOptions(
  inputFormat?: TabularInputFormat,
): TabularCleanerOptions {
  return {
    hasHeaderRow: true,
    outputFormat: inputFormat === "xlsx" || inputFormat === "xls" ? "xlsx" : "csv",
    removeDuplicateRows: true,
    removeEmptyColumns: true,
    removeEmptyRows: true,
    selectedColumnIds: [],
    textDelimiter: inputFormat === "tsv" ? "tab" : "comma",
    trimCellWhitespace: true,
  };
}

export function getTabularColumnDefinitions(
  sheet: TabularSheet,
  options: Pick<TabularCleanerOptions, "hasHeaderRow" | "trimCellWhitespace">,
) {
  return buildColumns(sheet, options.hasHeaderRow, options.trimCellWhitespace);
}

export async function parseTabularFile(file: File): Promise<TabularWorkbook> {
  const format = detectTabularInputFormat(file);

  if (!format) {
    throw createTabularCleanerError("unsupportedFormat");
  }

  try {
    const spreadsheet = await loadSpreadsheetModule();
    const buffer = await file.arrayBuffer();
    const workbook = spreadsheet.read(buffer, {
      cellText: true,
      dense: true,
      type: "array",
    }) as WorkBook;
    const sheets = workbook.SheetNames.map((sheetName, index) =>
      buildSheet(spreadsheet, workbook.Sheets[sheetName], sheetName, index),
    ).filter((sheet) => hasMeaningfulContent(sheet));

    if (!sheets.length) {
      throw createTabularCleanerError("emptyFile");
    }

    return {
      baseName: getFileBaseName(file.name),
      file,
      format,
      sheets,
    };
  } catch (error) {
    if (typeof error === "object" && error && "code" in error) {
      throw error;
    }

    throw createTabularCleanerError("loadFailed");
  }
}

export function applyTabularCleaner(
  sheet: TabularSheet,
  options: TabularCleanerOptions,
): TabularCleanerResult {
  const processedRows = trimRows(sheet.rows, options.trimCellWhitespace);
  const {dataRows: sourceDataRows, headerRow: sourceHeaderRow} = splitSheetRows(
    processedRows,
    options.hasHeaderRow,
  );
  const allColumns = buildColumns(sheet, options.hasHeaderRow, options.trimCellWhitespace);
  const selectedColumns = allColumns.filter((column) =>
    options.selectedColumnIds.includes(column.id),
  );

  let cleanedDataRows = sourceDataRows.map((row) => [...row]);
  let removedEmptyRows = 0;
  let removedDuplicateRows = 0;

  if (options.removeEmptyRows) {
    const nextRows = cleanedDataRows.filter((row) => !isBlankRow(row));

    removedEmptyRows = cleanedDataRows.length - nextRows.length;
    cleanedDataRows = nextRows;
  }

  if (options.removeDuplicateRows) {
    const seenRows = new Set<string>();
    const deduplicatedRows: string[][] = [];

    for (const row of cleanedDataRows) {
      const rowKey = buildDuplicateRowKey(row);

      if (seenRows.has(rowKey)) {
        removedDuplicateRows += 1;
        continue;
      }

      seenRows.add(rowKey);
      deduplicatedRows.push(row);
    }

    cleanedDataRows = deduplicatedRows;
  }

  const emptyColumnIds = options.removeEmptyColumns
    ? getEmptyColumnIds(allColumns, cleanedDataRows, sourceHeaderRow)
    : new Set<string>();
  const cleanedColumns = selectedColumns.filter((column) => !emptyColumnIds.has(column.id));
  const exportRows = [
    ...(options.hasHeaderRow && sourceHeaderRow
      ? [pickColumnsFromRow(sourceHeaderRow, cleanedColumns)]
      : []),
    ...cleanedDataRows.map((row) => pickColumnsFromRow(row, cleanedColumns)),
  ];

  return {
    cleanedPreview: buildPreviewTable(exportRows, cleanedColumns, options.hasHeaderRow),
    exportRows,
    originalPreview: buildPreviewTable(sheet.rows, selectedColumns, options.hasHeaderRow),
    summary: {
      cleanedColumnCount: cleanedColumns.length,
      cleanedDataRowCount: cleanedDataRows.length,
      originalColumnCount: sheet.columnCount,
      originalDataRowCount: sourceDataRows.length,
      removedDuplicateRows,
      removedEmptyColumns: emptyColumnIds.size,
      removedEmptyRows,
      selectedColumnCount: selectedColumns.length,
    },
  };
}

export async function buildTabularDownload(
  workbook: TabularWorkbook,
  sheet: TabularSheet,
  result: TabularCleanerResult,
  options: Pick<TabularCleanerOptions, "outputFormat" | "textDelimiter">,
) {
  if (!result.cleanedPreview.columns.length) {
    throw createTabularCleanerError("noColumnsSelected");
  }

  try {
    const spreadsheet = await loadSpreadsheetModule();
    const fileNameBase =
      workbook.sheets.length > 1
        ? `${workbook.baseName}-${sanitizeFileNameSegment(sheet.name)}`
        : workbook.baseName;

    if (options.outputFormat === "xlsx") {
      const nextWorkbook = spreadsheet.utils.book_new();
      const nextWorksheet = spreadsheet.utils.aoa_to_sheet(result.exportRows);

      spreadsheet.utils.book_append_sheet(
        nextWorkbook,
        nextWorksheet,
        sanitizeWorksheetName(sheet.name),
      );

      const arrayBuffer = spreadsheet.write(nextWorkbook, {
        bookType: "xlsx",
        type: "array",
      });

      return {
        blob: new Blob([arrayBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
        fileName: `${fileNameBase}${CLEANED_FILE_SUFFIX}.xlsx`,
      };
    }

    const worksheet = spreadsheet.utils.aoa_to_sheet(result.exportRows);
    const isTabSeparated = options.textDelimiter === "tab";
    const text = spreadsheet.utils.sheet_to_csv(worksheet, {
      FS: isTabSeparated ? "\t" : ",",
      RS: "\r\n",
    });

    return {
      blob: new Blob(["\uFEFF", text], {
        type: isTabSeparated
          ? "text/tab-separated-values;charset=utf-8"
          : "text/csv;charset=utf-8",
      }),
      fileName: `${fileNameBase}${CLEANED_FILE_SUFFIX}.${isTabSeparated ? "tsv" : "csv"}`,
    };
  } catch {
    throw createTabularCleanerError("exportFailed");
  }
}
