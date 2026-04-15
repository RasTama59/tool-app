import type {ToolOperationContent} from "@/content/tools/tool-types";

import {CsvExcelCleanerTool} from "@/components/tools/samples/csv-excel-cleaner-tool";
import {FileBatchRenameTool} from "@/components/tools/samples/file-batch-rename-tool";
import {ImageBatchResizeTool} from "@/components/tools/samples/image-batch-resize-tool";
import {PdfPageOrganizerTool} from "@/components/tools/samples/pdf-page-organizer-tool";
import {SubtitleShiftConvertTool} from "@/components/tools/samples/subtitle-shift-convert-tool";
import {TextCleanupTool} from "@/components/tools/samples/text-cleanup-tool";
import {Card} from "@/components/ui/card";

type Props = {
  operation: ToolOperationContent;
};

export function ToolOperationPanel({operation}: Props) {
  return (
    <Card className="p-6 sm:p-8" tone="accent">
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            {operation.ui.title}
          </h2>
          <p className="max-w-3xl text-sm leading-7 text-muted sm:text-base">
            {operation.ui.description}
          </p>
        </div>

        {operation.kind === "fileBatchRename" ? (
          <FileBatchRenameTool content={operation.ui} />
        ) : null}

        {operation.kind === "tabularCleaner" ? (
          <CsvExcelCleanerTool content={operation.ui} />
        ) : null}

        {operation.kind === "imageBatchResize" ? (
          <ImageBatchResizeTool content={operation.ui} />
        ) : null}

        {operation.kind === "pdfPageOrganizer" ? (
          <PdfPageOrganizerTool content={operation.ui} />
        ) : null}

        {operation.kind === "subtitleShiftConvert" ? (
          <SubtitleShiftConvertTool content={operation.ui} />
        ) : null}

        {operation.kind === "textCleanup" ? (
          <TextCleanupTool content={operation.ui} />
        ) : null}
      </div>
    </Card>
  );
}
