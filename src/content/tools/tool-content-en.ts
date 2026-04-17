import type {ToolContentDictionary} from "./tool-types";

export const toolContentEn: ToolContentDictionary = {
  "csv-excel-cleaner": {
    slug: "csv-excel-cleaner",
    title: "CSV / Excel Cleaner",
    category: "Table cleanup and column shaping",
    description:
      "Open a CSV, TSV or Excel file in the browser, remove blank rows, trim extra spaces, delete exact duplicate rows, keep only needed columns, and download the cleaned result without sending the file to a server.",
    metadata: {
      title: "CSV / Excel Cleaner | Cleanup & Conversion Toolkit",
      description:
        "Clean CSV, TSV, XLSX and XLS files locally in the browser. Remove blank rows, trim cells, drop duplicate rows, choose columns and export as CSV or XLSX.",
      keywords: [
        "csv cleaner",
        "excel cleaner",
        "xlsx cleanup",
        "spreadsheet cleanup",
        "remove duplicate rows"
      ]
    },
    structuredData: {
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any"
    },
    supportedFormats: [
      "csv",
      "tsv",
      "xlsx",
      "xls"
    ],
    capabilities: [
      "Load one CSV, TSV, XLSX or XLS file directly in the browser",
      "Choose a sheet for Excel files and preview the table before and after cleanup",
      "Remove blank rows, trim surrounding spaces, delete exact duplicate rows and drop empty columns",
      "Keep only selected columns and export the cleaned result as CSV, TSV-style text or XLSX"
    ],
    idealFor: [
      "People tidying exported customer lists, order data or survey results",
      "Teams removing blank rows and repeated records before sharing a spreadsheet",
      "Anyone who wants a quick local cleanup tool instead of opening a full spreadsheet workflow"
    ],
    steps: [
      {
        title: "Add the file",
        description:
          "Choose one CSV, TSV, XLSX or XLS file, or drag and drop it into the upload area."
      },
      {
        title: "Pick the sheet and cleanup options",
        description:
          "For Excel files, choose the sheet to work on, then turn header, trimming and cleanup options on or off."
      },
      {
        title: "Review counts and previews",
        description:
          "Check the before-and-after row and column counts, then compare the original and cleaned previews."
      },
      {
        title: "Download the cleaned file",
        description:
          "Export the selected sheet as CSV or XLSX once the result looks ready."
      }
    ],
    examples: [
      {
        title: "Remove blank rows and repeated entries from a mailing list",
        before:
          "Name,Email\nAlice,alice@example.com\n\nBob,bob@example.com\nBob,bob@example.com",
        after:
          "Name,Email\nAlice,alice@example.com\nBob,bob@example.com",
        note:
          "Blank rows are removed and an exact duplicate row is deleted."
      },
      {
        title: "Trim spaces and keep only the columns needed for handoff",
        before:
          " Order ID , Customer , Notes , Internal Memo \n1001, A Corp , urgent , draft\n1002, B Corp, , keep inside team",
        after:
          "Order ID,Customer,Notes\n1001,A Corp,urgent\n1002,B Corp,",
        note:
          "Spaces are trimmed and only the selected columns are kept in the output."
      }
    ],
    cautions: [
      "The exported file keeps the cleaned values, but it does not preserve original Excel styling, formulas, merged cells or hidden-sheet settings.",
      "Very large spreadsheets may take longer to parse and preview in the browser.",
      "The header-row setting changes how the first row is treated, so confirm it before downloading."
    ],
    faq: [
      {
        question: "Does this upload my spreadsheet anywhere?",
        answer:
          "No. The tool is designed to parse, clean and export the file locally in the browser."
      },
      {
        question: "Can old XLS files be opened?",
        answer:
          "Yes, basic XLS support is included. Some older files with uncommon encodings or unusual structures may still fail to load."
      },
      {
        question: "Will the original Excel formatting stay the same?",
        answer:
          "No. The export focuses on cleaned table values. Formatting, formulas, merged cells and workbook-level layout are not preserved."
      }
    ],
    relatedTools: [
      {
        href: "/tools/text-cleanup",
        label: "Text Cleanup Tool",
        description:
          "Use it when you also need to clean copied notes or list text after fixing spreadsheet rows."
      },
      {
        href: "/tools/file-batch-rename",
        label: "Batch File Rename Tool",
        description:
          "Helpful when cleaned exports need clearer filenames before sharing."
      }
    ],
    relatedArticles: [
      {
        href: "/guide/clean-csv-empty-lines-duplicates",
        label: "How to remove blank lines and duplicates from CSV",
        description:
          "Read the cleanup order for blank rows, whitespace, duplicates and column selection before exporting a cleaner file."
      },
      {
        href: "/guide",
        label: "Guide library",
        description:
          "Browse step-by-step guides for common cleanup and conversion tasks."
      },
      {
        href: "/faq",
        label: "FAQ",
        description:
          "Check how input data is handled, supported formats and common usage questions."
      }
    ],
    history: [
      {
        date: "2026-04-14",
        summary:
          "Added the CSV / Excel Cleaner tool with local parsing, sheet selection and before-and-after table preview."
      },
      {
        date: "2026-04-14",
        summary:
          "Added cleanup controls for blank rows, trim, duplicate removal, empty-column removal, column selection and CSV/XLSX export."
      }
    ],
    operation: {
      kind: "tabularCleaner",
      ui: {
        title: "File setup and cleanup controls",
        description:
          "Upload one table file, choose the sheet and cleanup options on the left, then review counts and previews on the right before downloading the result.",
        actions: {
          clearColumnSelectionLabel: "Clear selection",
          downloadLabel: "Download cleaned file",
          downloadingLabel: "Preparing file...",
          resetLabel: "Reset",
          selectAllColumnsLabel: "Select all"
        },
        dropzone: {
          title: "CSV / Excel file",
          description:
            "Choose one CSV, TSV, XLSX or XLS file, or drag and drop it here.",
          browseLabel: "Choose file",
          activeLabel: "Drop file here",
          hint:
            "The file stays in the browser. Parsing, preview and export all run locally."
        },
        emptyState: {
          title: "No file selected yet",
          description:
            "Add one CSV or Excel file first and the sheet summary and table preview will appear here."
        },
        fields: {
          columnsHint:
            "Pick only the columns you want to keep in the exported file.",
          columnsLabel: "Columns to keep",
          hasHeaderRowLabel: "Treat the first row as a header row",
          nonEmptyCountLabel: "Filled cells",
          outputFormatLabel: "Output format",
          outputFormatOptions: {
            csv: "CSV / TSV text",
            xlsx: "XLSX"
          },
          removeDuplicateRowsLabel: "Remove exact duplicate rows",
          removeEmptyColumnsLabel: "Remove empty columns",
          removeEmptyRowsLabel: "Remove blank rows",
          sheetLabel: "Sheet",
          textDelimiterLabel: "Delimiter for text output",
          textDelimiterOptions: {
            comma: "CSV (comma-separated)",
            tab: "TSV (tab-separated)"
          },
          trimCellWhitespaceLabel: "Trim spaces at the start and end of each cell"
        },
        helper: {
          delimiterNote:
            "When text output is selected, you can export as normal CSV or tab-separated TSV.",
          headerNote:
            "Turn the header option on when the first row contains column names instead of normal data.",
          localProcessingNote:
            "The selected file is read and cleaned inside the browser. The site does not include a mechanism that sends this tool input for AI training."
        },
        preview: {
          cleanedTitle: "Cleaned preview",
          emptyCellLabel: "Empty",
          originalTitle: "Original preview",
          rowNumberLabel: "Row",
          showingRowsLabel: "Showing rows",
          title: "Cleanup summary and preview"
        },
        sections: {
          cleanupOptions: "Cleanup options",
          outputSettings: "Export settings",
          sourceSettings: "Source settings",
          summary: "Current summary"
        },
        summary: {
          afterColumnsLabel: "Columns after cleanup",
          afterRowsLabel: "Rows after cleanup",
          beforeColumnsLabel: "Columns before cleanup",
          beforeRowsLabel: "Rows before cleanup",
          detectedFormatLabel: "Detected format",
          fileLabel: "Selected file",
          removedDuplicateRowsLabel: "Exact duplicate rows removed",
          removedEmptyColumnsLabel: "Empty columns removed",
          removedEmptyRowsLabel: "Blank rows removed",
          selectedColumnsLabel: "Columns selected for output",
          sheetLabel: "Working sheet"
        },
        status: {
          loading: "Loading file...",
          previewUpdating: "Updating preview...",
          ready: "Preview ready"
        },
        validation: {
          abnormalData: "The file structure could not be interpreted as a normal table.",
          emptyFile: "The selected file looks empty.",
          exportFailed: "The cleaned file could not be created. Please review the settings and try again.",
          loadFailed: "The file could not be read.",
          noColumnsSelected: "Select at least one column to include in the output.",
          unsupportedFormat: "Unsupported format. Please use csv, tsv, xlsx or xls."
        }
      }
    }
  },
  "file-batch-rename": {
    slug: "file-batch-rename",
    title: "Batch File Rename Tool",
    category: "Filename cleanup and numbering",
    description:
      "Select multiple files, preview new names with prefix, suffix, replace, shared base-name and numbering rules, then download the renamed set as a ZIP file without sending files to a server.",
    metadata: {
      title: "Batch File Rename Tool | Cleanup & Conversion Toolkit",
      description:
        "Rename multiple files locally in the browser with shared base names, numbering, prefix, suffix and replace rules, then download them together as ZIP.",
      keywords: [
        "batch file rename tool",
        "filename renamer",
        "rename files locally",
        "zip download"
      ]
    },
    structuredData: {
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any"
    },
    supportedFormats: [
      "Image files",
      "PDF, document and spreadsheet files",
      "Any files selected in bulk or dropped into the browser"
    ],
    capabilities: [
      "Add and review multiple files at once, including drag and drop",
      "Combine prefix, suffix, replace and sequential numbering rules",
      "Replace every original name with one shared base name before adding numbering or labels",
      "Control the preview order used for numbering with file-name ascending, descending or added order",
      "Keep file extensions while previewing the full renamed filename",
      "Detect empty names, duplicates and simple invalid-character issues before ZIP download"
    ],
    idealFor: [
      "People cleaning up shared-folder filenames before handoff",
      "Teams adding project labels or numbering to batches of files",
      "Anyone who wants every file renamed to one shared label such as `submission` plus numbering",
      "Anyone preparing images, PDFs or attachments before submission"
    ],
    steps: [
      {
        title: "Add the files",
        description:
          "Select multiple files or drag and drop them into the upload area."
      },
      {
        title: "Set the rename rules",
        description:
          "Adjust shared base name, prefix, suffix, replace, numbering, replace sensitivity and preview order settings on the left side."
      },
      {
        title: "Review the preview and warnings",
        description:
          "Compare original names and renamed names, then fix any duplicate or invalid results."
      },
      {
        title: "Download everything as ZIP",
        description:
          "Once the list looks clean, download the renamed files together in one ZIP."
      }
    ],
    examples: [
      {
        title: "Add project labels and numbering to photos",
        before: "IMG_8123.jpg\nIMG_8124.jpg\nIMG_8125.jpg",
        after: "2026-event-001.jpg\n2026-event-002.jpg\n2026-event-003.jpg",
        note:
          "This uses a project prefix and a three-digit sequence added at the beginning."
      },
      {
        title: "Replace draft wording before submission",
        before: "estimate_draft.pdf\ninvoice_draft.pdf",
        after: "estimate_final.pdf\ninvoice_final.pdf",
        note:
          "The matching text is replaced while the original extensions stay untouched."
      },
      {
        title: "Rename every file to one shared submission label",
        before: "scan_01.pdf\nscan_02.pdf\nscan_03.pdf",
        after: "submission-01.pdf\nsubmission-02.pdf\nsubmission-03.pdf",
        note:
          "This uses one shared base name instead of the original names, then adds a two-digit suffix sequence."
      }
    ],
    cautions: [
      "This tool does not rename files directly on your device. It creates renamed copies inside a ZIP download.",
      "Very large files or large batches may take longer to process and zip inside the browser.",
      "If the preview shows duplicate or invalid names, fix them before downloading the ZIP."
    ],
    faq: [
      {
        question: "Does this upload my files anywhere?",
        answer:
          "No. The tool is designed to rename and zip files locally in the browser."
      },
      {
        question: "Will my original files on disk be renamed directly?",
        answer:
          "No. The original files stay untouched. You download a new ZIP containing renamed copies."
      },
      {
        question: "Are file extensions preserved?",
        answer:
          "Yes. The tool keeps the extension and changes only the filename body."
      },
      {
        question: "Can I rename every file to the same base label?",
        answer:
          "Yes. You can switch to a shared base name such as `submission`, then still add prefixes, suffixes and sequential numbering around it."
      }
    ],
    relatedTools: [
      {
        href: "/tools/text-cleanup",
        label: "Text Cleanup Tool",
        description:
          "Clean pasted text and list formatting locally before sharing or filing it elsewhere."
      }
    ],
    relatedArticles: [
      {
        href: "/guide/rename-files-in-bulk",
        label: "How to make file names consistent in bulk",
        description:
          "Read a simple naming workflow before applying prefixes, suffixes and numbering to a whole folder."
      },
      {
        href: "/guide",
        label: "Guide library",
        description:
          "Browse step-by-step guides for common cleanup and conversion tasks."
      },
      {
        href: "/faq",
        label: "FAQ",
        description:
          "Check how input data is handled, supported formats and support guidance."
      }
    ],
    history: [
      {
        date: "2026-04-15",
        summary:
          "Added a shared base-name option so every file can be renamed to one common label before prefixes, suffixes and numbering are applied."
      },
      {
        date: "2026-04-15",
        summary:
          "Added preview sort-order controls and case-sensitive replace settings so numbering and replacement rules are easier to tune."
      },
      {
        date: "2026-04-14",
        summary:
          "Added the batch file rename tool with local ZIP download support."
      },
      {
        date: "2026-04-14",
        summary:
          "Added preview validation for numbering, replacement and duplicate-name checks."
      }
    ],
    operation: {
      kind: "fileBatchRename",
      ui: {
        title: "File selection and rename rules",
        description:
          "Set files and rules on the left, review the new names on the right, then download the renamed result as ZIP when everything looks ready, including shared base-name patterns.",
        dropzone: {
          title: "Files to rename",
          description:
            "Select multiple files or drag and drop them here.",
          browseLabel: "Choose files",
          activeLabel: "Drop files here",
          hint:
            "Files stay in the browser. Renaming preview and ZIP generation run locally."
        },
        emptyState: {
          title: "No files selected yet",
          description:
            "Add multiple files first and the rename preview will appear here."
        },
        fields: {
          caseSensitiveReplaceLabel: "Treat replacement text as case-sensitive",
          customBaseNameEnabledLabel:
            "Ignore original names and use one shared base name",
          customBaseNameEnabledHint:
            "Example: rename every file to `submission`, then add prefixes, suffixes or numbering.",
          customBaseNameLabel: "Shared base name",
          customBaseNamePlaceholder: "Example: submission",
          prefixLabel: "Text to add at the beginning",
          prefixPlaceholder: "Example: project-",
          suffixLabel: "Text to add at the end",
          suffixPlaceholder: "Example: -final",
          findLabel: "Text to replace",
          findPlaceholder: "Example: draft",
          replaceLabel: "Replacement text",
          replacePlaceholder: "Example: final",
          sortOrderLabel: "Preview and numbering order",
          sortOrderHint:
            "This order controls the list preview and the sequence numbers when numbering is enabled.",
          sortOrderOptions: {
            added: "Keep added order",
            nameAsc: "File name A to Z",
            nameDesc: "File name Z to A"
          },
          numberingLabel: "Add sequential numbering",
          numberingPositionLabel: "Number position",
          numberingPositionOptions: {
            prefix: "Add at the beginning",
            suffix: "Add at the end"
          },
          digitsLabel: "Number digits",
          digitsHint: "Example: 3 digits gives 001, 002",
          startNumberLabel: "Starting number",
          startNumberHint: "Example: start from 5 to get 005, 006"
        },
        helper: {
          extensionNote:
            "Extensions are preserved automatically. Only the filename body changes.",
          ruleOrder:
            "New names are built from either the shared base name or the original name after replacement, then prefix/suffix text is added, then numbering. The selected preview order controls the numbering sequence."
        },
        preview: {
          title: "Rename preview",
          originalNameLabel: "Original name",
          newNameLabel: "New name",
          issuesLabel: "Checks"
        },
        status: {
          ready: "Ready",
          issue: "Needs review"
        },
        summary: {
          selectedCountLabel: "Selected",
          readyCountLabel: "Ready to download",
          issueCountLabel: "Needs fixes"
        },
        actions: {
          downloadErrorLabel:
            "ZIP creation failed. Please keep the page open, review the files and naming rules, then try again.",
          downloadZipLabel: "Download ZIP",
          downloadingZipLabel: "Building ZIP...",
          resetLabel: "Reset",
          zipFileName: "renamed-files-en.zip"
        },
        validation: {
          emptyName: "The filename becomes empty.",
          duplicateName: "More than one file ends up with the same new name.",
          invalidCharacters: "The name contains unsupported characters.",
          reservedName: "The name matches a reserved filename on some systems."
        }
      }
    }
  },
  "image-batch-resize-webp": {
    slug: "image-batch-resize-webp",
    title: "Batch Image Resize / WebP Convert",
    category: "Image optimization and format conversion",
    description:
      "Upload multiple images, resize them together, convert them to WebP when needed, review before-and-after size changes, and download the processed result as ZIP without leaving the browser.",
    metadata: {
      title: "Batch Image Resize / WebP Convert | Cleanup & Conversion Toolkit",
      description:
        "Resize jpg, jpeg, png and webp images in bulk, convert them to WebP locally, and download the processed files together as ZIP.",
      keywords: [
        "batch image resize",
        "webp converter",
        "image optimization",
        "local image processing"
      ]
    },
    structuredData: {
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any"
    },
    supportedFormats: [
      "jpg / jpeg",
      "png",
      "webp",
      "Multiple-image upload and drag-and-drop"
    ],
    capabilities: [
      "Add multiple images at once with file selection or drag and drop",
      "Resize in bulk with width, height and aspect-ratio settings",
      "Keep the original format or convert the whole batch to WebP",
      "Review quality, output naming, before-and-after size info and estimated reduction before ZIP download"
    ],
    idealFor: [
      "People preparing blog or landing-page images before publishing",
      "Teams optimizing product images or attachment images in batches",
      "Anyone who wants lighter images without opening a full design tool"
    ],
    steps: [
      {
        title: "Add the images",
        description:
          "Select multiple jpg, jpeg, png or webp files, or drag and drop them into the page."
      },
      {
        title: "Choose size, format and quality",
        description:
          "Set width, height, aspect-ratio, output format, quality and filename prefix or suffix as needed."
      },
      {
        title: "Review the results",
        description:
          "Compare original size, output size and estimated reduction for each image and check for any issues."
      },
      {
        title: "Download everything as ZIP",
        description:
          "When the batch looks ready, save the processed images together in one ZIP file."
      }
    ],
    examples: [
      {
        title: "Resize blog images and convert them to WebP",
        before: "photo01.jpg 4.8MB 4000×3000\nphoto02.png 2.1MB 2400×1600",
        after: "photo01-web.webp 420KB 1600×1200\nphoto02-web.webp 310KB 1600×1067",
        note:
          "This example sets the width to 1600px and keeps the aspect ratio while converting the batch to WebP."
      },
      {
        title: "Keep the original format and add project naming",
        before: "hero.jpg 3.2MB 3200×1800",
        after: "project-hero-optimized.jpg 690KB 1800×1013",
        note:
          "The format stays the same while the image is resized and the output name gets a prefix and suffix."
      }
    ],
    cautions: [
      "Very large images or large batches may take longer to process inside the browser.",
      "Lower quality usually reduces file size, but it can also reduce visual detail.",
      "The estimated reduction compares the new file to the original one. Some settings may produce a file that is larger than the source."
    ],
    faq: [
      {
        question: "Does this upload my images anywhere?",
        answer:
          "No. The tool is designed to resize, convert and zip images locally in the browser."
      },
      {
        question: "What is WebP?",
        answer:
          "WebP is an image format often used on websites because it can keep images fairly clear while reducing file size compared with older formats in many cases."
      },
      {
        question: "Can I keep the original format?",
        answer:
          "Yes. Choose `Keep original format` if you want to resize images without changing jpg, png or webp output type."
      }
    ],
    relatedTools: [
      {
        href: "/tools/file-batch-rename",
        label: "Batch File Rename Tool",
        description:
          "Use it after optimization when you also want to clean up project labels or numbering for image filenames."
      }
    ],
    relatedArticles: [
      {
        href: "/guide",
        label: "How to use the tools",
        description:
          "Review the shared flow for input, preview and export before using more tools."
      },
      {
        href: "/faq",
        label: "FAQ",
        description:
          "Check how input data is handled, supported formats and support guidance."
      },
      {
        href: "/privacy",
        label: "Privacy policy",
        description:
          "See how tool inputs are handled and what the storage policy covers."
      }
    ],
    history: [
      {
        date: "2026-04-14",
        summary:
          "Added the batch image resize and WebP conversion tool with local ZIP download support."
      },
      {
        date: "2026-04-14",
        summary:
          "Added resize controls, quality settings and before-and-after size comparison."
      }
    ],
    operation: {
      kind: "imageBatchResize",
      ui: {
        title: "Image settings and batch processing",
        description:
          "Set images and output conditions on the left, review the results on the right, then download the processed batch as ZIP when it looks ready.",
        dropzone: {
          title: "Images to process",
          description:
            "Select multiple jpg, jpeg, png or webp files, or drag and drop them here.",
          browseLabel: "Choose images",
          activeLabel: "Drop images here",
          hint:
            "Images stay in the browser. Resizing, conversion and ZIP generation all run locally."
        },
        emptyState: {
          title: "No images selected yet",
          description:
            "Add multiple images first and the before-and-after information will appear here."
        },
        fields: {
          widthLabel: "Output width",
          widthPlaceholder: "Example: 1600",
          heightLabel: "Output height",
          heightPlaceholder: "Example: 1200",
          keepAspectRatioLabel: "Keep aspect ratio",
          outputFormatLabel: "Output format",
          outputFormatOptions: {
            original: "Keep original format",
            webp: "Convert to WebP"
          },
          qualityLabel: "Quality",
          qualityHint:
            "Lower values usually make the file smaller. This mostly affects jpg and webp output.",
          prefixLabel: "Filename prefix",
          prefixPlaceholder: "Example: project-",
          suffixLabel: "Filename suffix",
          suffixPlaceholder: "Example: -web"
        },
        helper: {
          webpDescription:
            "WebP is a web-friendly image format that often reduces file size while keeping images visually usable. If you are unsure, try WebP first and compare the result.",
          localProcessingNote:
            "Image processing and ZIP generation stay inside this browser. The site does not include a mechanism that sends these tool inputs for AI training.",
          qualityNote:
            "Higher quality usually keeps more detail, but it also tends to increase the output file size.",
          filenameRuleNote:
            "Output filenames keep the original base name and add your prefix or suffix. The extension changes automatically when you convert to WebP."
        },
        preview: {
          title: "Processing preview",
          originalInfoLabel: "Original image",
          originalNameLabel: "Original filename",
          outputInfoLabel: "Output image",
          outputNameLabel: "Output filename",
          reductionLabel: "Estimated size reduction"
        },
        progress: {
          processingLabel: "Processing",
          readyLabel: "Processing settings"
        },
        status: {
          processing: "Processing",
          ready: "Ready",
          error: "Needs review"
        },
        summary: {
          selectedCountLabel: "Selected",
          successCountLabel: "Ready",
          errorCountLabel: "Needs review"
        },
        actions: {
          downloadErrorLabel:
            "ZIP creation failed. Please review the batch settings and try again.",
          downloadZipLabel: "Download ZIP",
          downloadingZipLabel: "Building ZIP...",
          resetLabel: "Reset",
          zipFileName: "processed-images-en.zip"
        },
        validation: {
          unsupportedFormat: "Unsupported image format. Please use jpg, jpeg, png or webp.",
          loadFailed: "The image could not be loaded.",
          convertFailed: "The image could not be converted.",
          invalidName: "The output filename contains unsupported characters.",
          duplicateName: "More than one image ends up with the same output filename."
        }
      }
    }
  },
  "pdf-page-organizer": {
    slug: "pdf-page-organizer",
    title: "PDF Page Organizer",
    category: "PDF page organizing, merge and split",
    description:
      "Open one or more PDFs in the browser, review page thumbnails, reorder pages, remove pages you do not need, merge files into one PDF, split page ranges into separate PDFs, and download the result without uploading anything to a server.",
    metadata: {
      title: "PDF Page Organizer | Cleanup & Conversion Toolkit",
      description:
        "Reorder PDF pages, remove unwanted pages, merge multiple PDFs, split page ranges, and download the result locally in the browser.",
      keywords: [
        "pdf page organizer",
        "reorder pdf pages",
        "delete pdf pages",
        "pdf page sorter",
        "local pdf editor"
      ]
    },
    structuredData: {
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any"
    },
    supportedFormats: [
      "pdf",
      "One or more PDF files",
      "Local browser processing"
    ],
    capabilities: [
      "Load one or more PDF files directly in the browser and review every page in a clear list",
      "Merge multiple PDFs into one file based on the current page order",
      "Reorder pages with drag and drop, while also keeping move-up and move-down buttons for mobile and keyboard-friendly use",
      "Select pages in bulk or remove individual pages before export",
      "Render simple page thumbnails and split page ranges into separate PDFs inside one ZIP download"
    ],
    idealFor: [
      "People fixing presentation handouts or proposal PDFs before sending them",
      "Teams combining several PDFs into one file before sharing",
      "Anyone splitting contracts, reports or handouts into smaller PDF parts",
      "Teams removing cover pages, appendix pages or duplicate pages from a document",
      "Anyone who needs a simple first-step PDF organizer without full editing software"
    ],
    steps: [
      {
        title: "Add the PDF",
        description:
          "Choose one or more PDF files or drag and drop them into the upload area."
      },
      {
        title: "Reorder and remove pages",
        description:
          "Drag page cards to change their order, use move buttons when needed, and remove pages you do not want to keep."
      },
      {
        title: "Choose merge or split output",
        description:
          "Save the current page list as one merged PDF, or enter ranges like `1-3, 4-6` to split the current order into separate PDF files."
      },
      {
        title: "Download the result",
        description:
          "Download either the organized PDF or the split ZIP once the result looks right."
      }
    ],
    examples: [
      {
        title: "Move the appendix behind the main proposal",
        before: "Page order: 1, 2, 8, 9, 3, 4, 5, 6, 7",
        after: "Page order: 1, 2, 3, 4, 5, 6, 7, 8, 9",
        note:
          "Useful when a PDF was exported with section pages in the wrong order."
      },
      {
        title: "Remove a cover sheet and a blank ending page",
        before: "Pages kept: 1, 2, 3, 4, 5, 6",
        after: "Pages kept: 2, 3, 4, 5",
        note:
          "Good for sharing only the essential pages without extra wrappers."
      }
    ],
    cautions: [
      "Page thumbnails are meant for quick visual checking and may not show small text clearly.",
      "Very large PDFs may take longer to load and rebuild in the browser.",
      "Split ranges should follow the current page order and use a non-overlapping format such as `1-3, 4, 5-7`.",
      "Some PDFs with heavy protection or unusual structures may fail to load."
    ],
    faq: [
      {
        question: "Does this upload my PDF anywhere?",
        answer:
          "No. The tool is designed to read, reorder and rebuild the PDF locally in the browser."
      },
      {
        question: "Can I merge or split PDFs here?",
        answer:
          "Yes. If you load multiple PDFs, you can export the current page order as one merged PDF. You can also enter ranges such as `1-3, 4-6` to download split PDFs as a ZIP file."
      },
      {
        question: "Can I preview the page contents?",
        answer:
          "Yes. Each page card shows a simple thumbnail so you can recognize the page contents and order more easily before export."
      },
      {
        question: "Can I use this on mobile?",
        answer:
          "Yes. Drag and drop may be less convenient on mobile, so move-up and move-down buttons are also included."
      }
    ],
    relatedTools: [
      {
        href: "/tools/file-batch-rename",
        label: "Batch File Rename Tool",
        description:
          "Useful after PDF cleanup when the downloaded file also needs a clearer project filename."
      },
      {
        href: "/tools/text-cleanup",
        label: "Text Cleanup Tool",
        description:
          "Helpful when you also need to clean copied notes or summaries that go with the PDF."
      }
    ],
    relatedArticles: [
      {
        href: "/guide/reorder-pdf-pages",
        label: "How to fix PDF page order",
        description:
          "See a simple review-first approach for deleting extra pages and restoring the right reading order."
      },
      {
        href: "/guide",
        label: "Guide library",
        description:
          "Browse step-by-step guides for common cleanup and conversion tasks."
      },
      {
        href: "/faq",
        label: "FAQ",
        description:
          "Check how input data is handled, supported formats and common usage questions."
      }
    ],
    history: [
      {
        date: "2026-04-14",
        summary:
          "Added the first PDF Page Organizer with local PDF upload, page list review and reorganized PDF download."
      },
      {
        date: "2026-04-14",
        summary:
          "Added multi-PDF merge, page-range split ZIP export, page thumbnails, drag-and-drop reordering, page selection and move controls."
      }
    ],
    operation: {
      kind: "pdfPageOrganizer",
      ui: {
        title: "PDF upload and page controls",
        description:
          "Upload one or more PDFs, review page thumbnails, change the order, remove pages you do not need, and download either one merged PDF or a split ZIP when it looks ready.",
        actions: {
          clearSelectionLabel: "Clear selection",
          deleteSelectedLabel: "Delete selected pages",
          downloadLabel: "Download organized PDF",
          downloadingLabel: "Building PDF...",
          resetLabel: "Reset",
          selectAllLabel: "Select all",
          splitDownloadLabel: "Download split ZIP",
          splittingLabel: "Building split ZIP..."
        },
        dropzone: {
          title: "PDF file",
          description:
            "Choose one or more PDF files or drag and drop them here.",
          browseLabel: "Choose PDF",
          activeLabel: "Drop PDF here",
          hint:
            "The PDF stays in the browser. Merge, page review, reordering, split export and download all run locally."
        },
        emptyState: {
          title: "No PDF selected yet",
          description:
            "Add one or more PDFs first and the page list will appear here."
        },
        fields: {
          currentPageLabel: "Current page",
          deletePageLabel: "Delete page",
          moveDownLabel: "Move down",
          moveUpLabel: "Move up",
          originalPageLabel: "Original page",
          pageInfoLabel: "Page info",
          pageListLabel: "Page list",
          pageSizeLabel: "Page size",
          rotationLabel: "Rotation",
          selectPageLabel: "Select page",
          sourceFileLabel: "Source file",
          splitRangeLabel: "Page ranges to split",
          splitRangePlaceholder: "Example: 1-3, 4-6, 7"
        },
        helper: {
          mergeNote:
            "When you add multiple PDFs, you can export the current combined page order as one merged PDF.",
          localProcessingNote:
            "The uploaded PDF is processed inside this browser. The site does not include a mechanism that sends this tool input for AI training.",
          mobileNote:
            "On mobile, the move buttons can be easier to use than drag and drop.",
          reorderNote:
            "Drag page cards to change the order. The exported PDF follows the order shown in the list.",
          splitNote:
            "Split ranges follow the current page order. Enter values such as `1-3, 4-6` to create separate PDFs inside one ZIP file."
        },
        preview: {
          dragHintLabel: "Drag cards to reorder pages",
          emptyLabel: "Not selected",
          renderingLabel: "Rendering thumbnail...",
          selectedLabel: "Selected",
          title: "Page summary and current order"
        },
        sections: {
          controls: "Page controls",
          split: "Split PDF",
          summary: "Current summary"
        },
        summary: {
          currentCountLabel: "Pages currently kept",
          fileLabel: "Loaded files",
          originalCountLabel: "Original page count",
          removedCountLabel: "Pages removed",
          selectedCountLabel: "Pages selected",
          sourceCountLabel: "Loaded PDF files"
        },
        status: {
          loading: "Loading PDF...",
          ready: "Page list ready"
        },
        validation: {
          emptyFile: "The selected PDF looks empty.",
          exportFailed: "The output PDF could not be created. Please try again.",
          invalidSplitRange:
            "The split ranges are invalid. Use a non-overlapping format such as `1-3, 4, 5-7`.",
          loadFailed: "The PDF could not be loaded.",
          noPagesRemaining: "At least one page must remain in the PDF before download.",
          noSplitTargets: "Enter at least one page range to split.",
          unsupportedFormat: "Unsupported format. Please choose PDF files."
        }
      }
    }
  },
  "subtitle-shift-convert": {
    slug: "subtitle-shift-convert",
    title: "SRT / VTT Subtitle Shift & Convert",
    category: "Subtitle timing adjustment and format conversion",
    description:
      "Open an SRT or VTT subtitle file in the browser, shift all subtitle timings forward or backward together, convert between SRT and VTT, and download the cleaned result without sending the file to a server.",
    metadata: {
      title: "SRT / VTT Subtitle Shift & Convert | Cleanup & Conversion Toolkit",
      description:
        "Shift subtitle timing in SRT and VTT files, convert between subtitle formats, normalize numbering and headers, and download the updated file locally in the browser.",
      keywords: [
        "subtitle shift tool",
        "srt to vtt",
        "vtt to srt",
        "subtitle timing adjust",
        "caption converter"
      ]
    },
    structuredData: {
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any"
    },
    supportedFormats: [
      ".srt",
      ".vtt",
      "Local browser processing"
    ],
    capabilities: [
      "Load one SRT or VTT subtitle file directly in the browser",
      "Shift every subtitle cue forward or backward in milliseconds or seconds",
      "Convert SRT to VTT or VTT to SRT while normalizing numbering and headers",
      "Review raw text, timing changes and the processed output before download"
    ],
    idealFor: [
      "People fixing subtitle timing after a video export changed the sync",
      "Language learners adjusting subtitles to match a different release or audio delay",
      "Editors who need a quick subtitle format conversion without opening a full subtitle editor"
    ],
    steps: [
      {
        title: "Add the subtitle file",
        description:
          "Choose one SRT or VTT file, or drag and drop it into the upload area."
      },
      {
        title: "Set the timing shift",
        description:
          "Choose plus or minus, enter the amount, and select milliseconds or seconds."
      },
      {
        title: "Choose the output format",
        description:
          "Keep the original format or convert the subtitle file to SRT or VTT."
      },
      {
        title: "Review and download",
        description:
          "Compare the original text, processed text and timing list, then download the updated subtitle file."
      }
    ],
    examples: [
      {
        title: "Delay subtitles by 1.5 seconds after a video starts later",
        before: "00:00:05,000 --> 00:00:07,200",
        after: "00:00:06,500 --> 00:00:08,700",
        note:
          "Use a positive shift when the subtitles appear too early."
      },
      {
        title: "Move subtitles 300ms earlier and convert VTT to SRT",
        before: "00:01:12.400 --> 00:01:14.000",
        after: "00:01:12,100 --> 00:01:13,700",
        note:
          "Useful when a VTT track needs to be opened in a player or editor that expects SRT."
      }
    ],
    cautions: [
      "If a negative shift pushes cues before 00:00, this tool clips them to the start of the timeline.",
      "VTT-only extras such as header blocks or style blocks are not preserved when the output format is SRT.",
      "Broken or highly unusual subtitle files may fail to parse if their timestamp lines are malformed."
    ],
    faq: [
      {
        question: "What is the main difference between SRT and VTT?",
        answer:
          "SRT uses numeric cue lines and commas in timestamps, while VTT uses a WEBVTT header and dots in timestamps. VTT can also carry more web-oriented metadata."
      },
      {
        question: "When should I use a positive or negative shift?",
        answer:
          "Use a positive shift when subtitles appear too early. Use a negative shift when subtitles appear too late."
      },
      {
        question: "Does this upload my subtitle file anywhere?",
        answer:
          "No. The tool is designed to parse, shift and convert subtitle files locally in the browser."
      }
    ],
    relatedTools: [
      {
        href: "/tools/text-cleanup",
        label: "Text Cleanup Tool",
        description:
          "Useful when subtitle text also needs quick cleanup after timing adjustment."
      },
      {
        href: "/tools/file-batch-rename",
        label: "Batch File Rename Tool",
        description:
          "Helpful if the downloaded subtitle files need cleaner language or version labels."
      }
    ],
    relatedArticles: [
      {
        href: "/guide/shift-srt-vtt-subtitles",
        label: "How to shift SRT subtitles",
        description:
          "Read when to move subtitles earlier or later and when SRT / VTT conversion is useful."
      },
      {
        href: "/guide",
        label: "Guide library",
        description:
          "Browse step-by-step guides for common cleanup and conversion tasks."
      },
      {
        href: "/faq",
        label: "FAQ",
        description:
          "Check how input data is handled, supported formats and common usage questions."
      }
    ],
    history: [
      {
        date: "2026-04-14",
        summary:
          "Added the subtitle shift and conversion tool with local SRT/VTT parsing and download support."
      },
      {
        date: "2026-04-14",
        summary:
          "Added bulk timing shift, SRT/VTT conversion, timestamp preview and basic formatting normalization."
      }
    ],
    operation: {
      kind: "subtitleShiftConvert",
      ui: {
        title: "Subtitle timing and format controls",
        description:
          "Upload one subtitle file, adjust the timing shift, choose the output format, and review the result before download.",
        actions: {
          downloadLabel: "Download subtitle file",
          downloadingLabel: "Preparing subtitle file...",
          resetLabel: "Reset"
        },
        dropzone: {
          title: "Subtitle file",
          description:
            "Choose one SRT or VTT file, or drag and drop it here.",
          browseLabel: "Choose file",
          activeLabel: "Drop subtitle file here",
          hint:
            "The file stays in the browser. Parsing, timing shift and conversion all run locally."
        },
        emptyState: {
          title: "No subtitle file selected yet",
          description:
            "Add one SRT or VTT file first and the source text, timing list and processed preview will appear here."
        },
        fields: {
          cueTextLabel: "Cue text",
          endLabel: "End",
          offsetDirectionLabel: "Shift direction",
          offsetDirectionOptions: {
            minus: "Move earlier",
            plus: "Move later"
          },
          offsetLabel: "Amount to shift",
          offsetPlaceholder: "Example: 1.5",
          outputFormatLabel: "Output format",
          outputFormatOptions: {
            srt: "SRT",
            vtt: "VTT"
          },
          shiftUnitLabel: "Shift unit",
          shiftUnitOptions: {
            milliseconds: "Milliseconds",
            seconds: "Seconds"
          },
          startLabel: "Start",
          timestampListLabel: "Timestamp list"
        },
        helper: {
          clampNote:
            "If a negative shift moves a cue before 00:00, the cue is clipped at the start of the timeline.",
          localProcessingNote:
            "Subtitle parsing, shifting and conversion stay inside the browser. The site does not include a mechanism that sends this tool input for AI training.",
          srtVttDifferenceNote:
            "SRT uses cue numbers and commas in timestamps. VTT uses a WEBVTT header and dots in timestamps."
        },
        preview: {
          originalTextTitle: "Original subtitle text",
          processedTextTitle: "Processed subtitle text",
          processedTimingLabel: "Processed timing",
          sourceTimingLabel: "Original timing",
          title: "Subtitle preview and timing list"
        },
        sections: {
          conversion: "Format conversion",
          summary: "Current summary",
          timingShift: "Timing shift"
        },
        summary: {
          clampedCueCountLabel: "Cues clipped at 00:00",
          cueCountLabel: "Subtitle cues",
          fileLabel: "Selected file",
          offsetLabel: "Applied shift",
          outputFormatLabel: "Output format",
          sourceFormatLabel: "Source format"
        },
        status: {
          loading: "Loading subtitle file...",
          ready: "Preview ready"
        },
        validation: {
          emptyFile: "The selected subtitle file looks empty.",
          invalidFormat: "The file could not be read as a normal SRT or VTT subtitle file.",
          invalidTimestamp: "One or more timestamp lines look broken.",
          loadFailed: "The subtitle file could not be loaded.",
          noCues: "No subtitle cues were found in the file.",
          unsupportedFormat: "Unsupported format. Please use an .srt or .vtt file."
        }
      }
    }
  },
  "text-cleanup": {
    slug: "text-cleanup",
    title: "Text Cleanup Tool",
    category: "Text cleanup and list shaping",
    description:
      "Clean pasted text, tidy line breaks and normalize bullet lists directly in the browser before copying the result somewhere else.",
    metadata: {
      title: "Text Cleanup Tool | Cleanup & Conversion Toolkit",
      description:
        "A browser tool for cleaning pasted text, trimming blank lines and normalizing bullet lists.",
      keywords: [
        "text cleanup tool",
        "bullet list cleanup",
        "browser text formatter",
        "local text processing"
      ]
    },
    structuredData: {
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any"
    },
    supportedFormats: [
      "Plain text",
      "Bullet lists pasted from documents or chat tools",
      "Simple tabular text copied from spreadsheets"
    ],
    capabilities: [
      "Trim extra whitespace around each line",
      "Collapse repeated blank lines into a single gap",
      "Normalize mixed bullet symbols into a consistent list style",
      "Preview the cleaned result before copying"
    ],
    idealFor: [
      "People cleaning meeting notes before sharing",
      "Teams pasting content into forms, CMS fields or chat tools",
      "Anyone preparing rough text copied from documents or spreadsheets"
    ],
    steps: [
      {
        title: "Paste the original text",
        description:
          "Bring in rough text, notes or list content exactly as it was copied from the original source."
      },
      {
        title: "Choose the cleanup options",
        description:
          "Turn line trimming, blank-line cleanup and bullet normalization on or off depending on the source."
      },
      {
        title: "Review and copy the result",
        description:
          "Check the cleaned preview and copy it once the output looks ready for your next destination."
      }
    ],
    examples: [
      {
        title: "Meeting notes cleanup",
        before: "  Agenda\n\n\n・Confirm release date\n●Share draft links\n\n  Next step: follow up  ",
        after: "Agenda\n\n- Confirm release date\n- Share draft links\n\nNext step: follow up",
        note:
          "Extra blank lines are collapsed, bullet styles are unified and leading or trailing spaces are removed."
      },
      {
        title: "Chat-ready task list",
        before: " Tasks\n\n• Update banner copy\n○ Review csv headers\n   ・Send final memo ",
        after: "Tasks\n\n- Update banner copy\n- Review csv headers\n- Send final memo"
      }
    ],
    cautions: [
      "Review the output before using it in external systems or published content.",
      "Bullet normalization is intended for list-style lines and may not suit text where leading symbols carry special meaning.",
      "Very large or highly structured documents may need a more specialized tool later."
    ],
    faq: [
      {
        question: "Does this upload my text anywhere?",
        answer:
          "No. This tool processes text in the browser and does not include a mechanism that sends the input for AI training."
      },
      {
        question: "What kind of bullet symbols are normalized?",
        answer:
          "The tool focuses on common pasted list markers such as `・`, `•`, `●`, `○`, `▪` and simple leading hyphens."
      },
      {
        question: "Can I keep blank lines if I want to?",
        answer:
          "Yes. The cleanup options can be toggled individually so you can leave repeated blank lines untouched if needed."
      }
    ],
    relatedTools: [
      {
        href: "/tools/file-batch-rename",
        label: "Batch File Rename Tool",
        description:
          "Organize filenames, numbering and project labels locally before sharing files."
      }
    ],
    relatedArticles: [
      {
        href: "/guide",
        label: "How to use the tools",
        description:
          "Read the shared workflow for input, review and export before using more tools."
      },
      {
        href: "/faq",
        label: "FAQ",
        description:
          "Check how input data is handled, supported formats and support guidance."
      },
      {
        href: "/privacy",
        label: "Privacy policy",
        description:
          "See how tool inputs are handled and what the storage policy covers."
      }
    ],
    history: [
      {
        date: "2026-04-14",
        summary:
          "Added the text cleanup tool page with guide links and supporting page sections."
      },
      {
        date: "2026-04-14",
        summary:
          "Introduced the initial local-only text cleanup interaction with copy support."
      }
    ],
    operation: {
      kind: "textCleanup",
      ui: {
        title: "Tool workspace",
        description:
          "Paste text on the left, review the cleaned result on the right, and copy the output when it looks ready.",
        inputLabel: "Original text",
        inputPlaceholder:
          "Paste rough text, notes or bullet lists here...",
        outputLabel: "Cleaned output",
        outputPlaceholder:
          "Cleaned text will appear here after you start typing.",
        optionsLegend: "Cleanup options",
        options: {
          collapseBlankLines: "Collapse repeated blank lines",
          normalizeBullets: "Normalize common bullet symbols",
          trimLineEdges: "Trim extra spaces at the start and end of lines"
        },
        copyLabel: "Copy output",
        copiedLabel: "Copied",
        copyErrorLabel: "Copy failed. Please select the output manually.",
        clearLabel: "Clear"
      }
    }
  }
};
