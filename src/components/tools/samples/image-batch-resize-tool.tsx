"use client";

import JSZip from "jszip";
import {useEffect, useRef, useState} from "react";

import type {
  ImageBatchOptions,
  ImageBatchPreviewItem,
  ImageBatchResizeOperationContent,
} from "@/content/tools/tool-types";
import {
  createInitialImageBatchOptions,
  finalizeImageBatchPreview,
  mergeUniqueImageFiles,
  processImageFile,
} from "@/lib/image-batch-processing";
import {Button} from "@/components/ui/button";
import {EmptyState} from "@/components/ui/empty-state";
import {Notice} from "@/components/ui/notice";
import {cx} from "@/lib/utils";

type Props = {
  content: ImageBatchResizeOperationContent;
};

function formatBytes(bytes?: number) {
  if (!bytes && bytes !== 0) {
    return "—";
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDimensions(
  dimensions?: {
    height: number;
    width: number;
  },
) {
  if (!dimensions) {
    return "—";
  }

  return `${dimensions.width} × ${dimensions.height}`;
}

function formatReductionRatio(ratio?: number) {
  if (ratio === undefined || !Number.isFinite(ratio)) {
    return "—";
  }

  return `${ratio >= 0 ? "-" : "+"}${Math.abs(ratio).toFixed(1)}%`;
}

function toDimensionValue(value: string) {
  if (!value.trim()) {
    return "";
  }

  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return "";
  }

  return Math.max(1, Math.round(numericValue));
}

function getErrorLabel(
  content: ImageBatchResizeOperationContent,
  preview: ImageBatchPreviewItem,
) {
  if (!preview.errorCode) {
    return "";
  }

  return content.validation[preview.errorCode];
}

export function ImageBatchResizeTool({content}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const runIdRef = useRef(0);
  const [files, setFiles] = useState<File[]>([]);
  const [options, setOptions] = useState<ImageBatchOptions>(
    createInitialImageBatchOptions(),
  );
  const [previews, setPreviews] = useState<ImageBatchPreviewItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  const readyPreviews = previews.filter(
    (
      preview,
    ): preview is ImageBatchPreviewItem & {
      outputFile: File;
      outputSizeBytes: number;
      reductionRatio: number;
    } => preview.status === "ready" && !!preview.outputFile,
  );
  const errorCount = previews.filter((preview) => preview.status === "error").length;
  const canDownload = readyPreviews.length > 0 && !isProcessing && !isDownloading;

  useEffect(() => {
    if (!files.length) {
      runIdRef.current += 1;
      setPreviews([]);
      setIsProcessing(false);
      setProcessedCount(0);
      return;
    }

    const runId = runIdRef.current + 1;
    runIdRef.current = runId;

    setIsProcessing(true);
    setProcessedCount(0);
    setPreviews(
      files.map((file) => ({
        file,
        originalSizeBytes: file.size,
        outputName: file.name,
        status: "processing" as const,
      })),
    );

    void (async () => {
      const processed: ImageBatchPreviewItem[] = [];

      for (const [index, file] of files.entries()) {
        const preview = await processImageFile(file, options);

        if (runIdRef.current !== runId) {
          return;
        }

        processed.push(preview);
        setProcessedCount(index + 1);
        setPreviews([
          ...processed,
          ...files.slice(index + 1).map((pendingFile) => ({
            file: pendingFile,
            originalSizeBytes: pendingFile.size,
            outputName: pendingFile.name,
            status: "processing" as const,
          })),
        ]);

        await new Promise<void>((resolve) => {
          window.setTimeout(resolve, 0);
        });
      }

      if (runIdRef.current !== runId) {
        return;
      }

      setPreviews(finalizeImageBatchPreview(processed));
      setIsProcessing(false);
    })();
  }, [files, options]);

  function handleFilesAdded(incomingFiles: FileList | File[]) {
    setDownloadError("");
    setFiles((currentFiles) => mergeUniqueImageFiles(currentFiles, incomingFiles));
  }

  async function handleDownloadZip() {
    if (!canDownload) {
      return;
    }

    setIsDownloading(true);
    setDownloadError("");

    try {
      const zip = new JSZip();

      for (const preview of readyPreviews) {
        zip.file(preview.outputName, preview.outputFile);
      }

      const blob = await zip.generateAsync({type: "blob"});
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = objectUrl;
      link.download = content.actions.zipFileName;
      link.click();

      URL.revokeObjectURL(objectUrl);
    } catch {
      setDownloadError(content.actions.downloadErrorLabel);
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(300px,390px)_minmax(0,1fr)]">
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
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            aria-label={content.dropzone.title}
            className="sr-only"
            multiple
            onChange={(event) => {
              if (!event.target.files?.length) {
                return;
              }

              const selectedFiles = [...event.target.files];

              handleFilesAdded(selectedFiles);
              event.target.value = "";
            }}
            ref={inputRef}
            type="file"
          />

          <div
            className={cx(
              "rounded-[24px] border border-dashed px-5 py-8 text-center transition",
              isDragging
                ? "border-[#215da8] bg-[#eef5ff]"
                : "border-[#c9d9ed] bg-[#fbfdff]",
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

              handleFilesAdded(event.dataTransfer.files);
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
              {content.progress.readyLabel}
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-[#eef4fb] px-3 py-1.5 text-sm text-foreground">
                {content.summary.selectedCountLabel}: {files.length}
              </span>
              <span className="rounded-full bg-[#eef9f1] px-3 py-1.5 text-sm text-foreground">
                {content.summary.successCountLabel}: {readyPreviews.length}
              </span>
              <span className="rounded-full bg-[#fff4e7] px-3 py-1.5 text-sm text-foreground">
                {content.summary.errorCountLabel}: {errorCount}
              </span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-foreground">
                {content.fields.widthLabel}
              </span>
              <input
                className="min-h-11 w-full rounded-[18px] border border-line bg-white px-3.5 text-sm text-foreground outline-none transition focus:border-[#9dbde3] focus:ring-4 focus:ring-[#215da8]/10"
                inputMode="numeric"
                onChange={(event) => {
                  setDownloadError("");
                  setOptions((current) => ({
                    ...current,
                    width: toDimensionValue(event.target.value),
                  }));
                }}
                placeholder={content.fields.widthPlaceholder}
                type="number"
                value={options.width}
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-foreground">
                {content.fields.heightLabel}
              </span>
              <input
                className="min-h-11 w-full rounded-[18px] border border-line bg-white px-3.5 text-sm text-foreground outline-none transition focus:border-[#9dbde3] focus:ring-4 focus:ring-[#215da8]/10"
                inputMode="numeric"
                onChange={(event) => {
                  setDownloadError("");
                  setOptions((current) => ({
                    ...current,
                    height: toDimensionValue(event.target.value),
                  }));
                }}
                placeholder={content.fields.heightPlaceholder}
                type="number"
                value={options.height}
              />
            </label>
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-[20px] border border-line bg-[#fbfdff] px-4 py-3">
            <input
              checked={options.keepAspectRatio}
              className="mt-1 h-4 w-4 rounded border-[#9ab5d6] text-[#215da8] focus:ring-[#215da8]"
              onChange={(event) => {
                setDownloadError("");
                setOptions((current) => ({
                  ...current,
                  keepAspectRatio: event.target.checked,
                }));
              }}
              type="checkbox"
            />
            <span className="text-sm leading-7 text-foreground">
              {content.fields.keepAspectRatioLabel}
            </span>
          </label>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">
              {content.fields.outputFormatLabel}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex cursor-pointer items-start gap-3 rounded-[20px] border border-line bg-[#fbfdff] px-4 py-3">
                <input
                  checked={options.outputFormat === "original"}
                  className="mt-1 h-4 w-4 rounded border-[#9ab5d6] text-[#215da8] focus:ring-[#215da8]"
                  onChange={() => {
                    setDownloadError("");
                    setOptions((current) => ({
                      ...current,
                      outputFormat: "original",
                    }));
                  }}
                  type="radio"
                />
                <span className="text-sm leading-7 text-foreground">
                  {content.fields.outputFormatOptions.original}
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3 rounded-[20px] border border-line bg-[#fbfdff] px-4 py-3">
                <input
                  checked={options.outputFormat === "webp"}
                  className="mt-1 h-4 w-4 rounded border-[#9ab5d6] text-[#215da8] focus:ring-[#215da8]"
                  onChange={() => {
                    setDownloadError("");
                    setOptions((current) => ({
                      ...current,
                      outputFormat: "webp",
                    }));
                  }}
                  type="radio"
                />
                <span className="text-sm leading-7 text-foreground">
                  {content.fields.outputFormatOptions.webp}
                </span>
              </label>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <label className="text-sm font-semibold text-foreground">
                {content.fields.qualityLabel}
              </label>
              <span className="rounded-full bg-[#eef4fb] px-3 py-1 text-sm font-semibold text-foreground">
                {options.quality}
              </span>
            </div>
            <input
              className="w-full accent-[#215da8]"
              max={100}
              min={1}
              onChange={(event) => {
                setDownloadError("");
                setOptions((current) => ({
                  ...current,
                  quality: Math.max(1, Math.min(100, Number(event.target.value))),
                }));
              }}
              type="range"
              value={options.quality}
            />
            <p className="text-xs leading-6 text-muted">{content.fields.qualityHint}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-foreground">
                {content.fields.prefixLabel}
              </span>
              <input
                className="min-h-11 w-full rounded-[18px] border border-line bg-white px-3.5 text-sm text-foreground outline-none transition focus:border-[#9dbde3] focus:ring-4 focus:ring-[#215da8]/10"
                onChange={(event) => {
                  setDownloadError("");
                  setOptions((current) => ({
                    ...current,
                    prefix: event.target.value,
                  }));
                }}
                placeholder={content.fields.prefixPlaceholder}
                value={options.prefix}
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-foreground">
                {content.fields.suffixLabel}
              </span>
              <input
                className="min-h-11 w-full rounded-[18px] border border-line bg-white px-3.5 text-sm text-foreground outline-none transition focus:border-[#9dbde3] focus:ring-4 focus:ring-[#215da8]/10"
                onChange={(event) => {
                  setDownloadError("");
                  setOptions((current) => ({
                    ...current,
                    suffix: event.target.value,
                  }));
                }}
                placeholder={content.fields.suffixPlaceholder}
                value={options.suffix}
              />
            </label>
          </div>

          <div className="space-y-3 rounded-[24px] border border-[#cfe0f5] bg-[#f6faff] px-4 py-4">
            <p className="text-sm leading-7 text-muted">{content.helper.webpDescription}</p>
            <p className="text-sm leading-7 text-muted">{content.helper.localProcessingNote}</p>
            <p className="text-sm leading-7 text-muted">{content.helper.qualityNote}</p>
            <p className="text-sm leading-7 text-muted">{content.helper.filenameRuleNote}</p>
          </div>

          {downloadError ? (
            <Notice description={downloadError} title={content.title} tone="warning" />
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button disabled={!canDownload} onClick={() => void handleDownloadZip()}>
              {isDownloading
                ? content.actions.downloadingZipLabel
                : content.actions.downloadZipLabel}
            </Button>
            <Button
              onClick={() => {
                runIdRef.current += 1;
                setDownloadError("");
                setFiles([]);
                setPreviews([]);
                setIsDragging(false);
                setIsProcessing(false);
                setProcessedCount(0);
                setIsDownloading(false);
                setOptions(createInitialImageBatchOptions());
              }}
              variant="secondary"
            >
              {content.actions.resetLabel}
            </Button>
          </div>
        </section>
      </div>

      <section className="rounded-[28px] border border-[#d2e2f5] bg-white/90 p-5">
        <div className="space-y-2 border-b border-line pb-4">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">
            {content.preview.title}
          </h3>
          <p className="text-sm leading-7 text-muted sm:text-base">
            {isProcessing
              ? `${content.progress.processingLabel} ${processedCount}/${files.length}`
              : content.progress.readyLabel}
          </p>
        </div>

        <div className="mt-5">
          {!files.length ? (
            <EmptyState
              description={content.emptyState.description}
              title={content.emptyState.title}
            />
          ) : (
            <div className="space-y-4">
              {previews.map((preview) => (
                <article
                  className="rounded-[24px] border border-line bg-[#fbfdff] p-4"
                  key={`${preview.file.name}-${preview.file.size}-${preview.file.lastModified}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span
                      className={cx(
                        "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                        preview.status === "ready" && "bg-[#e7f5ea] text-[#216b3b]",
                        preview.status === "processing" &&
                          "bg-[#eef4fb] text-[#215da8]",
                        preview.status === "error" && "bg-[#fff0df] text-[#9b5f16]",
                      )}
                    >
                      {preview.status === "ready"
                        ? content.status.ready
                        : preview.status === "processing"
                          ? content.status.processing
                          : content.status.error}
                    </span>
                    <p className="break-words text-sm font-medium text-foreground">
                      {preview.file.name}
                    </p>
                  </div>

                  <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_160px]">
                    <div className="space-y-1.5">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#215da8]">
                        {content.preview.originalInfoLabel}
                      </p>
                      <p className="break-words text-sm leading-7 text-muted">
                        {content.preview.originalNameLabel}: {preview.file.name}
                      </p>
                      <p className="text-sm leading-7 text-muted">
                        {formatDimensions(preview.originalDimensions)} /{" "}
                        {formatBytes(preview.originalSizeBytes)}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#215da8]">
                        {content.preview.outputInfoLabel}
                      </p>
                      <p className="break-words text-sm leading-7 text-foreground">
                        {content.preview.outputNameLabel}: {preview.outputName}
                      </p>
                      <p className="text-sm leading-7 text-muted">
                        {formatDimensions(preview.outputDimensions)} /{" "}
                        {formatBytes(preview.outputSizeBytes)}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#215da8]">
                        {content.preview.reductionLabel}
                      </p>
                      <p className="text-sm leading-7 text-foreground">
                        {formatReductionRatio(preview.reductionRatio)}
                      </p>
                    </div>
                  </div>

                  {preview.status === "error" ? (
                    <p className="mt-4 rounded-[18px] bg-[#fff4e7] px-3 py-2 text-sm leading-7 text-[#8d5515]">
                      {getErrorLabel(content, preview)}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
