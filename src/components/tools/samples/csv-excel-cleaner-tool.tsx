"use client";

import {useEffect, useRef, useState, useTransition} from "react";

import type {TabularCleanerOperationContent} from "@/content/tools/tool-types";
import type {
  TabularCleanerErrorCode,
  TabularCleanerOptions,
  TabularColumnDefinition,
  TabularInputFormat,
  TabularPreviewTable,
  TabularWorkbook,
} from "@/lib/tabular-cleaner";
import {
  applyTabularCleaner,
  buildTabularDownload,
  createInitialTabularCleanerOptions,
  getTabularColumnDefinitions,
  parseTabularFile,
} from "@/lib/tabular-cleaner";
import {Button} from "@/components/ui/button";
import {EmptyState} from "@/components/ui/empty-state";
import {Notice} from "@/components/ui/notice";
import {cx} from "@/lib/utils";

type Props = {
  content: TabularCleanerOperationContent;
};

function getErrorCode(error: unknown): TabularCleanerErrorCode {
  if (typeof error === "object" && error && "code" in error) {
    return String(error.code) as TabularCleanerErrorCode;
  }

  return "loadFailed";
}

function getErrorLabel(
  content: TabularCleanerOperationContent,
  errorCode: TabularCleanerErrorCode,
) {
  return content.validation[errorCode];
}

function getDetectedFormatLabel(format?: TabularInputFormat) {
  if (!format) {
    return "";
  }

  return format === "tsv" ? "TSV" : format.toUpperCase();
}

function getColumnLabel(column: TabularColumnDefinition) {
  const indexLabel = `#${column.originalIndex + 1}`;

  if (!column.headerText) {
    return {
      indexLabel,
      title: indexLabel,
    };
  }

  return {
    indexLabel,
    title: column.headerText,
  };
}

function triggerBrowserDownload(blob: Blob, fileName: string) {
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = objectUrl;
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(objectUrl);
}

function TabularPreviewCard({
  content,
  table,
  title,
}: {
  content: TabularCleanerOperationContent;
  table: TabularPreviewTable;
  title: string;
}) {
  return (
    <section className="space-y-3 rounded-[24px] border border-line bg-[#fbfdff] p-4">
      <div className="space-y-1.5">
        <h4 className="text-base font-semibold text-foreground">{title}</h4>
        <p className="text-sm leading-7 text-muted">
          {content.preview.showingRowsLabel}: {table.visibleRowCount}/{table.totalRowCount}
        </p>
      </div>

      {table.columns.length === 0 ? (
        <div className="rounded-[18px] border border-dashed border-[#d4dfec] bg-white px-4 py-6 text-sm leading-7 text-muted">
          {content.validation.noColumnsSelected}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 border-b border-line bg-[#f3f7fc] px-3 py-2 font-semibold text-foreground">
                  {content.preview.rowNumberLabel}
                </th>
                {table.columns.map((column, columnIndex) => {
                  const labels = getColumnLabel(column);

                  return (
                    <th
                      className="border-b border-line bg-[#f3f7fc] px-3 py-2 font-semibold text-foreground"
                      key={column.id}
                      scope="col"
                    >
                      <div className="min-w-[140px] space-y-1">
                        <p className="break-words">
                          {table.headerRow?.[columnIndex] || labels.title}
                        </p>
                        <p className="text-xs font-medium text-muted">{labels.indexLabel}</p>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {table.rows.length === 0 ? (
                <tr>
                  <td
                    className="sticky left-0 border-b border-line bg-white px-3 py-3 text-muted"
                    scope="row"
                  >
                    1
                  </td>
                  <td
                    className="border-b border-line px-3 py-3 text-muted"
                    colSpan={table.columns.length}
                  >
                    {content.preview.emptyCellLabel}
                  </td>
                </tr>
              ) : (
                table.rows.map((row, rowIndex) => (
                  <tr key={`preview-row-${rowIndex}`}>
                    <th
                      className="sticky left-0 border-b border-line bg-white px-3 py-3 font-medium text-muted"
                      scope="row"
                    >
                      {rowIndex + 1}
                    </th>
                    {row.map((cell, cellIndex) => (
                      <td
                        className="max-w-[280px] border-b border-line px-3 py-3 align-top text-foreground"
                        key={`preview-cell-${rowIndex}-${cellIndex}`}
                      >
                        <span className="block break-words whitespace-pre-wrap">
                          {cell || content.preview.emptyCellLabel}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export function CsvExcelCleanerTool({content}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [workbook, setWorkbook] = useState<TabularWorkbook | null>(null);
  const [selectedSheetId, setSelectedSheetId] = useState("");
  const [options, setOptions] = useState<TabularCleanerOptions>(
    createInitialTabularCleanerOptions(),
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [loadErrorCode, setLoadErrorCode] = useState<TabularCleanerErrorCode | null>(null);
  const [actionErrorCode, setActionErrorCode] = useState<TabularCleanerErrorCode | null>(null);
  const [result, setResult] = useState<ReturnType<typeof applyTabularCleaner> | null>(null);
  const [isPreviewPending, startPreviewTransition] = useTransition();

  const selectedSheet =
    workbook?.sheets.find((sheet) => sheet.id === selectedSheetId) ?? workbook?.sheets[0] ?? null;
  const availableColumns = selectedSheet
    ? getTabularColumnDefinitions(selectedSheet, {
        hasHeaderRow: options.hasHeaderRow,
        trimCellWhitespace: options.trimCellWhitespace,
      })
    : [];
  const validationErrorCode =
    workbook && result && result.cleanedPreview.columns.length === 0
      ? "noColumnsSelected"
      : null;
  const canDownload =
    !!workbook &&
    !!selectedSheet &&
    !!result &&
    !isLoading &&
    !isDownloading &&
    !isPreviewPending &&
    !validationErrorCode;
  const noticeErrorCode = actionErrorCode ?? loadErrorCode ?? validationErrorCode;
  const activeStatusLabel = isLoading
    ? content.status.loading
    : isPreviewPending
      ? content.status.previewUpdating
      : content.status.ready;
  const cleanupToggleItems: Array<{
    key:
      | "trimCellWhitespace"
      | "removeEmptyRows"
      | "removeDuplicateRows"
      | "removeEmptyColumns";
    label: string;
  }> = [
    {
      key: "trimCellWhitespace",
      label: content.fields.trimCellWhitespaceLabel,
    },
    {
      key: "removeEmptyRows",
      label: content.fields.removeEmptyRowsLabel,
    },
    {
      key: "removeDuplicateRows",
      label: content.fields.removeDuplicateRowsLabel,
    },
    {
      key: "removeEmptyColumns",
      label: content.fields.removeEmptyColumnsLabel,
    },
  ];

  useEffect(() => {
    if (!selectedSheet) {
      setResult(null);
      return;
    }

    setActionErrorCode(null);

    startPreviewTransition(() => {
      try {
        setResult(applyTabularCleaner(selectedSheet, options));
      } catch (error) {
        setActionErrorCode(getErrorCode(error));
        setResult(null);
      }
    });
  }, [options, selectedSheet]);

  function clearMessages() {
    setLoadErrorCode(null);
    setActionErrorCode(null);
  }

  async function handleFileSelected(file: File) {
    clearMessages();
    setIsLoading(true);
    setWorkbook(null);
    setResult(null);

    try {
      const parsedWorkbook = await parseTabularFile(file);
      const nextOptions = createInitialTabularCleanerOptions(parsedWorkbook.format);
      const firstSheet = parsedWorkbook.sheets[0];
      const firstSheetColumns = getTabularColumnDefinitions(firstSheet, {
        hasHeaderRow: nextOptions.hasHeaderRow,
        trimCellWhitespace: nextOptions.trimCellWhitespace,
      });

      setWorkbook(parsedWorkbook);
      setSelectedSheetId(firstSheet.id);
      setOptions({
        ...nextOptions,
        selectedColumnIds: firstSheetColumns.map((column) => column.id),
      });
    } catch (error) {
      setLoadErrorCode(getErrorCode(error));
    } finally {
      setIsLoading(false);
    }
  }

  function handleIncomingFiles(incomingFiles: FileList | File[]) {
    const nextFile = Array.from(incomingFiles)[0];

    if (!nextFile) {
      return;
    }

    void handleFileSelected(nextFile);
  }

  function handleSheetChange(nextSheetId: string) {
    if (!workbook) {
      return;
    }

    const nextSheet = workbook.sheets.find((sheet) => sheet.id === nextSheetId);

    if (!nextSheet) {
      return;
    }

    clearMessages();
    setResult(null);
    setSelectedSheetId(nextSheetId);
    setOptions((current) => ({
      ...current,
      selectedColumnIds: getTabularColumnDefinitions(nextSheet, {
        hasHeaderRow: current.hasHeaderRow,
        trimCellWhitespace: current.trimCellWhitespace,
      }).map((column) => column.id),
    }));
  }

  async function handleDownload() {
    if (!workbook || !selectedSheet || !result || !canDownload) {
      return;
    }

    clearMessages();
    setIsDownloading(true);

    try {
      const download = await buildTabularDownload(workbook, selectedSheet, result, {
        outputFormat: options.outputFormat,
        textDelimiter: options.textDelimiter,
      });

      triggerBrowserDownload(download.blob, download.fileName);
    } catch (error) {
      setActionErrorCode(getErrorCode(error));
    } finally {
      setIsDownloading(false);
    }
  }

  function handleColumnSelection(nextSelectedIds: string[]) {
    clearMessages();
    setOptions((current) => ({
      ...current,
      selectedColumnIds: nextSelectedIds,
    }));
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(320px,400px)_minmax(0,1fr)]">
      <div className="space-y-5">
        <section className="space-y-4 rounded-[28px] border border-[#d2e2f5] bg-white/90 p-5">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold tracking-tight text-foreground">
              {content.dropzone.title}
            </h3>
            <p className="text-sm leading-7 text-muted sm:text-base">
              {content.dropzone.description}
            </p>
          </div>

          <input
            accept=".csv,.tsv,.xlsx,.xls,text/csv,text/tab-separated-values,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            aria-label={content.dropzone.title}
            className="sr-only"
            onChange={(event) => {
              if (!event.target.files?.length) {
                return;
              }

              const selectedFiles = [...event.target.files];

              handleIncomingFiles(selectedFiles);
              event.target.value = "";
            }}
            ref={inputRef}
            type="file"
          />

          <div
            className={cx(
              "rounded-[24px] border border-dashed px-5 py-8 text-center transition",
              isDragging ? "border-[#215da8] bg-[#eef5ff]" : "border-[#c9d9ed] bg-[#fbfdff]",
            )}
            onDragEnter={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(event) => {
              event.preventDefault();

              if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
                return;
              }

              setIsDragging(false);
            }}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragging(false);

              if (!event.dataTransfer.files.length) {
                return;
              }

              handleIncomingFiles(event.dataTransfer.files);
            }}
            role="presentation"
          >
            <p className="text-sm font-semibold text-foreground">
              {isDragging ? content.dropzone.activeLabel : content.dropzone.hint}
            </p>
            <div className="mt-4">
              <Button
                onClick={() => {
                  inputRef.current?.click();
                }}
                variant="secondary"
              >
                {content.dropzone.browseLabel}
              </Button>
            </div>
          </div>
        </section>

        <section className="space-y-5 rounded-[28px] border border-[#d2e2f5] bg-white/90 p-5">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold tracking-tight text-foreground">
              {content.sections.sourceSettings}
            </h3>
            <p className="text-sm leading-7 text-muted">{content.helper.headerNote}</p>
          </div>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-foreground">
              {content.fields.sheetLabel}
            </span>
            <select
              className="min-h-11 w-full rounded-[18px] border border-line bg-white px-3.5 text-sm text-foreground outline-none transition focus:border-[#9dbde3] focus:ring-4 focus:ring-[#215da8]/10 disabled:bg-[#f4f7fb] disabled:text-muted"
              disabled={!workbook || workbook.sheets.length <= 1}
              onChange={(event) => {
                handleSheetChange(event.target.value);
              }}
              value={selectedSheet?.id ?? ""}
            >
              {workbook?.sheets.map((sheet) => (
                <option key={sheet.id} value={sheet.id}>
                  {sheet.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex cursor-pointer items-start gap-3 rounded-[20px] border border-line bg-[#fbfdff] px-4 py-3">
            <input
              checked={options.hasHeaderRow}
              className="mt-1 h-4 w-4 rounded border-[#9ab5d6] text-[#215da8] focus:ring-[#215da8]"
              onChange={(event) => {
                clearMessages();
                setOptions((current) => ({
                  ...current,
                  hasHeaderRow: event.target.checked,
                }));
              }}
              type="checkbox"
            />
            <span className="text-sm leading-7 text-foreground">
              {content.fields.hasHeaderRowLabel}
            </span>
          </label>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-foreground">
                {content.fields.columnsLabel}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => {
                    handleColumnSelection(availableColumns.map((column) => column.id));
                  }}
                  size="sm"
                  variant="secondary"
                >
                  {content.actions.selectAllColumnsLabel}
                </Button>
                <Button
                  onClick={() => {
                    handleColumnSelection([]);
                  }}
                  size="sm"
                  variant="ghost"
                >
                  {content.actions.clearColumnSelectionLabel}
                </Button>
              </div>
            </div>

            <p className="text-xs leading-6 text-muted">{content.fields.columnsHint}</p>

            <div className="grid max-h-72 gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
              {availableColumns.map((column) => {
                const labels = getColumnLabel(column);

                return (
                  <label
                    className="flex cursor-pointer items-start gap-3 rounded-[20px] border border-line bg-[#fbfdff] px-4 py-3"
                    key={column.id}
                  >
                    <input
                      checked={options.selectedColumnIds.includes(column.id)}
                      className="mt-1 h-4 w-4 rounded border-[#9ab5d6] text-[#215da8] focus:ring-[#215da8]"
                      onChange={(event) => {
                        const nextSelectedIds = event.target.checked
                          ? [...options.selectedColumnIds, column.id]
                          : options.selectedColumnIds.filter((item) => item !== column.id);

                        handleColumnSelection(
                          availableColumns
                            .map((item) => item.id)
                            .filter((item) => nextSelectedIds.includes(item)),
                        );
                      }}
                      type="checkbox"
                    />
                    <span className="space-y-1 text-sm leading-7 text-foreground">
                      <span className="block break-words font-semibold">{labels.title}</span>
                      <span className="block text-xs leading-6 text-muted">
                        {labels.indexLabel}
                      </span>
                      <span className="block text-xs leading-6 text-muted">
                        {content.fields.nonEmptyCountLabel}: {column.nonEmptyCellCount}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </section>

        <section className="space-y-5 rounded-[28px] border border-[#d2e2f5] bg-white/90 p-5">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold tracking-tight text-foreground">
              {content.sections.cleanupOptions}
            </h3>
            <p className="text-sm leading-7 text-muted">{content.helper.localProcessingNote}</p>
          </div>

          <div className="space-y-3">
            {cleanupToggleItems.map((item) => (
              <label
                className="flex cursor-pointer items-start gap-3 rounded-[20px] border border-line bg-[#fbfdff] px-4 py-3"
                key={item.key}
              >
                <input
                  checked={options[item.key]}
                  className="mt-1 h-4 w-4 rounded border-[#9ab5d6] text-[#215da8] focus:ring-[#215da8]"
                  onChange={(event) => {
                    clearMessages();
                    setOptions((current) => ({
                      ...current,
                      [item.key]: event.target.checked,
                    }));
                  }}
                  type="checkbox"
                />
                <span className="text-sm leading-7 text-foreground">{item.label}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="space-y-5 rounded-[28px] border border-[#d2e2f5] bg-white/90 p-5">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold tracking-tight text-foreground">
              {content.sections.outputSettings}
            </h3>
            <p className="text-sm leading-7 text-muted">{content.helper.delimiterNote}</p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">
              {content.fields.outputFormatLabel}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex cursor-pointer items-start gap-3 rounded-[20px] border border-line bg-[#fbfdff] px-4 py-3">
                <input
                  checked={options.outputFormat === "csv"}
                  className="mt-1 h-4 w-4 rounded border-[#9ab5d6] text-[#215da8] focus:ring-[#215da8]"
                  onChange={() => {
                    clearMessages();
                    setOptions((current) => ({
                      ...current,
                      outputFormat: "csv",
                    }));
                  }}
                  type="radio"
                />
                <span className="text-sm leading-7 text-foreground">
                  {content.fields.outputFormatOptions.csv}
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3 rounded-[20px] border border-line bg-[#fbfdff] px-4 py-3">
                <input
                  checked={options.outputFormat === "xlsx"}
                  className="mt-1 h-4 w-4 rounded border-[#9ab5d6] text-[#215da8] focus:ring-[#215da8]"
                  onChange={() => {
                    clearMessages();
                    setOptions((current) => ({
                      ...current,
                      outputFormat: "xlsx",
                    }));
                  }}
                  type="radio"
                />
                <span className="text-sm leading-7 text-foreground">
                  {content.fields.outputFormatOptions.xlsx}
                </span>
              </label>
            </div>
          </div>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-foreground">
              {content.fields.textDelimiterLabel}
            </span>
            <select
              className="min-h-11 w-full rounded-[18px] border border-line bg-white px-3.5 text-sm text-foreground outline-none transition focus:border-[#9dbde3] focus:ring-4 focus:ring-[#215da8]/10 disabled:bg-[#f4f7fb] disabled:text-muted"
              disabled={options.outputFormat !== "csv"}
              onChange={(event) => {
                clearMessages();
                setOptions((current) => ({
                  ...current,
                  textDelimiter: event.target.value as TabularCleanerOptions["textDelimiter"],
                }));
              }}
              value={options.textDelimiter}
            >
              <option value="comma">{content.fields.textDelimiterOptions.comma}</option>
              <option value="tab">{content.fields.textDelimiterOptions.tab}</option>
            </select>
          </label>

          {noticeErrorCode ? (
            <Notice
              description={getErrorLabel(content, noticeErrorCode)}
              title={content.title}
              tone="warning"
            />
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button disabled={!canDownload} onClick={() => void handleDownload()}>
              {isDownloading ? content.actions.downloadingLabel : content.actions.downloadLabel}
            </Button>
            <Button
              onClick={() => {
                clearMessages();
                setWorkbook(null);
                setSelectedSheetId("");
                setResult(null);
                setIsDragging(false);
                setIsLoading(false);
                setIsDownloading(false);
                setOptions(createInitialTabularCleanerOptions());
              }}
              variant="secondary"
            >
              {content.actions.resetLabel}
            </Button>
          </div>
        </section>
      </div>

      <section className="space-y-5 rounded-[28px] border border-[#d2e2f5] bg-white/90 p-5">
        <div className="space-y-2 border-b border-line pb-4">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">
            {content.preview.title}
          </h3>
          <p className="text-sm leading-7 text-muted sm:text-base">{activeStatusLabel}</p>
        </div>

        {!workbook || !selectedSheet || !result ? (
          <EmptyState
            description={content.emptyState.description}
            title={content.emptyState.title}
          />
        ) : (
          <div className="space-y-5">
            <section className="space-y-4 rounded-[24px] border border-line bg-[#fbfdff] p-4">
              <h4 className="text-base font-semibold text-foreground">
                {content.sections.summary}
              </h4>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[18px] border border-[#d7e3f1] bg-white px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#215da8]">
                    {content.summary.fileLabel}
                  </p>
                  <p className="mt-1 break-words text-sm leading-7 text-foreground">
                    {workbook.file.name}
                  </p>
                </div>

                <div className="rounded-[18px] border border-[#d7e3f1] bg-white px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#215da8]">
                    {content.summary.detectedFormatLabel}
                  </p>
                  <p className="mt-1 text-sm leading-7 text-foreground">
                    {getDetectedFormatLabel(workbook.format)}
                  </p>
                </div>

                <div className="rounded-[18px] border border-[#d7e3f1] bg-white px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#215da8]">
                    {content.summary.sheetLabel}
                  </p>
                  <p className="mt-1 text-sm leading-7 text-foreground">
                    {selectedSheet.name}
                  </p>
                </div>

                <div className="rounded-[18px] border border-[#d7e3f1] bg-white px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#215da8]">
                    {content.summary.selectedColumnsLabel}
                  </p>
                  <p className="mt-1 text-sm leading-7 text-foreground">
                    {result.summary.selectedColumnCount}
                  </p>
                </div>

                <div className="rounded-[18px] border border-[#d7e3f1] bg-white px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#215da8]">
                    {content.summary.beforeRowsLabel}
                  </p>
                  <p className="mt-1 text-sm leading-7 text-foreground">
                    {result.summary.originalDataRowCount}
                  </p>
                </div>

                <div className="rounded-[18px] border border-[#d7e3f1] bg-white px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#215da8]">
                    {content.summary.afterRowsLabel}
                  </p>
                  <p className="mt-1 text-sm leading-7 text-foreground">
                    {result.summary.cleanedDataRowCount}
                  </p>
                </div>

                <div className="rounded-[18px] border border-[#d7e3f1] bg-white px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#215da8]">
                    {content.summary.beforeColumnsLabel}
                  </p>
                  <p className="mt-1 text-sm leading-7 text-foreground">
                    {result.summary.originalColumnCount}
                  </p>
                </div>

                <div className="rounded-[18px] border border-[#d7e3f1] bg-white px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#215da8]">
                    {content.summary.afterColumnsLabel}
                  </p>
                  <p className="mt-1 text-sm leading-7 text-foreground">
                    {result.summary.cleanedColumnCount}
                  </p>
                </div>

                <div className="rounded-[18px] border border-[#d7e3f1] bg-white px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#215da8]">
                    {content.summary.removedEmptyRowsLabel}
                  </p>
                  <p className="mt-1 text-sm leading-7 text-foreground">
                    {result.summary.removedEmptyRows}
                  </p>
                </div>

                <div className="rounded-[18px] border border-[#d7e3f1] bg-white px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#215da8]">
                    {content.summary.removedDuplicateRowsLabel}
                  </p>
                  <p className="mt-1 text-sm leading-7 text-foreground">
                    {result.summary.removedDuplicateRows}
                  </p>
                </div>

                <div className="rounded-[18px] border border-[#d7e3f1] bg-white px-4 py-3 sm:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#215da8]">
                    {content.summary.removedEmptyColumnsLabel}
                  </p>
                  <p className="mt-1 text-sm leading-7 text-foreground">
                    {result.summary.removedEmptyColumns}
                  </p>
                </div>
              </div>
            </section>

            <div className="grid gap-5 xl:grid-cols-2">
              <TabularPreviewCard
                content={content}
                table={result.originalPreview}
                title={content.preview.originalTitle}
              />
              <TabularPreviewCard
                content={content}
                table={result.cleanedPreview}
                title={content.preview.cleanedTitle}
              />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
