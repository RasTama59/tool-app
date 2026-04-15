"use client";

import {useRef, useState, type ReactNode} from "react";

import type {SubtitleShiftConvertOperationContent} from "@/content/tools/tool-types";
import type {
  SubtitleDocument,
  SubtitleErrorCode,
  SubtitleFormat,
  SubtitleShiftDirection,
  SubtitleShiftUnit,
} from "@/lib/subtitle-processing";
import {
  applySubtitleTransform,
  buildSubtitleDownload,
  formatSubtitleTimestamp,
  parseSubtitleFile,
  toSubtitleOffsetMs,
} from "@/lib/subtitle-processing";
import {Button} from "@/components/ui/button";
import {EmptyState} from "@/components/ui/empty-state";
import {Notice} from "@/components/ui/notice";
import {cx} from "@/lib/utils";

type Props = {
  content: SubtitleShiftConvertOperationContent;
};

type SubtitleToolOptions = {
  offsetDirection: SubtitleShiftDirection;
  offsetValue: string;
  outputFormat: SubtitleFormat;
  shiftUnit: SubtitleShiftUnit;
};

const previewTextareaClasses =
  "min-h-[280px] w-full rounded-[24px] border border-line bg-white px-4 py-4 text-sm leading-7 text-foreground outline-none transition focus:border-[#9dbde3] focus:ring-4 focus:ring-[#215da8]/10 sm:text-base";
const subtitleErrorCodes: SubtitleErrorCode[] = [
  "unsupportedFormat",
  "loadFailed",
  "emptyFile",
  "invalidFormat",
  "invalidTimestamp",
  "noCues",
];

function isSubtitleErrorCode(value: string): value is SubtitleErrorCode {
  return subtitleErrorCodes.includes(value as SubtitleErrorCode);
}

function getInitialOptions(format: SubtitleFormat = "srt"): SubtitleToolOptions {
  return {
    offsetDirection: "plus",
    offsetValue: "",
    outputFormat: format,
    shiftUnit: "seconds",
  };
}

function getErrorCode(error: unknown): SubtitleErrorCode {
  if (typeof error === "object" && error && "code" in error) {
    const code = String(error.code);

    if (isSubtitleErrorCode(code)) {
      return code;
    }
  }

  return "loadFailed";
}

function getErrorLabel(
  content: SubtitleShiftConvertOperationContent,
  errorCode: SubtitleErrorCode,
) {
  return content.validation[errorCode];
}

function triggerBrowserDownload(blob: Blob, fileName: string) {
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = objectUrl;
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(objectUrl);
}

function formatOffsetSummary(offsetMs: number) {
  const absoluteOffsetMs = Math.abs(offsetMs);

  if (absoluteOffsetMs >= 1000 && absoluteOffsetMs % 1000 === 0) {
    return `${offsetMs >= 0 ? "+" : "-"}${absoluteOffsetMs / 1000}s`;
  }

  return `${offsetMs >= 0 ? "+" : "-"}${absoluteOffsetMs}ms`;
}

function getCuePreviewText(textLines: string[]) {
  const previewText = textLines.join(" / ").trim();

  return previewText || "…";
}

function SummaryItem({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="rounded-[18px] border border-[#d7e3f1] bg-white px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#215da8]">
        {label}
      </p>
      <p className="mt-1 break-words text-sm leading-7 text-foreground">{value}</p>
    </div>
  );
}

export function SubtitleShiftConvertTool({content}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [documentState, setDocumentState] = useState<SubtitleDocument | null>(null);
  const [options, setOptions] = useState<SubtitleToolOptions>(getInitialOptions());
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [errorCode, setErrorCode] = useState<SubtitleErrorCode | null>(null);

  const offsetMs = toSubtitleOffsetMs(
    options.offsetDirection,
    options.offsetValue,
    options.shiftUnit,
  );
  const transformResult = documentState
    ? applySubtitleTransform(documentState, {
        offsetMs,
        outputFormat: options.outputFormat,
      })
    : null;
  const canDownload =
    !!documentState && !!transformResult && !isLoading && !isDownloading;
  const statusLabel = isLoading ? content.status.loading : content.status.ready;

  async function handleFileSelected(file: File) {
    setErrorCode(null);
    setIsLoading(true);
    setDocumentState(null);

    try {
      const parsedDocument = await parseSubtitleFile(file);

      setDocumentState(parsedDocument);
      setOptions(getInitialOptions(parsedDocument.format));
    } catch (error) {
      setErrorCode(getErrorCode(error));
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

  async function handleDownload() {
    if (!documentState || !transformResult || !canDownload) {
      return;
    }

    setErrorCode(null);
    setIsDownloading(true);

    try {
      const download = buildSubtitleDownload(documentState, transformResult);

      triggerBrowserDownload(download.blob, download.fileName);
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(320px,390px)_minmax(0,1fr)]">
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
            accept=".srt,.vtt,text/plain"
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
            onClick={() => {
              inputRef.current?.click();
            }}
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
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key !== "Enter" && event.key !== " ") {
                return;
              }

              event.preventDefault();
              inputRef.current?.click();
            }}
          >
            <p className="text-sm font-semibold text-foreground">
              {isDragging ? content.dropzone.activeLabel : content.dropzone.hint}
            </p>
            <div className="mt-4">
              <Button variant="secondary">{content.dropzone.browseLabel}</Button>
            </div>
          </div>
        </section>

        <section className="space-y-5 rounded-[28px] border border-[#d2e2f5] bg-white/90 p-5">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold tracking-tight text-foreground">
              {content.sections.timingShift}
            </h3>
            <p className="text-sm leading-7 text-muted">{content.helper.clampNote}</p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">
              {content.fields.offsetDirectionLabel}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex cursor-pointer items-start gap-3 rounded-[20px] border border-line bg-[#fbfdff] px-4 py-3">
                <input
                  checked={options.offsetDirection === "plus"}
                  className="mt-1 h-4 w-4 rounded border-[#9ab5d6] text-[#215da8] focus:ring-[#215da8]"
                  onChange={() => {
                    setOptions((current) => ({
                      ...current,
                      offsetDirection: "plus",
                    }));
                  }}
                  type="radio"
                />
                <span className="text-sm leading-7 text-foreground">
                  {content.fields.offsetDirectionOptions.plus}
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3 rounded-[20px] border border-line bg-[#fbfdff] px-4 py-3">
                <input
                  checked={options.offsetDirection === "minus"}
                  className="mt-1 h-4 w-4 rounded border-[#9ab5d6] text-[#215da8] focus:ring-[#215da8]"
                  onChange={() => {
                    setOptions((current) => ({
                      ...current,
                      offsetDirection: "minus",
                    }));
                  }}
                  type="radio"
                />
                <span className="text-sm leading-7 text-foreground">
                  {content.fields.offsetDirectionOptions.minus}
                </span>
              </label>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_180px]">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-foreground">
                {content.fields.offsetLabel}
              </span>
              <input
                className="min-h-11 w-full rounded-[18px] border border-line bg-white px-3.5 text-sm text-foreground outline-none transition focus:border-[#9dbde3] focus:ring-4 focus:ring-[#215da8]/10"
                inputMode="decimal"
                onChange={(event) => {
                  setOptions((current) => ({
                    ...current,
                    offsetValue: event.target.value,
                  }));
                }}
                placeholder={content.fields.offsetPlaceholder}
                type="number"
                value={options.offsetValue}
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-foreground">
                {content.fields.shiftUnitLabel}
              </span>
              <select
                className="min-h-11 w-full rounded-[18px] border border-line bg-white px-3.5 text-sm text-foreground outline-none transition focus:border-[#9dbde3] focus:ring-4 focus:ring-[#215da8]/10"
                onChange={(event) => {
                  setOptions((current) => ({
                    ...current,
                    shiftUnit: event.target.value as SubtitleShiftUnit,
                  }));
                }}
                value={options.shiftUnit}
              >
                <option value="seconds">
                  {content.fields.shiftUnitOptions.seconds}
                </option>
                <option value="milliseconds">
                  {content.fields.shiftUnitOptions.milliseconds}
                </option>
              </select>
            </label>
          </div>
        </section>

        <section className="space-y-5 rounded-[28px] border border-[#d2e2f5] bg-white/90 p-5">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold tracking-tight text-foreground">
              {content.sections.conversion}
            </h3>
            <p className="text-sm leading-7 text-muted">
              {content.helper.srtVttDifferenceNote}
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">
              {content.fields.outputFormatLabel}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex cursor-pointer items-start gap-3 rounded-[20px] border border-line bg-[#fbfdff] px-4 py-3">
                <input
                  checked={options.outputFormat === "srt"}
                  className="mt-1 h-4 w-4 rounded border-[#9ab5d6] text-[#215da8] focus:ring-[#215da8]"
                  onChange={() => {
                    setOptions((current) => ({
                      ...current,
                      outputFormat: "srt",
                    }));
                  }}
                  type="radio"
                />
                <span className="text-sm leading-7 text-foreground">
                  {content.fields.outputFormatOptions.srt}
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3 rounded-[20px] border border-line bg-[#fbfdff] px-4 py-3">
                <input
                  checked={options.outputFormat === "vtt"}
                  className="mt-1 h-4 w-4 rounded border-[#9ab5d6] text-[#215da8] focus:ring-[#215da8]"
                  onChange={() => {
                    setOptions((current) => ({
                      ...current,
                      outputFormat: "vtt",
                    }));
                  }}
                  type="radio"
                />
                <span className="text-sm leading-7 text-foreground">
                  {content.fields.outputFormatOptions.vtt}
                </span>
              </label>
            </div>
          </div>

          <div className="space-y-3 rounded-[24px] border border-[#cfe0f5] bg-[#f6faff] px-4 py-4">
            <p className="text-sm leading-7 text-muted">{content.helper.localProcessingNote}</p>
          </div>

          {errorCode ? (
            <Notice
              description={getErrorLabel(content, errorCode)}
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
                setErrorCode(null);
                setDocumentState(null);
                setOptions(getInitialOptions());
                setIsDragging(false);
                setIsLoading(false);
                setIsDownloading(false);
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
          <p className="text-sm leading-7 text-muted sm:text-base">{statusLabel}</p>
        </div>

        {!documentState || !transformResult ? (
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
                <SummaryItem
                  label={content.summary.fileLabel}
                  value={documentState.file.name}
                />
                <SummaryItem
                  label={content.summary.cueCountLabel}
                  value={documentState.cues.length}
                />
                <SummaryItem
                  label={content.summary.sourceFormatLabel}
                  value={documentState.format.toUpperCase()}
                />
                <SummaryItem
                  label={content.summary.outputFormatLabel}
                  value={transformResult.outputFormat.toUpperCase()}
                />
                <SummaryItem
                  label={content.summary.offsetLabel}
                  value={formatOffsetSummary(offsetMs)}
                />
                <SummaryItem
                  label={content.summary.clampedCueCountLabel}
                  value={transformResult.clampedCueCount}
                />
              </div>
            </section>

            <div className="grid gap-4 lg:grid-cols-2">
              <label className="space-y-3">
                <span className="text-sm font-semibold text-foreground">
                  {content.preview.originalTextTitle}
                </span>
                <textarea
                  className={previewTextareaClasses}
                  readOnly
                  value={documentState.rawText}
                />
              </label>

              <label className="space-y-3">
                <span className="text-sm font-semibold text-foreground">
                  {content.preview.processedTextTitle}
                </span>
                <textarea
                  className={previewTextareaClasses}
                  readOnly
                  value={transformResult.outputText}
                />
              </label>
            </div>

            <section className="space-y-4 rounded-[24px] border border-line bg-[#fbfdff] p-4">
              <div className="space-y-1.5">
                <h4 className="text-base font-semibold text-foreground">
                  {content.fields.timestampListLabel}
                </h4>
                <p className="text-sm leading-7 text-muted">
                  {content.helper.clampNote}
                </p>
              </div>

              <div className="max-h-[520px] overflow-y-auto pr-1">
                <div className="space-y-3">
                  {documentState.cues.map((cue, cueIndex) => {
                    const processedCue = transformResult.cues[cueIndex];

                    return (
                      <article
                        className="rounded-[20px] border border-line bg-white px-4 py-4"
                        key={cue.id}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-foreground">
                            #{cueIndex + 1}
                          </p>
                          <span className="rounded-full bg-[#eef4fb] px-3 py-1 text-xs font-semibold text-[#215da8]">
                            {documentState.format.toUpperCase()} →{" "}
                            {transformResult.outputFormat.toUpperCase()}
                          </span>
                        </div>

                        <div className="mt-4 grid gap-4 lg:grid-cols-2">
                          <div className="space-y-1.5">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#215da8]">
                              {content.preview.sourceTimingLabel}
                            </p>
                            <p className="text-sm leading-7 text-foreground">
                              {content.fields.startLabel}:{" "}
                              {formatSubtitleTimestamp(cue.startMs, documentState.format)}
                            </p>
                            <p className="text-sm leading-7 text-foreground">
                              {content.fields.endLabel}:{" "}
                              {formatSubtitleTimestamp(cue.endMs, documentState.format)}
                            </p>
                          </div>

                          <div className="space-y-1.5">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#215da8]">
                              {content.preview.processedTimingLabel}
                            </p>
                            <p className="text-sm leading-7 text-foreground">
                              {content.fields.startLabel}:{" "}
                              {formatSubtitleTimestamp(
                                processedCue.startMs,
                                transformResult.outputFormat,
                              )}
                            </p>
                            <p className="text-sm leading-7 text-foreground">
                              {content.fields.endLabel}:{" "}
                              {formatSubtitleTimestamp(
                                processedCue.endMs,
                                transformResult.outputFormat,
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 space-y-1.5">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#215da8]">
                            {content.fields.cueTextLabel}
                          </p>
                          <p className="break-words text-sm leading-7 text-foreground">
                            {getCuePreviewText(cue.textLines)}
                          </p>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>
        )}
      </section>
    </div>
  );
}
