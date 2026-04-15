import type {GuideContentDictionary} from "./guide-types";

export const guideContentEn: GuideContentDictionary = {
  "rename-files-in-bulk": {
    slug: "rename-files-in-bulk",
    category: "File naming guide",
    title: "How to make file names consistent in bulk",
    description:
      "A practical guide for lining up filenames with prefixes, suffixes and numbering before you share or archive a folder.",
    summary:
      "If a folder contains mixed naming styles, decide on one simple pattern first, preview the result, then export the renamed set in one pass.",
    intro: [
      "Shared folders become hard to work with when filenames mix different dates, separators, abbreviations and numbering styles. Even when the files themselves are fine, messy names slow down search, review and handoff.",
      "This guide shows a safe way to bring a group of filenames into one pattern without editing them one by one. It is designed for non-engineers who want a calm, predictable process before sending files to teammates or clients.",
    ],
    metadata: {
      title: "How to make file names consistent in bulk | Cleanup & Conversion Toolkit",
      description:
        "Learn a simple way to make filenames consistent in bulk with prefixes, suffixes and numbering rules before downloading a renamed ZIP.",
      keywords: [
        "rename files in bulk",
        "batch rename guide",
        "filename consistency",
        "prefix suffix numbering",
        "file naming guide",
      ],
    },
    publishedAt: "2026-04-14",
    updatedAt: "2026-04-14",
    readTimeMinutes: 5,
    steps: [
      {
        title: "Decide on one naming pattern first",
        description:
          "Pick the pieces you want every file to share, such as a project label, a short suffix, and whether sequential numbering should appear at the front or end.",
      },
      {
        title: "Add the files and enter the rule",
        description:
          "Upload the files, then fill in only the fields you need. Start with a small, obvious change such as a shared prefix or a simple number sequence.",
      },
      {
        title: "Review the preview carefully",
        description:
          "Compare original and new names, check for duplicates, and confirm that the extension still looks correct before you export anything.",
      },
      {
        title: "Download the renamed ZIP",
        description:
          "Once the preview looks right, download the renamed set as a ZIP file and confirm the final names in your normal folder view.",
      },
    ],
    sections: [
      {
        title: "When bulk renaming helps most",
        body: [
          "Bulk renaming is useful when the actual file contents are already correct but the naming style is inconsistent. Common examples include scanned documents, product images, subtitle files, export batches and meeting materials collected from different people.",
          "The biggest win usually comes from reducing decision-making. When every file follows the same pattern, you spend less time wondering which version is newer, whether a folder is complete, or what to attach to an email.",
        ],
        list: [
          "Mixed separators such as spaces, dashes and underscores",
          "Numbers that do not line up because some files use one digit and others use three",
          "Folders where only some files include a project name or date",
        ],
      },
      {
        title: "A safe naming rule to start with",
        body: [
          "For most teams, a simple pattern is better than a clever one. A shared prefix can show the project or client name, while a suffix can show language, revision or channel. Numbering is most helpful when order matters.",
          "Try to keep the pattern readable at a glance. If someone opens the folder months later, they should still understand what the file is without guessing why a short code was used.",
        ],
        subsections: [
          {
            title: "Keep the original extension",
            body: [
              "The extension tells your computer which file type it is. A good rename flow changes the visible filename but leaves the extension in place so the file still opens normally.",
            ],
          },
          {
            title: "Use numbering only when order matters",
            body: [
              "Sequential numbers are useful for slides, scenes, shots, pages and review batches. If the files do not have a natural order, extra numbering can make names longer without making the folder easier to use.",
            ],
          },
        ],
      },
      {
        title: "Common mistakes to avoid",
        body: [
          "The most common problem is creating duplicate names by accident. This happens when two files become identical after replacing a word, removing a suffix or applying the same short prefix to many files.",
          "Another mistake is making the new pattern too dense. A filename that includes every possible detail can become harder to scan than the original messy version.",
        ],
        list: [
          "Do not remove the extension",
          "Do not rely on a preview you only skimmed once",
          "Do not mix version labels and numbering without deciding what each part means",
        ],
      },
      {
        title: "How the browser tool fits into the workflow",
        body: [
          "The matching tool keeps processing local in the browser. You can add a batch of files, test a naming pattern, inspect the preview and export a renamed ZIP without sending the source files to a server.",
          "That makes it useful when you want a quick, low-friction cleanup step before archive upload, team handoff or client delivery. It is especially handy when you know the exact naming pattern you want, but do not want to rename dozens of files by hand.",
        ],
      },
    ],
    faq: [
      {
        question: "Should I put the number at the beginning or the end?",
        answer:
          "Put the number at the beginning when sort order matters most. Put it at the end when the project label should be easier to read first.",
      },
      {
        question: "What if two files end up with the same new name?",
        answer:
          "The preview should warn you about duplicate names before download. If you see duplicates, add another label such as a suffix or adjust the numbering start and digits.",
      },
      {
        question: "Is this better than renaming files manually in the folder?",
        answer:
          "For one or two files, manual renaming is fine. For a batch, previewing one rule across all files is usually faster and reduces avoidable mistakes.",
      },
    ],
    relatedGuideSlugs: [
      "clean-csv-empty-lines-duplicates",
      "shift-srt-vtt-subtitles",
    ],
    relatedToolSlugs: ["file-batch-rename", "text-cleanup"],
  },
  "clean-csv-empty-lines-duplicates": {
    slug: "clean-csv-empty-lines-duplicates",
    category: "CSV cleanup guide",
    title: "How to remove blank lines and duplicates from CSV",
    description:
      "A plain-language walkthrough for cleaning exported CSV or Excel data before you share, upload or review it.",
    summary:
      "Start by deciding whether the first row is a header, then remove blank rows, trim spaces, and delete exact duplicates before exporting a clean file.",
    intro: [
      "CSV files often look simple, but exported data can still contain blank lines, repeated rows, empty columns and small spacing issues that make the file harder to review or import.",
      "This guide focuses on the cleanup steps that help most often for non-engineers: fixing obvious row noise, keeping the needed columns and exporting a cleaner file without opening a heavy spreadsheet workflow.",
    ],
    metadata: {
      title: "How to remove blank lines and duplicates from CSV | Cleanup & Conversion Toolkit",
      description:
        "Learn a simple cleanup flow for CSV and Excel files: remove blank rows, trim cell spaces, delete duplicate rows and keep only the columns you need.",
      keywords: [
        "csv cleanup guide",
        "remove duplicate rows",
        "remove blank lines csv",
        "clean spreadsheet export",
        "excel cleanup guide",
      ],
    },
    publishedAt: "2026-04-14",
    updatedAt: "2026-04-14",
    readTimeMinutes: 6,
    steps: [
      {
        title: "Check what the first row means",
        description:
          "Before cleaning anything, confirm whether the first row contains column names or normal data. This changes how the tool should treat that row.",
      },
      {
        title: "Remove blank rows and trim spaces",
        description:
          "Delete rows that contain no useful data, then trim extra spaces at the start and end of each cell so values compare more cleanly.",
      },
      {
        title: "Delete exact duplicate rows and empty columns",
        description:
          "Remove repeated records and columns that contain no meaningful values, especially when the file came from a rough export or copied report.",
      },
      {
        title: "Keep only the output you need",
        description:
          "If the handoff only needs a few columns, export just those fields in CSV or XLSX so the final file is easier to review.",
      },
    ],
    sections: [
      {
        title: "Why CSV exports get messy",
        body: [
          "CSV and spreadsheet exports are often produced by systems that were designed for reporting, not handoff. They may include helper columns, extra spacing, empty rows between sections or records that appear twice because of export settings.",
          "None of these problems are dramatic on their own, but together they make a file harder to scan and more likely to cause confusion when someone imports it into another system.",
        ],
      },
      {
        title: "The cleanup order that works well",
        body: [
          "A calm cleanup order usually saves time. First confirm the header row, then remove blank rows, trim surrounding spaces, delete exact duplicates and finally choose which columns belong in the final export.",
          "This order matters because duplicate detection works better after cell spacing has been normalized, and column selection is easier after the obvious noise is gone.",
        ],
        list: [
          "Header row check",
          "Blank row removal",
          "Whitespace trimming",
          "Exact duplicate removal",
          "Empty-column cleanup and column selection",
        ],
      },
      {
        title: "Mistakes people make during spreadsheet cleanup",
        body: [
          "One common mistake is assuming the first row is always a header. If the file starts with real data, treating it as a header can silently drop an important record from the cleaned output.",
          "Another mistake is deleting columns too early. Keep columns visible until you are sure they are not needed for review, matching or follow-up checks.",
        ],
        subsections: [
          {
            title: "Blank rows are not always harmless",
            body: [
              "Some systems and workflows treat blank rows as the end of a dataset. Removing them before export can make the file behave more predictably when it is opened elsewhere.",
            ],
          },
          {
            title: "Repeated spaces can hide duplicates",
            body: [
              "Rows that look identical to the eye may not count as duplicates if one cell contains extra spaces. Trimming cells first gives you a cleaner result.",
            ],
          },
        ],
      },
      {
        title: "When the browser cleaner is a good fit",
        body: [
          "The matching tool is useful when you want a fast cleanup pass without editing formulas or workbook design. It keeps processing local in the browser and focuses on straightforward cleanup actions that are easy to review.",
          "If your goal is simply to remove blank rows, repeated records, empty columns and extra spaces before sending a file onward, the tool keeps that workflow short and readable.",
        ],
      },
    ],
    faq: [
      {
        question: "Will the cleaned file keep Excel formulas and styling?",
        answer:
          "No. The cleanup flow focuses on table values and output, not workbook styling or formulas. It is best for preparing clean data, not preserving layout.",
      },
      {
        question: "Should I export as CSV or XLSX?",
        answer:
          "Choose CSV when you want a simple, portable text file. Choose XLSX when the recipient prefers a spreadsheet file or when you want a more familiar download format.",
      },
      {
        question: "Can I keep only a few columns?",
        answer:
          "Yes. After cleaning, it is often helpful to export only the columns needed for the next handoff so the final file is easier to read.",
      },
    ],
    relatedGuideSlugs: [
      "rename-files-in-bulk",
      "reorder-pdf-pages",
    ],
    relatedToolSlugs: ["csv-excel-cleaner", "text-cleanup"],
  },
  "reorder-pdf-pages": {
    slug: "reorder-pdf-pages",
    category: "PDF organization guide",
    title: "How to fix PDF page order",
    description:
      "A simple guide for reordering or deleting PDF pages when a document was exported, scanned or merged in the wrong order.",
    summary:
      "Check the final reading order first, remove pages you do not need, then move the remaining pages into place and download a cleaned PDF copy.",
    intro: [
      "PDF documents often become awkward after scanning, printing to PDF or combining pages from different sources. A few pages may appear in the wrong order, or a couple of unnecessary pages may still be attached at the beginning or end.",
      "This guide explains a simple review-first process so you can fix the sequence without turning the task into a full document editing project.",
    ],
    metadata: {
      title: "How to fix PDF page order | Cleanup & Conversion Toolkit",
      description:
        "Learn how to reorder or delete PDF pages with a simple browser workflow before downloading a cleaned PDF.",
      keywords: [
        "reorder pdf pages",
        "fix pdf page order",
        "delete pdf pages",
        "pdf page organizer guide",
        "browser pdf workflow",
      ],
    },
    publishedAt: "2026-04-14",
    updatedAt: "2026-04-14",
    readTimeMinutes: 5,
    steps: [
      {
        title: "Open the PDF and review the page list",
        description:
          "Load the file, then confirm which pages need to move or disappear before changing the order.",
      },
      {
        title: "Delete pages you know you do not need",
        description:
          "Removing cover pages, blank scans or duplicate pages first makes the remaining reorder task easier to understand.",
      },
      {
        title: "Move pages into the final reading order",
        description:
          "Use the visible page list to shift pages up or down until the document reads naturally from start to finish.",
      },
      {
        title: "Download the organized PDF",
        description:
          "Export a fresh copy once the new order looks correct and the selected pages match what you want to keep.",
      },
    ],
    sections: [
      {
        title: "Typical cases where page order breaks",
        body: [
          "Page order problems often come from scans that were captured in chunks, print-to-PDF exports from mixed materials, or merged documents where the source files were not assembled carefully.",
          "In many of these cases, you do not need advanced editing. You only need a quick way to see the sequence, remove obvious extras and put the pages back into the intended order.",
        ],
      },
      {
        title: "A review-first way to organize the document",
        body: [
          "Before moving pages around, decide what the finished reading order should be. That might sound obvious, but it prevents the common habit of dragging pages around while still figuring out the structure.",
          "A quick checklist helps: confirm the first page, the last page, any repeated pages, and whether attachments or appendix pages should stay where they are.",
        ],
        list: [
          "Which page should open the document?",
          "Are any pages blank or duplicated?",
          "Does the ending still make sense after cleanup?",
        ],
      },
      {
        title: "What to watch out for",
        body: [
          "When page thumbnails are small, it is easy to move the wrong page by mistake. A numbered list or clear page labels help reduce that risk, especially on mobile screens or compact layouts.",
          "Another common issue is forgetting that page numbers shown on the document itself may not match the PDF's current page order. Always check both the visual content and the page position in the list.",
        ],
        subsections: [
          {
            title: "Delete only after one quick check",
            body: [
              "It is safer to confirm the content once before deleting a page, especially when pages have similar headers or only slight layout differences.",
            ],
          },
          {
            title: "Keep a source copy nearby",
            body: [
              "Even when the tool works locally and exports a clean result, keeping the original PDF untouched makes it easier to retry if the order needs another pass.",
            ],
          },
        ],
      },
      {
        title: "Why the local page organizer is useful",
        body: [
          "The matching tool focuses on the first version of the workflow that matters most: reorder pages, delete the ones you do not need, then export the organized PDF. It keeps the interaction simple instead of mixing in too many advanced options at once.",
          "Because the file stays in the browser, it fits well for quick corrections before sending meeting materials, application PDFs or scanned handouts onward.",
        ],
      },
    ],
    faq: [
      {
        question: "Can I rotate or merge PDFs here too?",
        answer:
          "Yes for merge and split. The current tool supports combining multiple PDFs into one file, splitting page ranges into separate PDFs, reordering pages and deleting pages. Rotation is not included yet.",
      },
      {
        question: "Will the original file be overwritten?",
        answer:
          "No. The tool generates a new organized PDF for download. Your original source file stays untouched unless you replace it yourself later.",
      },
      {
        question: "Is this okay for mobile?",
        answer:
          "Simple review and small edits are possible, but page organization is usually more comfortable on desktop because the page list is easier to scan.",
      },
    ],
    relatedGuideSlugs: [
      "clean-csv-empty-lines-duplicates",
      "shift-srt-vtt-subtitles",
    ],
    relatedToolSlugs: ["pdf-page-organizer", "file-batch-rename"],
  },
  "shift-srt-vtt-subtitles": {
    slug: "shift-srt-vtt-subtitles",
    category: "Subtitle timing guide",
    title: "How to shift SRT subtitles and convert between SRT and VTT",
    description:
      "A beginner-friendly guide for moving subtitle timing forward or backward and converting subtitle files between SRT and VTT.",
    summary:
      "If subtitles appear too early or too late, choose a positive or negative offset, check the preview against the timestamp list, then export the format your player or editor needs.",
    intro: [
      "Subtitle files are small, but timing errors are very noticeable. A track that is only half a second early or late can make a video feel awkward, especially in tutorials, interviews and language-learning material.",
      "This guide explains when to move subtitles earlier or later, how SRT and VTT differ, and how to review the result before downloading an updated subtitle file.",
    ],
    metadata: {
      title:
        "How to shift SRT subtitles and convert between SRT and VTT | Cleanup & Conversion Toolkit",
      description:
        "Learn how to move subtitle timing earlier or later, understand the difference between SRT and VTT, and convert subtitle files in the browser.",
      keywords: [
        "shift srt subtitles",
        "srt to vtt guide",
        "vtt to srt guide",
        "subtitle timing adjustment",
        "subtitle conversion guide",
      ],
    },
    publishedAt: "2026-04-14",
    updatedAt: "2026-04-14",
    readTimeMinutes: 6,
    steps: [
      {
        title: "Open the SRT or VTT file",
        description:
          "Load one subtitle file and check that the cue list looks normal before applying any shift.",
      },
      {
        title: "Choose plus or minus and set the amount",
        description:
          "Use a positive shift when the subtitles appear too early, or a negative shift when they appear too late. Enter the amount in seconds or milliseconds.",
      },
      {
        title: "Pick the output format you need",
        description:
          "Keep the original format when possible, or convert between SRT and VTT if your player, editor or platform expects a different subtitle type.",
      },
      {
        title: "Review the processed preview and download",
        description:
          "Compare the original and updated timing list, then export the adjusted subtitle file once the shift looks correct.",
      },
    ],
    sections: [
      {
        title: "What SRT and VTT do differently",
        body: [
          "SRT is a common subtitle format used by many players and editing tools. It typically uses numbered cues and commas in timestamps. VTT is common on the web and starts with a WEBVTT header while using dots in timestamps.",
          "In day-to-day use, both formats can represent the same dialogue timing. The most important difference for beginners is usually compatibility: one platform may want SRT while another is happier with VTT.",
        ],
      },
      {
        title: "When to move subtitles earlier or later",
        body: [
          "If subtitle text appears before someone starts speaking, the subtitles are too early and need a positive delay. If the text shows up after the line has already started, the subtitles are too late and need to move earlier with a negative shift.",
          "It helps to test with a line that has a clear spoken start, such as a greeting, a clap, or a scene cut. That makes it easier to estimate whether the track is off by a few hundred milliseconds or by whole seconds.",
        ],
        list: [
          "Positive shift: subtitles appear too early",
          "Negative shift: subtitles appear too late",
          "Milliseconds are useful for small sync issues",
          "Seconds are easier when the whole track is offset by a larger amount",
        ],
      },
      {
        title: "Common subtitle timing mistakes",
        body: [
          "A common mistake is applying a large shift after checking only one unclear line. Another is forgetting that a player may cache an old subtitle file, making it seem like the export did not change anything.",
          "You should also watch for cues that move before the start of the timeline. A careful tool will clamp those cues to 00:00 instead of creating invalid negative timestamps.",
        ],
        subsections: [
          {
            title: "Do one quick preview after shifting",
            body: [
              "Review a few cues from the beginning, middle and end of the subtitle list. If the whole track has a constant offset, those checkpoints should all feel more accurate after one shift.",
            ],
          },
          {
            title: "Convert formats only when needed",
            body: [
              "If your current format already works in the destination app, you do not need to convert it. Conversion is most helpful when a tool or platform only accepts one subtitle type.",
            ],
          },
        ],
      },
      {
        title: "Why the browser subtitle tool is a good fit",
        body: [
          "The matching tool is built for one-file subtitle adjustments that are easy to preview. You can load an SRT or VTT file, shift timing, convert the format and download the result without sending the subtitle text to a server.",
          "That makes it useful for video review, quick localization checks and language-learning material where you want a direct fix instead of a full subtitle editing environment.",
        ],
      },
    ],
    faq: [
      {
        question: "Which format should I choose, SRT or VTT?",
        answer:
          "Choose the format your destination tool or platform expects. If you are unsure, SRT is widely supported, while VTT is especially common for web video workflows.",
      },
      {
        question: "What if the subtitles drift more and more over time?",
        answer:
          "A simple global shift works best when the whole track is early or late by a constant amount. If the timing drifts gradually, the subtitle file may need more detailed editing than a single offset.",
      },
      {
        question: "Will this change the subtitle text itself?",
        answer:
          "The main workflow focuses on timing and format. It keeps the cue text intact, aside from basic formatting normalization needed for a clean export.",
      },
    ],
    relatedGuideSlugs: [
      "rename-files-in-bulk",
      "reorder-pdf-pages",
    ],
    relatedToolSlugs: ["subtitle-shift-convert", "text-cleanup"],
  },
};
