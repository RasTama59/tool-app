"use client";

import {useEffect, useState} from "react";

import type {TextCleanupOperationContent} from "@/content/tools/tool-types";
import {Button} from "@/components/ui/button";

type Props = {
  content: TextCleanupOperationContent;
};

type CleanupOptions = {
  collapseBlankLines: boolean;
  normalizeBullets: boolean;
  trimLineEdges: boolean;
};

const defaultOptions: CleanupOptions = {
  collapseBlankLines: true,
  normalizeBullets: true,
  trimLineEdges: true,
};

const bulletPattern = /^[・•●○▪■◦‣⁃∙*-]\s*(.+)$/u;

function normalizeBulletLine(line: string) {
  const trimmed = line.trim();
  const match = bulletPattern.exec(trimmed);

  if (!match) {
    return trimmed;
  }

  return `- ${match[1].trim()}`;
}

function cleanupText(source: string, options: CleanupOptions) {
  const normalizedSource = source.replace(/\r\n?/g, "\n");

  if (!normalizedSource) {
    return "";
  }

  let lines = normalizedSource.split("\n").map((line) => {
    if (options.trimLineEdges) {
      return line.trim();
    }

    return line;
  });

  if (options.normalizeBullets) {
    lines = lines.map((line) => normalizeBulletLine(line));
  }

  if (options.collapseBlankLines) {
    const collapsedLines: string[] = [];
    let previousWasBlank = false;

    for (const line of lines) {
      const isBlank = line.trim().length === 0;

      if (isBlank) {
        if (previousWasBlank) {
          continue;
        }

        collapsedLines.push("");
        previousWasBlank = true;
        continue;
      }

      collapsedLines.push(line);
      previousWasBlank = false;
    }

    lines = collapsedLines;
  }

  return lines.join("\n");
}

export function TextCleanupTool({content}: Props) {
  const [sourceText, setSourceText] = useState("");
  const [options, setOptions] = useState(defaultOptions);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");

  const outputText = cleanupText(sourceText, options);

  useEffect(() => {
    if (copyStatus === "idle") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setCopyStatus("idle");
    }, 2200);

    return () => window.clearTimeout(timeoutId);
  }, [copyStatus]);

  async function handleCopy() {
    if (!outputText) {
      return;
    }

    try {
      await navigator.clipboard.writeText(outputText);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_310px]">
      <div className="grid gap-4 lg:grid-cols-2">
        <label className="space-y-3">
          <span className="text-sm font-semibold text-foreground">
            {content.inputLabel}
          </span>
          <textarea
            className="min-h-[280px] w-full rounded-[26px] border border-line bg-white px-4 py-4 text-sm leading-7 text-foreground outline-none transition focus:border-[#9dbde3] focus:ring-4 focus:ring-[#215da8]/10 sm:text-base"
            onChange={(event) => {
              setCopyStatus("idle");
              setSourceText(event.target.value);
            }}
            placeholder={content.inputPlaceholder}
            value={sourceText}
          />
        </label>

        <label className="space-y-3">
          <span className="text-sm font-semibold text-foreground">
            {content.outputLabel}
          </span>
          <textarea
            className="min-h-[280px] w-full rounded-[26px] border border-[#d2e2f5] bg-[#f8fbff] px-4 py-4 text-sm leading-7 text-foreground outline-none sm:text-base"
            placeholder={content.outputPlaceholder}
            readOnly
            value={outputText}
          />
        </label>
      </div>

      <div className="space-y-5 rounded-[28px] border border-[#d2e2f5] bg-white/88 p-5">
        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold text-foreground">
            {content.optionsLegend}
          </legend>

          <label className="flex cursor-pointer items-start gap-3 rounded-[22px] border border-line bg-[#fbfdff] px-4 py-3">
            <input
              checked={options.trimLineEdges}
              className="mt-1 h-4 w-4 rounded border-[#9ab5d6] text-[#215da8] focus:ring-[#215da8]"
              onChange={(event) => {
                setCopyStatus("idle");
                setOptions((current) => ({
                  ...current,
                  trimLineEdges: event.target.checked,
                }));
              }}
              type="checkbox"
            />
            <span className="text-sm leading-7 text-foreground">
              {content.options.trimLineEdges}
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-3 rounded-[22px] border border-line bg-[#fbfdff] px-4 py-3">
            <input
              checked={options.collapseBlankLines}
              className="mt-1 h-4 w-4 rounded border-[#9ab5d6] text-[#215da8] focus:ring-[#215da8]"
              onChange={(event) => {
                setCopyStatus("idle");
                setOptions((current) => ({
                  ...current,
                  collapseBlankLines: event.target.checked,
                }));
              }}
              type="checkbox"
            />
            <span className="text-sm leading-7 text-foreground">
              {content.options.collapseBlankLines}
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-3 rounded-[22px] border border-line bg-[#fbfdff] px-4 py-3">
            <input
              checked={options.normalizeBullets}
              className="mt-1 h-4 w-4 rounded border-[#9ab5d6] text-[#215da8] focus:ring-[#215da8]"
              onChange={(event) => {
                setCopyStatus("idle");
                setOptions((current) => ({
                  ...current,
                  normalizeBullets: event.target.checked,
                }));
              }}
              type="checkbox"
            />
            <span className="text-sm leading-7 text-foreground">
              {content.options.normalizeBullets}
            </span>
          </label>
        </fieldset>

        <div className="flex flex-wrap gap-3">
          <Button disabled={!outputText} onClick={() => void handleCopy()}>
            {copyStatus === "copied" ? content.copiedLabel : content.copyLabel}
          </Button>
          <Button
            disabled={!sourceText && !outputText}
            onClick={() => {
              setCopyStatus("idle");
              setOptions(defaultOptions);
              setSourceText("");
            }}
            variant="secondary"
          >
            {content.clearLabel}
          </Button>
        </div>

        <p
          aria-live="polite"
          className="min-h-6 text-sm text-muted"
          role="status"
        >
          {copyStatus === "copied"
            ? content.copiedLabel
            : copyStatus === "error"
              ? content.copyErrorLabel
              : ""}
        </p>
      </div>
    </div>
  );
}
