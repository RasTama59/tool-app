import type {PDFDocumentProxy} from "pdfjs-dist";

type PdfJsModule = {
  getDocument: typeof import("pdfjs-dist").getDocument;
};

export type PdfPreviewStore = {
  destroy: () => Promise<void>;
  renderPage: (
    cacheKey: string,
    sourceBytes: Uint8Array,
    pageNumber: number,
    canvas: HTMLCanvasElement,
    maxWidth?: number,
    maxHeight?: number,
  ) => Promise<void>;
};

export function createPdfPreviewStore(): PdfPreviewStore {
  const documentCache = new Map<string, Promise<PDFDocumentProxy>>();
  let modulePromise: Promise<PdfJsModule> | null = null;

  async function getModule() {
    if (!modulePromise) {
      modulePromise = import("pdfjs-dist/webpack.mjs").then(({getDocument}) => ({
        getDocument,
      }));
    }

    return await modulePromise;
  }

  async function getDocument(cacheKey: string, sourceBytes: Uint8Array) {
    if (!documentCache.has(cacheKey)) {
      const pdfjs = await getModule();

      documentCache.set(
        cacheKey,
        pdfjs.getDocument({
          data: sourceBytes.slice(),
        }).promise,
      );
    }

    return await documentCache.get(cacheKey)!;
  }

  return {
    async destroy() {
      const cachedDocuments = [...documentCache.values()];

      documentCache.clear();

      await Promise.allSettled(
        cachedDocuments.map(async (documentPromise) => {
          const document = await documentPromise;

          await document.destroy();
        }),
      );
    },
    async renderPage(
      cacheKey,
      sourceBytes,
      pageNumber,
      canvas,
      maxWidth = 150,
      maxHeight = 190,
    ) {
      const document = await getDocument(cacheKey, sourceBytes);
      const page = await document.getPage(pageNumber);
      const baseViewport = page.getViewport({scale: 1});
      const scale = Math.min(
        maxWidth / Math.max(baseViewport.width, 1),
        maxHeight / Math.max(baseViewport.height, 1),
      );
      const viewport = page.getViewport({
        scale: scale > 0 ? scale : 1,
      });
      const context = canvas.getContext("2d");

      if (!context) {
        page.cleanup();
        throw new Error("canvasUnavailable");
      }

      const pixelRatio = window.devicePixelRatio || 1;

      canvas.width = Math.max(1, Math.floor(viewport.width * pixelRatio));
      canvas.height = Math.max(1, Math.floor(viewport.height * pixelRatio));
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;

      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.scale(pixelRatio, pixelRatio);

      try {
        await page.render({
          canvas,
          canvasContext: context,
          viewport,
        }).promise;
      } finally {
        page.cleanup();
      }
    },
  };
}
