"use client";

import {useEffect, useRef, useState} from "react";

import type {PdfPageOrganizerOperationContent} from "@/content/tools/tool-types";
import type {
  PdfOrganizerDocument,
  PdfOrganizerErrorCode,
  PdfPageItem,
  PdfSourceDocument,
} from "@/lib/pdf-page-organizer";
import {
  buildOrganizedPdf,
  buildSplitPdfArchive,
  movePdfPageItems,
  parsePdfFiles,
  removePdfPages,
  setPdfPageSelection,
  togglePdfPageSelection,
} from "@/lib/pdf-page-organizer";
import {createPdfPreviewStore, type PdfPreviewStore} from "@/lib/pdf-page-preview";
import {Button} from "@/components/ui/button";
import {EmptyState} from "@/components/ui/empty-state";
import {Notice} from "@/components/ui/notice";
import {cx} from "@/lib/utils";

type Props = {
  content: PdfPageOrganizerOperationContent;
};

type ThumbnailProps = {
  currentPageNumber: number;
  page: PdfPageItem;
  previewStore: PdfPreviewStore;
  renderingLabel: string;
  sourceDocument: PdfSourceDocument;
};

const pdfErrorCodes: PdfOrganizerErrorCode[] = [
  "unsupportedFormat",
  "loadFailed",
  "emptyFile",
  "exportFailed",
  "noPagesRemaining",
  "invalidSplitRange",
  "noSplitTargets",
];

function isPdfErrorCode(value: string): value is PdfOrganizerErrorCode {
  return pdfErrorCodes.includes(value as PdfOrganizerErrorCode);
}

function getErrorCode(error: unknown): PdfOrganizerErrorCode {
  if (typeof error === "object" && error && "code" in error) {
    const code = String(error.code);

    if (isPdfErrorCode(code)) {
      return code;
    }
  }

  return "loadFailed";
}

function getErrorLabel(
  content: PdfPageOrganizerOperationContent,
  errorCode: PdfOrganizerErrorCode,
) {
  return content.validation[errorCode];
}

function formatPageSize(page: PdfPageItem) {
  return `${page.width} × ${page.height} pt`;
}

function triggerBrowserDownload(blob: Blob, fileName: string) {
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = objectUrl;
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(objectUrl);
}

function SummaryItem({
  label,
  value,
}: {
  label: string;
  value: number | string;
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

function PdfPageThumbnail({
  currentPageNumber,
  page,
  previewStore,
  renderingLabel,
  sourceDocument,
}: ThumbnailProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");

  useEffect(() => {
    const currentWrapper = wrapperRef.current;

    if (!currentWrapper) {
      return;
    }

    let isCancelled = false;

    const observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries.some((entry) => entry.isIntersecting);

        if (!isVisible) {
          return;
        }

        observer.disconnect();
        setStatus("loading");

        void (async () => {
          try {
            if (!canvasRef.current) {
              return;
            }

            await previewStore.renderPage(
              sourceDocument.id,
              sourceDocument.sourceBytes,
              page.originalIndex + 1,
              canvasRef.current,
            );

            if (!isCancelled) {
              setStatus("ready");
            }
          } catch {
            if (!isCancelled) {
              setStatus("error");
            }
          }
        })();
      },
      {
        rootMargin: "180px",
      },
    );

    observer.observe(currentWrapper);

    return () => {
      isCancelled = true;
      observer.disconnect();
    };
  }, [page.id, page.originalIndex, previewStore, sourceDocument.id, sourceDocument.sourceBytes]);

  return (
    <div className="flex items-center justify-center rounded-[20px] border border-[#d7e3f1] bg-white px-4 py-4">
      <div
        className="relative flex min-h-[130px] w-full max-w-[150px] items-center justify-center overflow-hidden rounded-[16px] border border-[#cfe0f5] bg-[linear-gradient(180deg,#ffffff_0%,#f4f8ff_100%)] shadow-[0_12px_24px_rgba(33,93,168,0.08)]"
        ref={wrapperRef}
      >
        <canvas
          className={cx("h-auto max-h-[190px] w-auto max-w-full", status !== "ready" && "hidden")}
          ref={canvasRef}
        />

        {status !== "ready" ? (
          <div className="pointer-events-none flex flex-col items-center justify-center gap-1 px-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#215da8]">
              PDF
            </p>
            <p className="text-2xl font-semibold text-foreground">{currentPageNumber}</p>
            <p className="text-[11px] leading-5 text-muted">
              {status === "loading" ? renderingLabel : sourceDocument.pageCount > 1 ? sourceDocument.file.name : ""}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function PdfPageOrganizerTool({content}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const previewStoreRef = useRef(createPdfPreviewStore());
  const [documentState, setDocumentState] = useState<PdfOrganizerDocument | null>(null);
  const [pages, setPages] = useState<PdfPageItem[]>([]);
  const [splitRangeInput, setSplitRangeInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [draggingPageId, setDraggingPageId] = useState<string | null>(null);
  const [dragOverPageId, setDragOverPageId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSplitting, setIsSplitting] = useState(false);
  const [errorCode, setErrorCode] = useState<PdfOrganizerErrorCode | null>(null);

  useEffect(() => {
    return () => {
      void previewStoreRef.current.destroy();
    };
  }, []);

  const selectedCount = pages.filter((page) => page.isSelected).length;
  const removedCount = documentState ? documentState.originalPageCount - pages.length : 0;
  const sourceCount = documentState?.sourceDocuments.length ?? 0;
  const noticeErrorCode =
    errorCode ?? (documentState && pages.length === 0 ? "noPagesRemaining" : null);
  const canDownload =
    !!documentState && pages.length > 0 && !isLoading && !isDownloading && !isSplitting;
  const canSplit =
    !!documentState &&
    pages.length > 0 &&
    splitRangeInput.trim().length > 0 &&
    !isLoading &&
    !isDownloading &&
    !isSplitting;
  const statusLabel = isLoading ? content.status.loading : content.status.ready;
  const sourceDocumentMap = new Map(
    documentState?.sourceDocuments.map((sourceDocument) => [
      sourceDocument.id,
      sourceDocument,
    ]) ?? [],
  );

  function resetPreviewStore() {
    const currentStore = previewStoreRef.current;

    previewStoreRef.current = createPdfPreviewStore();
    void currentStore.destroy();
  }

  function resetWorkspace() {
    resetPreviewStore();
    setErrorCode(null);
    setDocumentState(null);
    setPages([]);
    setSplitRangeInput("");
    setIsDragging(false);
    setDraggingPageId(null);
    setDragOverPageId(null);
    setIsLoading(false);
    setIsDownloading(false);
    setIsSplitting(false);
  }

  async function handleFilesSelected(files: File[]) {
    resetPreviewStore();
    setErrorCode(null);
    setIsLoading(true);
    setDocumentState(null);
    setPages([]);
    setSplitRangeInput("");
    setDraggingPageId(null);
    setDragOverPageId(null);

    try {
      const parsedDocument = await parsePdfFiles(files);

      setDocumentState(parsedDocument);
      setPages(parsedDocument.pages);
    } catch (error) {
      setErrorCode(getErrorCode(error));
    } finally {
      setIsLoading(false);
    }
  }

  function handleIncomingFiles(incomingFiles: FileList | File[]) {
    const nextFiles = Array.from(incomingFiles).filter((file) => file.size > 0);

    if (!nextFiles.length) {
      setErrorCode("emptyFile");
      return;
    }

    void handleFilesSelected(nextFiles);
  }

  function handleMovePage(pageId: string, direction: "up" | "down") {
    setErrorCode(null);
    setPages((currentPages) => {
      const pageIndex = currentPages.findIndex((page) => page.id === pageId);

      if (pageIndex === -1) {
        return currentPages;
      }

      const nextIndex = direction === "up" ? pageIndex - 1 : pageIndex + 1;

      return movePdfPageItems(currentPages, pageIndex, nextIndex);
    });
  }

  function handleDeletePages(pageIds: string[]) {
    setErrorCode(null);
    setPages((currentPages) => removePdfPages(currentPages, pageIds));
  }

  async function handleDownload() {
    if (!documentState || !canDownload) {
      return;
    }

    setErrorCode(null);
    setIsDownloading(true);

    try {
      const download = await buildOrganizedPdf(documentState, pages);

      triggerBrowserDownload(download.blob, download.fileName);
    } catch (error) {
      setErrorCode(getErrorCode(error));
    } finally {
      setIsDownloading(false);
    }
  }

  async function handleSplitDownload() {
    if (!documentState || !canSplit) {
      return;
    }

    setErrorCode(null);
    setIsSplitting(true);

    try {
      const archive = await buildSplitPdfArchive(
        documentState,
        pages,
        splitRangeInput,
      );

      triggerBrowserDownload(archive.blob, archive.fileName);
    } catch (error) {
      setErrorCode(getErrorCode(error));
    } finally {
      setIsSplitting(false);
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
            accept=".pdf,application/pdf"
            aria-label={content.dropzone.title}
            className="sr-only"
            multiple
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
              {content.sections.controls}
            </h3>
            <p className="text-sm leading-7 text-muted">{content.helper.reorderNote}</p>
          </div>

          <div className="space-y-3 rounded-[24px] border border-[#cfe0f5] bg-[#f6faff] px-4 py-4">
            <p className="text-sm leading-7 text-muted">{content.helper.mergeNote}</p>
            <p className="text-sm leading-7 text-muted">{content.helper.localProcessingNote}</p>
            <p className="text-sm leading-7 text-muted">{content.helper.mobileNote}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              disabled={!pages.length}
              onClick={() => {
                setErrorCode(null);
                setPages((currentPages) =>
                  setPdfPageSelection(
                    currentPages,
                    currentPages.map((page) => page.id),
                    true,
                  ),
                );
              }}
              size="sm"
              variant="secondary"
            >
              {content.actions.selectAllLabel}
            </Button>
            <Button
              disabled={!selectedCount}
              onClick={() => {
                setErrorCode(null);
                setPages((currentPages) =>
                  setPdfPageSelection(
                    currentPages,
                    currentPages.map((page) => page.id),
                    false,
                  ),
                );
              }}
              size="sm"
              variant="ghost"
            >
              {content.actions.clearSelectionLabel}
            </Button>
            <Button
              disabled={!selectedCount}
              onClick={() => {
                handleDeletePages(
                  pages.filter((page) => page.isSelected).map((page) => page.id),
                );
              }}
              size="sm"
              variant="secondary"
            >
              {content.actions.deleteSelectedLabel}
            </Button>
          </div>

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
            <Button onClick={resetWorkspace} variant="secondary">
              {content.actions.resetLabel}
            </Button>
          </div>
        </section>

        <section className="space-y-5 rounded-[28px] border border-[#d2e2f5] bg-white/90 p-5">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold tracking-tight text-foreground">
              {content.sections.split}
            </h3>
            <p className="text-sm leading-7 text-muted">{content.helper.splitNote}</p>
          </div>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-foreground">
              {content.fields.splitRangeLabel}
            </span>
            <input
              className="w-full rounded-[18px] border border-[#cfe0f5] bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-[#9dbde3] focus:ring-4 focus:ring-[#215da8]/10"
              onChange={(event) => {
                setSplitRangeInput(event.target.value);
              }}
              placeholder={content.fields.splitRangePlaceholder}
              type="text"
              value={splitRangeInput}
            />
          </label>

          <Button disabled={!canSplit} onClick={() => void handleSplitDownload()}>
            {isSplitting ? content.actions.splittingLabel : content.actions.splitDownloadLabel}
          </Button>
        </section>
      </div>

      <section className="space-y-5 rounded-[28px] border border-[#d2e2f5] bg-white/90 p-5">
        <div className="space-y-2 border-b border-line pb-4">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">
            {content.preview.title}
          </h3>
          <p className="text-sm leading-7 text-muted sm:text-base">{statusLabel}</p>
        </div>

        {!documentState ? (
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
                <div className="rounded-[18px] border border-[#d7e3f1] bg-white px-4 py-3 sm:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#215da8]">
                    {content.summary.fileLabel}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {documentState.sourceDocuments.map((sourceDocument) => (
                      <span
                        className="rounded-full border border-[#d5e4f4] bg-[#f5f9ff] px-3 py-1 text-xs text-foreground"
                        key={sourceDocument.id}
                      >
                        {sourceDocument.file.name}
                      </span>
                    ))}
                  </div>
                </div>

                <SummaryItem
                  label={content.summary.sourceCountLabel}
                  value={sourceCount}
                />
                <SummaryItem
                  label={content.summary.originalCountLabel}
                  value={documentState.originalPageCount}
                />
                <SummaryItem
                  label={content.summary.currentCountLabel}
                  value={pages.length}
                />
                <SummaryItem
                  label={content.summary.selectedCountLabel}
                  value={selectedCount}
                />
                <SummaryItem
                  label={content.summary.removedCountLabel}
                  value={removedCount}
                />
              </div>
            </section>

            {!pages.length ? (
              <div className="rounded-[24px] border border-dashed border-[#d7e3f1] bg-[#fbfdff] px-5 py-10 text-center text-sm leading-7 text-muted">
                {content.validation.noPagesRemaining}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">
                    {content.fields.pageListLabel}
                  </p>
                  <p className="text-xs leading-6 text-muted">
                    {content.preview.dragHintLabel}
                  </p>
                </div>

                <ol className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {pages.map((page, index) => {
                    const sourceDocument = sourceDocumentMap.get(page.sourceDocumentId);

                    if (!sourceDocument) {
                      return null;
                    }

                    return (
                      <li
                        className={cx(
                          "rounded-[24px] border border-line bg-[#fbfdff] p-4 transition",
                          page.isSelected && "border-[#8fb1da] bg-[#f5f9ff]",
                          draggingPageId === page.id && "opacity-60",
                          dragOverPageId === page.id && "border-[#215da8] ring-2 ring-[#215da8]/15",
                        )}
                        draggable
                        key={page.id}
                        onDragEnd={() => {
                          setDraggingPageId(null);
                          setDragOverPageId(null);
                        }}
                        onDragEnter={(event) => {
                          event.preventDefault();

                          if (!draggingPageId || draggingPageId === page.id) {
                            return;
                          }

                          setDragOverPageId(page.id);
                        }}
                        onDragOver={(event) => {
                          event.preventDefault();
                        }}
                        onDragStart={() => {
                          setDraggingPageId(page.id);
                          setDragOverPageId(page.id);
                        }}
                        onDrop={(event) => {
                          event.preventDefault();

                          if (!draggingPageId) {
                            return;
                          }

                          const fromIndex = pages.findIndex((item) => item.id === draggingPageId);
                          const toIndex = pages.findIndex((item) => item.id === page.id);

                          setErrorCode(null);
                          setPages((currentPages) =>
                            movePdfPageItems(currentPages, fromIndex, toIndex),
                          );
                          setDraggingPageId(null);
                          setDragOverPageId(null);
                        }}
                      >
                        <div className="space-y-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#215da8]">
                                {content.fields.currentPageLabel}
                              </p>
                              <h4 className="text-lg font-semibold text-foreground">
                                {index + 1}
                              </h4>
                            </div>

                            <span
                              className={cx(
                                "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                                page.isSelected
                                  ? "bg-[#e7f1ff] text-[#215da8]"
                                  : "bg-[#eef4fb] text-muted",
                              )}
                            >
                              {page.isSelected
                                ? content.preview.selectedLabel
                                : content.preview.emptyLabel}
                            </span>
                          </div>

                          <PdfPageThumbnail
                            currentPageNumber={index + 1}
                            page={page}
                            previewStore={previewStoreRef.current}
                            renderingLabel={content.preview.renderingLabel}
                            sourceDocument={sourceDocument}
                          />

                          <div className="space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#215da8]">
                              {content.fields.pageInfoLabel}
                            </p>
                            <div className="space-y-2 text-sm leading-7 text-foreground">
                              <p>
                                {content.fields.sourceFileLabel}: {page.sourceFileName}
                              </p>
                              <p>
                                {content.fields.originalPageLabel}: {page.originalIndex + 1}
                              </p>
                              <p>
                                {content.fields.pageSizeLabel}: {formatPageSize(page)}
                              </p>
                              <p>
                                {content.fields.rotationLabel}: {page.rotation}°
                              </p>
                            </div>
                          </div>

                          <div className="grid gap-2 sm:grid-cols-2">
                            <Button
                              onClick={() => {
                                setErrorCode(null);
                                setPages((currentPages) =>
                                  togglePdfPageSelection(
                                    currentPages,
                                    page.id,
                                    !page.isSelected,
                                  ),
                                );
                              }}
                              size="sm"
                              variant="secondary"
                            >
                              {content.fields.selectPageLabel}
                            </Button>
                            <Button
                              onClick={() => {
                                handleDeletePages([page.id]);
                              }}
                              size="sm"
                              variant="ghost"
                            >
                              {content.fields.deletePageLabel}
                            </Button>
                          </div>

                          <div className="grid gap-2 sm:grid-cols-2">
                            <Button
                              disabled={index === 0}
                              onClick={() => {
                                handleMovePage(page.id, "up");
                              }}
                              size="sm"
                              variant="ghost"
                            >
                              {content.fields.moveUpLabel}
                            </Button>
                            <Button
                              disabled={index === pages.length - 1}
                              onClick={() => {
                                handleMovePage(page.id, "down");
                              }}
                              size="sm"
                              variant="ghost"
                            >
                              {content.fields.moveDownLabel}
                            </Button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
