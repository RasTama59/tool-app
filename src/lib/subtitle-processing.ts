export type SubtitleFormat = "srt" | "vtt";
export type SubtitleShiftDirection = "minus" | "plus";
export type SubtitleShiftUnit = "milliseconds" | "seconds";

export type SubtitleErrorCode =
  | "unsupportedFormat"
  | "loadFailed"
  | "emptyFile"
  | "invalidFormat"
  | "invalidTimestamp"
  | "noCues";

export type SubtitleCue = {
  id: string;
  identifier?: string;
  index: number;
  endMs: number;
  startMs: number;
  textLines: string[];
  timingSettings?: string;
};

export type SubtitleDocument = {
  baseName: string;
  cues: SubtitleCue[];
  file: File;
  format: SubtitleFormat;
  rawText: string;
  vttExtraBlocks: string[];
  vttHeaderLine?: string;
};

export type SubtitleTransformOptions = {
  offsetMs: number;
  outputFormat: SubtitleFormat;
};

export type SubtitleTransformResult = {
  clampedCueCount: number;
  cues: SubtitleCue[];
  offsetMs: number;
  outputFormat: SubtitleFormat;
  outputText: string;
};

type SubtitleParsingError = Error & {
  code: SubtitleErrorCode;
};

const TIMESTAMP_LINE_PATTERN =
  /^(\d{1,3}:\d{2}:\d{2}[,.]\d{1,3})\s*-->\s*(\d{1,3}:\d{2}:\d{2}[,.]\d{1,3})(?:\s+(.*))?$/;
const CUE_INDEX_PATTERN = /^\d+$/;
const CLEANED_FILE_SUFFIX = "-shifted";
const FILE_NAME_SANITIZE_PATTERN = /[<>:"/\\|?*\u0000-\u001f]/g;

function createSubtitleError(code: SubtitleErrorCode): SubtitleParsingError {
  const error = new Error(code) as SubtitleParsingError;

  error.code = code;

  return error;
}

function normalizeSourceText(value: string) {
  return value.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").trim();
}

function sanitizeFileNameSegment(value: string) {
  return value.replace(FILE_NAME_SANITIZE_PATTERN, " ").trim().replace(/\s+/g, "-");
}

function getFileBaseName(fileName: string) {
  const lastDotIndex = fileName.lastIndexOf(".");
  const baseName = lastDotIndex > 0 ? fileName.slice(0, lastDotIndex) : fileName;

  return sanitizeFileNameSegment(baseName) || "subtitles";
}

function detectSubtitleFormat(file: File, sourceText: string): SubtitleFormat | null {
  const lowerCaseName = file.name.toLowerCase();

  if (lowerCaseName.endsWith(".srt")) {
    return "srt";
  }

  if (lowerCaseName.endsWith(".vtt")) {
    return "vtt";
  }

  if (sourceText.startsWith("WEBVTT")) {
    return "vtt";
  }

  if (TIMESTAMP_LINE_PATTERN.test(sourceText.split("\n")[0] ?? "")) {
    return "srt";
  }

  if (TIMESTAMP_LINE_PATTERN.test(sourceText.split("\n")[1] ?? "")) {
    return "srt";
  }

  return null;
}

function parseTimestampValue(value: string) {
  const normalizedValue = value.replace(",", ".");
  const match = /^(\d{1,3}):(\d{2}):(\d{2})\.(\d{1,3})$/.exec(normalizedValue);

  if (!match) {
    throw createSubtitleError("invalidTimestamp");
  }

  const [, hoursText, minutesText, secondsText, millisecondsText] = match;
  const hours = Number(hoursText);
  const minutes = Number(minutesText);
  const seconds = Number(secondsText);
  const milliseconds = Number(millisecondsText.padEnd(3, "0").slice(0, 3));

  if (
    !Number.isFinite(hours) ||
    !Number.isFinite(minutes) ||
    !Number.isFinite(seconds) ||
    !Number.isFinite(milliseconds) ||
    minutes > 59 ||
    seconds > 59
  ) {
    throw createSubtitleError("invalidTimestamp");
  }

  return (
    hours * 60 * 60 * 1000 +
    minutes * 60 * 1000 +
    seconds * 1000 +
    milliseconds
  );
}

function parseTimingLine(line: string) {
  const match = TIMESTAMP_LINE_PATTERN.exec(line.trim());

  if (!match) {
    throw createSubtitleError("invalidFormat");
  }

  const [, startText, endText, timingSettings] = match;
  const startMs = parseTimestampValue(startText);
  const endMs = parseTimestampValue(endText);

  if (endMs < startMs) {
    throw createSubtitleError("invalidTimestamp");
  }

  return {
    endMs,
    startMs,
    timingSettings: timingSettings?.trim() || undefined,
  };
}

function parseSrtText(sourceText: string) {
  const blocks = sourceText.split(/\n{2,}/).filter((block) => block.trim().length > 0);
  const cues = blocks.map((block, blockIndex) => {
    const lines = block.split("\n");
    let lineIndex = 0;

    if (
      CUE_INDEX_PATTERN.test(lines[0]?.trim() ?? "") &&
      TIMESTAMP_LINE_PATTERN.test(lines[1]?.trim() ?? "")
    ) {
      lineIndex = 1;
    }

    const timingLine = lines[lineIndex];

    if (!timingLine || !TIMESTAMP_LINE_PATTERN.test(timingLine.trim())) {
      throw createSubtitleError("invalidFormat");
    }

    const parsedTiming = parseTimingLine(timingLine);
    const textLines = lines.slice(lineIndex + 1);

    return {
      endMs: parsedTiming.endMs,
      id: `cue-${blockIndex + 1}`,
      index: blockIndex,
      startMs: parsedTiming.startMs,
      textLines,
      timingSettings: parsedTiming.timingSettings,
    } satisfies SubtitleCue;
  });

  if (!cues.length) {
    throw createSubtitleError("noCues");
  }

  return {
    cues,
    vttExtraBlocks: [],
  };
}

function parseVttText(sourceText: string) {
  const [headerLine, ...restLines] = sourceText.split("\n");

  if (!headerLine?.startsWith("WEBVTT")) {
    throw createSubtitleError("invalidFormat");
  }

  const bodyText = restLines.join("\n").replace(/^\n+/, "");
  const blocks = bodyText.split(/\n{2,}/).filter((block) => block.trim().length > 0);
  const cues: SubtitleCue[] = [];
  const vttExtraBlocks: string[] = [];

  for (const block of blocks) {
    const lines = block.split("\n");
    const firstLine = lines[0]?.trim() ?? "";

    if (/^(NOTE|STYLE|REGION)(?:\s|$)/.test(firstLine)) {
      vttExtraBlocks.push(block.trimEnd());
      continue;
    }

    let lineIndex = 0;
    let identifier: string | undefined;

    if (TIMESTAMP_LINE_PATTERN.test(lines[0]?.trim() ?? "")) {
      lineIndex = 0;
    } else if (TIMESTAMP_LINE_PATTERN.test(lines[1]?.trim() ?? "")) {
      identifier = lines[0]?.trim() || undefined;
      lineIndex = 1;
    } else {
      throw createSubtitleError("invalidFormat");
    }

    const parsedTiming = parseTimingLine(lines[lineIndex] ?? "");
    const textLines = lines.slice(lineIndex + 1);

    cues.push({
      endMs: parsedTiming.endMs,
      id: `cue-${cues.length + 1}`,
      identifier,
      index: cues.length,
      startMs: parsedTiming.startMs,
      textLines,
      timingSettings: parsedTiming.timingSettings,
    });
  }

  if (!cues.length) {
    throw createSubtitleError("noCues");
  }

  return {
    cues,
    vttExtraBlocks,
    vttHeaderLine: headerLine,
  };
}

export function formatSubtitleTimestamp(valueMs: number, format: SubtitleFormat) {
  const safeValue = Math.max(0, Math.floor(valueMs));
  const hours = Math.floor(safeValue / (60 * 60 * 1000));
  const minutes = Math.floor((safeValue % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((safeValue % (60 * 1000)) / 1000);
  const milliseconds = safeValue % 1000;
  const separator = format === "srt" ? "," : ".";

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}${separator}${String(milliseconds).padStart(3, "0")}`;
}

function serializeSrt(cues: SubtitleCue[]) {
  return `${cues
    .map((cue, cueIndex) => {
      const timingSettings = cue.timingSettings ? ` ${cue.timingSettings}` : "";

      return [
        String(cueIndex + 1),
        `${formatSubtitleTimestamp(cue.startMs, "srt")} --> ${formatSubtitleTimestamp(cue.endMs, "srt")}${timingSettings}`,
        ...cue.textLines,
      ].join("\n");
    })
    .join("\n\n")}\n`;
}

function serializeVtt(
  cues: SubtitleCue[],
  headerLine: string | undefined,
  extraBlocks: string[],
) {
  const parts = [headerLine || "WEBVTT", ""];

  if (extraBlocks.length > 0) {
    parts.push(...extraBlocks, "");
  }

  for (const cue of cues) {
    const timingSettings = cue.timingSettings ? ` ${cue.timingSettings}` : "";
    const blockLines = [
      ...(cue.identifier ? [cue.identifier] : []),
      `${formatSubtitleTimestamp(cue.startMs, "vtt")} --> ${formatSubtitleTimestamp(cue.endMs, "vtt")}${timingSettings}`,
      ...cue.textLines,
    ];

    parts.push(blockLines.join("\n"), "");
  }

  return `${parts.join("\n").trimEnd()}\n`;
}

function shiftSubtitleCue(cue: SubtitleCue, offsetMs: number) {
  let nextStartMs = cue.startMs + offsetMs;
  let nextEndMs = cue.endMs + offsetMs;
  let wasClamped = false;

  if (nextStartMs < 0) {
    nextStartMs = 0;
    wasClamped = true;
  }

  if (nextEndMs < 0) {
    nextEndMs = 0;
    wasClamped = true;
  }

  if (nextEndMs < nextStartMs) {
    nextEndMs = nextStartMs;
    wasClamped = true;
  }

  return {
    cue: {
      ...cue,
      endMs: nextEndMs,
      startMs: nextStartMs,
    },
    wasClamped,
  };
}

export function toSubtitleOffsetMs(
  direction: SubtitleShiftDirection,
  value: string,
  unit: SubtitleShiftUnit,
) {
  if (!value.trim()) {
    return 0;
  }

  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return 0;
  }

  const normalizedValue = Math.max(0, numericValue) * (unit === "seconds" ? 1000 : 1);

  return Math.round(direction === "minus" ? -normalizedValue : normalizedValue);
}

export async function parseSubtitleFile(file: File): Promise<SubtitleDocument> {
  try {
    const rawText = await file.text();
    const normalizedText = normalizeSourceText(rawText);

    if (!normalizedText) {
      throw createSubtitleError("emptyFile");
    }

    const format = detectSubtitleFormat(file, normalizedText);

    if (!format) {
      throw createSubtitleError("unsupportedFormat");
    }

    const parsedSubtitle =
      format === "srt" ? parseSrtText(normalizedText) : parseVttText(normalizedText);

    return {
      baseName: getFileBaseName(file.name),
      cues: parsedSubtitle.cues,
      file,
      format,
      rawText: normalizedText,
      vttExtraBlocks: parsedSubtitle.vttExtraBlocks,
      vttHeaderLine: "vttHeaderLine" in parsedSubtitle ? parsedSubtitle.vttHeaderLine : undefined,
    };
  } catch (error) {
    if (typeof error === "object" && error && "code" in error) {
      throw error;
    }

    throw createSubtitleError("loadFailed");
  }
}

export function applySubtitleTransform(
  document: SubtitleDocument,
  options: SubtitleTransformOptions,
): SubtitleTransformResult {
  let clampedCueCount = 0;
  const cues = document.cues.map((cue, cueIndex) => {
    const shiftedCue = shiftSubtitleCue(cue, options.offsetMs);

    if (shiftedCue.wasClamped) {
      clampedCueCount += 1;
    }

    return {
      ...shiftedCue.cue,
      index: cueIndex,
    };
  });
  const outputText =
    options.outputFormat === "srt"
      ? serializeSrt(cues)
      : serializeVtt(
          cues,
          document.format === "vtt" ? document.vttHeaderLine : undefined,
          options.outputFormat === "vtt" ? document.vttExtraBlocks : [],
        );

  return {
    clampedCueCount,
    cues,
    offsetMs: options.offsetMs,
    outputFormat: options.outputFormat,
    outputText,
  };
}

export function buildSubtitleDownload(
  document: SubtitleDocument,
  result: SubtitleTransformResult,
) {
  const fileExtension = result.outputFormat;

  return {
    blob: new Blob(["\uFEFF", result.outputText], {
      type: "text/plain;charset=utf-8",
    }),
    fileName: `${document.baseName}${CLEANED_FILE_SUFFIX}.${fileExtension}`,
  };
}
