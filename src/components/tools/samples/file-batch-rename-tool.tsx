"use client";

import JSZip from "jszip";
import {useRef, useState} from "react";

import type {
  FileBatchRenameOperationContent,
  FileBatchRenameOptions,
  ToolPreviewIssueCode,
} from "@/content/tools/tool-types";
import {
  buildFileRenamePreview,
  createInitialRenameOptions,
  mergeUniqueFiles,
} from "@/lib/file-batch-rename";
import {Button} from "@/components/ui/button";
import {EmptyState} from "@/components/ui/empty-state";
import {Notice} from "@/components/ui/notice";
import {cx} from "@/lib/utils";

type Props = {
  content: FileBatchRenameOperationContent;
};

function getIssueLabel(
  content: FileBatchRenameOperationContent,
  issue: ToolPreviewIssueCode,
) {
  return content.validation[issue];
}

function toPositiveInteger(value: number, fallback: number) {
  if (!Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(1, Math.floor(value));
}

export function FileBatchRenameTool({content}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const [options, setOptions] = useState<FileBatchRenameOptions>(
    createInitialRenameOptions(),
  );

  const previewItems = buildFileRenamePreview(files, options);
  const issueCount = previewItems.filter((item) => item.issues.length > 0).length;
  const readyCount = previewItems.length - issueCount;
  const canDownload = previewItems.length > 0 && issueCount === 0 && !isDownloading;

  function handleFilesAdded(incomingFiles: FileList | File[]) {
    setDownloadError("");
    setFiles((currentFiles) => mergeUniqueFiles(currentFiles, incomingFiles));
  }

  async function handleDownloadZip() {
    if (!canDownload) {
      return;
    }

    setIsDownloading(true);
    setDownloadError("");

    try {
      const zip = new JSZip();

      for (const item of previewItems) {
        zip.file(item.renamedName, item.file);
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
    <div className="grid gap-6 xl:grid-cols-[minmax(300px,380px)_minmax(0,1fr)]">
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
              {content.preview.title}
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-[#eef4fb] px-3 py-1.5 text-sm text-foreground">
                {content.summary.selectedCountLabel}: {previewItems.length}
              </span>
              <span className="rounded-full bg-[#eef9f1] px-3 py-1.5 text-sm text-foreground">
                {content.summary.readyCountLabel}: {readyCount}
              </span>
              <span className="rounded-full bg-[#fff4e7] px-3 py-1.5 text-sm text-foreground">
                {content.summary.issueCountLabel}: {issueCount}
              </span>
            </div>
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

            <label className="space-y-2">
              <span className="text-sm font-semibold text-foreground">
                {content.fields.findLabel}
              </span>
              <input
                className="min-h-11 w-full rounded-[18px] border border-line bg-white px-3.5 text-sm text-foreground outline-none transition focus:border-[#9dbde3] focus:ring-4 focus:ring-[#215da8]/10"
                onChange={(event) => {
                  setDownloadError("");
                  setOptions((current) => ({
                    ...current,
                    findText: event.target.value,
                  }));
                }}
                placeholder={content.fields.findPlaceholder}
                value={options.findText}
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-foreground">
                {content.fields.replaceLabel}
              </span>
              <input
                className="min-h-11 w-full rounded-[18px] border border-line bg-white px-3.5 text-sm text-foreground outline-none transition focus:border-[#9dbde3] focus:ring-4 focus:ring-[#215da8]/10"
                onChange={(event) => {
                  setDownloadError("");
                  setOptions((current) => ({
                    ...current,
                    replaceText: event.target.value,
                  }));
                }}
                placeholder={content.fields.replacePlaceholder}
                value={options.replaceText}
              />
            </label>

            <label className="space-y-2 sm:col-span-2">
              <span className="text-sm font-semibold text-foreground">
                {content.fields.sortOrderLabel}
              </span>
              <select
                className="min-h-11 w-full rounded-[18px] border border-line bg-white px-3.5 text-sm text-foreground outline-none transition focus:border-[#9dbde3] focus:ring-4 focus:ring-[#215da8]/10"
                onChange={(event) => {
                  setDownloadError("");
                  setOptions((current) => ({
                    ...current,
                    sortOrder: event.target.value as FileBatchRenameOptions["sortOrder"],
                  }));
                }}
                value={options.sortOrder}
              >
                <option value="nameAsc">
                  {content.fields.sortOrderOptions.nameAsc}
                </option>
                <option value="nameDesc">
                  {content.fields.sortOrderOptions.nameDesc}
                </option>
                <option value="added">
                  {content.fields.sortOrderOptions.added}
                </option>
              </select>
              <p className="text-xs leading-6 text-muted">
                {content.fields.sortOrderHint}
              </p>
            </label>
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-[20px] border border-line bg-[#fbfdff] px-4 py-3">
            <input
              checked={options.caseSensitiveReplace}
              className="mt-1 h-4 w-4 rounded border-[#9ab5d6] text-[#215da8] focus:ring-[#215da8]"
              onChange={(event) => {
                setDownloadError("");
                setOptions((current) => ({
                  ...current,
                  caseSensitiveReplace: event.target.checked,
                }));
              }}
              type="checkbox"
            />
            <span className="text-sm leading-7 text-foreground">
              {content.fields.caseSensitiveReplaceLabel}
            </span>
          </label>

          <fieldset className="space-y-4">
            <legend className="text-sm font-semibold text-foreground">
              {content.fields.numberingLabel}
            </legend>

            <label className="flex cursor-pointer items-start gap-3 rounded-[20px] border border-line bg-[#fbfdff] px-4 py-3">
              <input
                checked={options.sequenceEnabled}
                className="mt-1 h-4 w-4 rounded border-[#9ab5d6] text-[#215da8] focus:ring-[#215da8]"
                onChange={(event) => {
                  setDownloadError("");
                  setOptions((current) => ({
                    ...current,
                    sequenceEnabled: event.target.checked,
                  }));
                }}
                type="checkbox"
              />
              <span className="text-sm leading-7 text-foreground">
                {content.fields.numberingLabel}
              </span>
            </label>

            <div className="grid gap-4 sm:grid-cols-3">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-foreground">
                  {content.fields.numberingPositionLabel}
                </span>
                <select
                  className="min-h-11 w-full rounded-[18px] border border-line bg-white px-3.5 text-sm text-foreground outline-none transition focus:border-[#9dbde3] focus:ring-4 focus:ring-[#215da8]/10 disabled:bg-[#f4f7fb] disabled:text-muted"
                  disabled={!options.sequenceEnabled}
                  onChange={(event) => {
                    setDownloadError("");
                    setOptions((current) => ({
                      ...current,
                      sequencePosition: event.target.value as FileBatchRenameOptions["sequencePosition"],
                    }));
                  }}
                  value={options.sequencePosition}
                >
                  <option value="prefix">
                    {content.fields.numberingPositionOptions.prefix}
                  </option>
                  <option value="suffix">
                    {content.fields.numberingPositionOptions.suffix}
                  </option>
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-foreground">
                  {content.fields.digitsLabel}
                </span>
                <input
                  className="min-h-11 w-full rounded-[18px] border border-line bg-white px-3.5 text-sm text-foreground outline-none transition focus:border-[#9dbde3] focus:ring-4 focus:ring-[#215da8]/10 disabled:bg-[#f4f7fb] disabled:text-muted"
                  disabled={!options.sequenceEnabled}
                  min={1}
                  onChange={(event) => {
                    setDownloadError("");
                    setOptions((current) => ({
                      ...current,
                      digits: toPositiveInteger(Number(event.target.value), 1),
                    }));
                  }}
                  type="number"
                  value={options.digits}
                />
                <p className="text-xs leading-6 text-muted">
                  {content.fields.digitsHint}
                </p>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-foreground">
                  {content.fields.startNumberLabel}
                </span>
                <input
                  className="min-h-11 w-full rounded-[18px] border border-line bg-white px-3.5 text-sm text-foreground outline-none transition focus:border-[#9dbde3] focus:ring-4 focus:ring-[#215da8]/10 disabled:bg-[#f4f7fb] disabled:text-muted"
                  disabled={!options.sequenceEnabled}
                  min={1}
                  onChange={(event) => {
                    setDownloadError("");
                    setOptions((current) => ({
                      ...current,
                      startNumber: toPositiveInteger(Number(event.target.value), 1),
                    }));
                  }}
                  type="number"
                  value={options.startNumber}
                />
                <p className="text-xs leading-6 text-muted">
                  {content.fields.startNumberHint}
                </p>
              </label>
            </div>
          </fieldset>

          <div className="space-y-3 rounded-[24px] border border-[#cfe0f5] bg-[#f6faff] px-4 py-4">
            <p className="text-sm leading-7 text-muted">{content.helper.extensionNote}</p>
            <p className="text-sm leading-7 text-muted">{content.helper.ruleOrder}</p>
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
                setDownloadError("");
                setFiles([]);
                setIsDragging(false);
                setIsDownloading(false);
                setOptions(createInitialRenameOptions());
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
            {content.dropzone.hint}
          </p>
        </div>

        <div className="mt-5">
          {previewItems.length === 0 ? (
            <EmptyState
              description={content.emptyState.description}
              title={content.emptyState.title}
            />
          ) : (
            <div className="space-y-4">
              {previewItems.map((item) => (
                <article
                  className="rounded-[24px] border border-line bg-[#fbfdff] p-4"
                  key={`${item.file.name}-${item.sequenceNumber}-${item.file.lastModified}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span
                      className={cx(
                        "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                        item.issues.length === 0
                          ? "bg-[#e7f5ea] text-[#216b3b]"
                          : "bg-[#fff0df] text-[#9b5f16]",
                      )}
                    >
                      {item.issues.length === 0
                        ? content.status.ready
                        : content.status.issue}
                    </span>
                    {options.sequenceEnabled ? (
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#215da8]">
                        {String(item.sequenceNumber).padStart(options.digits, "0")}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#215da8]">
                        {content.preview.originalNameLabel}
                      </p>
                      <p className="break-words text-sm leading-7 text-muted">
                        {item.file.name}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#215da8]">
                        {content.preview.newNameLabel}
                      </p>
                      <p className="break-words text-sm leading-7 text-foreground">
                        {item.renamedName || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#215da8]">
                      {content.preview.issuesLabel}
                    </p>
                    {item.issues.length ? (
                      <div className="flex flex-wrap gap-2">
                        {item.issues.map((issue) => (
                          <span
                            className="rounded-full bg-[#fff4e7] px-3 py-1.5 text-xs font-medium text-[#8d5515]"
                            key={issue}
                          >
                            {getIssueLabel(content, issue)}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="rounded-full bg-[#eef9f1] px-3 py-1.5 text-xs font-medium text-[#216b3b]">
                        {content.status.ready}
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
