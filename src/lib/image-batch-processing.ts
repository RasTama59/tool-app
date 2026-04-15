import type {
  ImageBatchOptions,
  ImageBatchPreviewItem,
} from "@/content/tools/tool-types";

const supportedImageMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
] as const);

const supportedImageExtensions = new Set(["jpg", "jpeg", "png", "webp"] as const);

const invalidNamePattern = /[<>:"/\\|?*\u0000-\u001F]/u;
const reservedNamePattern = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/iu;

type SupportedImageMimeType = "image/jpeg" | "image/png" | "image/webp";

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

function getExtension(name: string) {
  const {extension} = splitFileName(name);

  return extension.replace(".", "").toLowerCase();
}

function getOriginalMimeType(file: File) {
  if (supportedImageMimeTypes.has(file.type as SupportedImageMimeType)) {
    return file.type;
  }

  const extension = getExtension(file.name);

  if (extension === "jpg" || extension === "jpeg") {
    return "image/jpeg";
  }

  if (extension === "png") {
    return "image/png";
  }

  if (extension === "webp") {
    return "image/webp";
  }

  return "";
}

function getTargetExtension(file: File, options: ImageBatchOptions) {
  if (options.outputFormat === "webp") {
    return ".webp";
  }

  const {extension} = splitFileName(file.name);

  return extension || ".jpg";
}

function getTargetMimeType(file: File, options: ImageBatchOptions) {
  if (options.outputFormat === "webp") {
    return "image/webp";
  }

  return getOriginalMimeType(file) || "image/jpeg";
}

function hasInvalidStem(stem: string) {
  return stem.trim().length === 0 || invalidNamePattern.test(stem) || reservedNamePattern.test(stem.trim());
}

function buildOutputName(file: File, options: ImageBatchOptions) {
  const {stem} = splitFileName(file.name);
  const outputStem = `${options.prefix}${stem}${options.suffix}`;

  return {
    invalid: hasInvalidStem(outputStem),
    outputName: `${outputStem}${getTargetExtension(file, options)}`,
  };
}

function toPositiveDimension(value: number | "") {
  if (value === "") {
    return undefined;
  }

  if (!Number.isFinite(value)) {
    return undefined;
  }

  return Math.max(1, Math.round(value));
}

function getTargetDimensions(
  originalWidth: number,
  originalHeight: number,
  options: ImageBatchOptions,
) {
  const requestedWidth = toPositiveDimension(options.width);
  const requestedHeight = toPositiveDimension(options.height);

  if (!requestedWidth && !requestedHeight) {
    return {
      width: originalWidth,
      height: originalHeight,
    };
  }

  if (!options.keepAspectRatio) {
    return {
      width: requestedWidth ?? originalWidth,
      height: requestedHeight ?? originalHeight,
    };
  }

  if (requestedWidth && requestedHeight) {
    const scale = Math.min(
      requestedWidth / originalWidth,
      requestedHeight / originalHeight,
    );

    return {
      width: Math.max(1, Math.round(originalWidth * scale)),
      height: Math.max(1, Math.round(originalHeight * scale)),
    };
  }

  if (requestedWidth) {
    return {
      width: requestedWidth,
      height: Math.max(1, Math.round((originalHeight / originalWidth) * requestedWidth)),
    };
  }

  return {
    width: Math.max(1, Math.round((originalWidth / originalHeight) * (requestedHeight ?? originalHeight))),
    height: requestedHeight ?? originalHeight,
  };
}

function loadImageElement(file: File) {
  return new Promise<{
    cleanup: () => void;
    height: number;
    image: HTMLImageElement;
    width: number;
  }>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      resolve({
        cleanup: () => URL.revokeObjectURL(objectUrl),
        height: image.naturalHeight,
        image,
        width: image.naturalWidth,
      });
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("loadFailed"));
    };

    image.src = objectUrl;
  });
}

function createBlobFromCanvas(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality: number,
) {
  return new Promise<Blob>((resolve, reject) => {
    const normalizedQuality = Math.min(1, Math.max(0.01, quality / 100));

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("convertFailed"));
          return;
        }

        resolve(blob);
      },
      mimeType,
      mimeType === "image/png" ? undefined : normalizedQuality,
    );
  });
}

export function createInitialImageBatchOptions(): ImageBatchOptions {
  return {
    height: "",
    keepAspectRatio: true,
    outputFormat: "original",
    prefix: "",
    quality: 82,
    suffix: "",
    width: "",
  };
}

export function mergeUniqueImageFiles(
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

  return [...fileMap.values()].sort((left, right) =>
    left.name.localeCompare(right.name, undefined, {numeric: true}),
  );
}

export function isSupportedImageFile(file: File) {
  if (supportedImageMimeTypes.has(file.type as SupportedImageMimeType)) {
    return true;
  }

  return supportedImageExtensions.has(getExtension(file.name) as "jpg" | "jpeg" | "png" | "webp");
}

export async function processImageFile(
  file: File,
  options: ImageBatchOptions,
): Promise<ImageBatchPreviewItem> {
  const {outputName, invalid} = buildOutputName(file, options);

  if (!isSupportedImageFile(file)) {
    return {
      errorCode: "unsupportedFormat",
      file,
      originalSizeBytes: file.size,
      outputName,
      status: "error",
    };
  }

  if (invalid) {
    return {
      errorCode: "invalidName",
      file,
      originalSizeBytes: file.size,
      outputName,
      status: "error",
    };
  }

  let loadedImage: Awaited<ReturnType<typeof loadImageElement>> | undefined;

  try {
    loadedImage = await loadImageElement(file);
  } catch {
    return {
      errorCode: "loadFailed",
      file,
      originalSizeBytes: file.size,
      outputName,
      status: "error",
    };
  }

  try {
    const targetDimensions = getTargetDimensions(
      loadedImage.width,
      loadedImage.height,
      options,
    );
    const canvas = document.createElement("canvas");

    canvas.width = targetDimensions.width;
    canvas.height = targetDimensions.height;

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("convertFailed");
    }

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(
      loadedImage.image,
      0,
      0,
      targetDimensions.width,
      targetDimensions.height,
    );

    const mimeType = getTargetMimeType(file, options);
    const blob = await createBlobFromCanvas(canvas, mimeType, options.quality);
    const outputFile = new File([blob], outputName, {
      lastModified: Date.now(),
      type: mimeType,
    });

    return {
      file,
      originalDimensions: {
        width: loadedImage.width,
        height: loadedImage.height,
      },
      originalSizeBytes: file.size,
      outputDimensions: {
        width: targetDimensions.width,
        height: targetDimensions.height,
      },
      outputFile,
      outputName,
      outputSizeBytes: outputFile.size,
      reductionRatio: ((file.size - outputFile.size) / file.size) * 100,
      status: "ready",
    };
  } catch {
    return {
      errorCode: "convertFailed",
      file,
      originalDimensions: {
        width: loadedImage.width,
        height: loadedImage.height,
      },
      originalSizeBytes: file.size,
      outputName,
      status: "error",
    };
  } finally {
    loadedImage.cleanup();
  }
}

export function finalizeImageBatchPreview(previews: ImageBatchPreviewItem[]) {
  const duplicateMap = new Map<string, number>();

  for (const preview of previews) {
    if (preview.status !== "ready") {
      continue;
    }

    const normalizedName = preview.outputName.toLocaleLowerCase();
    duplicateMap.set(normalizedName, (duplicateMap.get(normalizedName) ?? 0) + 1);
  }

  return previews.map((preview) => {
    if (preview.status !== "ready") {
      return preview;
    }

    const normalizedName = preview.outputName.toLocaleLowerCase();

    if ((duplicateMap.get(normalizedName) ?? 0) < 2) {
      return preview;
    }

    return {
      ...preview,
      errorCode: "duplicateName" as const,
      status: "error" as const,
    };
  });
}
