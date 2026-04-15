import type {FixedPageLocaleMap} from "./fixed-page-types";

export const fixedPageContentEn: FixedPageLocaleMap = {
  about: {
    title: "About",
    description:
      "Learn what this site helps with and how supported tools handle your files and text.",
    metadata: {
      title: "About | Cleanup & Conversion Toolkit",
      description:
        "Overview of the site, the cleanup tasks it covers, and how supported tools handle input data.",
    },
    notice: {
      title: "A practical tool site for routine cleanup work",
      description:
        "The site focuses on repetitive cleanup and conversion tasks that usually happen before sharing, uploading or saving files.",
    },
    sections: {
      purpose: {
        title: "What you can do here",
        body: [
          "This site brings together browser tools for common cleanup work such as text cleanup, CSV and spreadsheet preparation, filename adjustments, PDF page organization and subtitle timing fixes.",
        ],
        subsections: {
          siteGoal: {
            title: "Made for everyday tasks",
            body: [
              "The goal is to make small but time-consuming preparation work easier to finish without opening heavy desktop software or building custom scripts.",
            ],
          },
          whyStructure: {
            title: "Tools and guidance stay close together",
            body: [
              "Each tool page includes supported formats, basic steps, cautions, FAQ items and related guides so you can move from reading to action without getting lost.",
            ],
          },
        },
      },
      audience: {
        title: "Who the site is for",
        body: [
          "The main audience is people who are comfortable with browser forms and office software, but want a simpler way to finish cleanup work.",
        ],
        subsections: {
          primaryUsers: {
            title: "Useful for non-engineers",
            body: [
              "The language and page structure are kept straightforward so routine admin, handoff and document-prep work can be completed calmly.",
            ],
          },
          tone: {
            title: "Clear wording over technical jargon",
            body: [
              "The site explains tasks in plain language so you can understand what a tool does before you start using it.",
            ],
          },
        },
      },
      approach: {
        title: "What to expect",
        body: [
          "Pages are structured so the working area and review area are easy to spot on both desktop and mobile.",
        ],
        subsections: {
          layout: {
            title: "Review before you export",
            body: [
              "Most tools are built around a simple flow: add input, review the result, then copy or download with fewer surprises.",
            ],
          },
          privacy: {
            title: "Process inputs in the browser",
            body: [
              "Supported tools process your files and text in the browser. The site does not include a mechanism that sends those inputs for AI training.",
            ],
          },
        },
      },
    },
  },
  guide: {
    title: "How to use the tools",
    description:
      "A short guide to the common flow used across the tools on this site.",
    metadata: {
      title: "How to use the tools | Cleanup & Conversion Toolkit",
      description:
        "Read the shared browser workflow for adding input, reviewing the result and exporting safely.",
    },
    notice: {
      title: "The basic flow stays simple",
      description:
        "Most pages follow the same pattern so you can move between tools without relearning the interface each time.",
    },
    sections: {
      start: {
        title: "Basic flow",
        body: [
          "In most tools, you start by pasting text or loading a file, then check the preview, and finally copy or download the result.",
        ],
        subsections: {
          input: {
            title: "Add the source data first",
            body: [
              "Depending on the tool, the source can be pasted text, a list, a CSV or spreadsheet file, images, PDFs or subtitle files.",
            ],
          },
          review: {
            title: "Review before finishing",
            body: [
              "Before downloading or copying anything, compare the preview carefully so you can catch duplicates, formatting issues or unwanted changes early.",
            ],
          },
        },
      },
      formats: {
        title: "Supported input styles",
        body: [
          "Each tool page lists supported formats near the top so you can confirm compatibility before you begin.",
        ],
        subsections: {
          text: {
            title: "Text and table cleanup",
            body: [
              "For text and spreadsheet-style tasks, the tools focus on practical formats such as plain text, CSV, TSV, XLSX and XLS.",
            ],
          },
          files: {
            title: "File-based tools",
            body: [
              "For image, PDF and subtitle tasks, processing stays in the browser and the final result is prepared for download after the preview looks right.",
            ],
          },
        },
      },
      tips: {
        title: "Before you export",
        body: [
          "A quick final review is still important, even when the tool handles the mechanical cleanup for you.",
        ],
        subsections: {
          local: {
            title: "Built around in-browser processing",
            body: [
              "Supported tools process files and text in the browser so you can review the result before downloading it.",
            ],
          },
          limitations: {
            title: "Check special cases",
            body: [
              "Unusual separators, very large files or highly irregular data may still need one last human check before you use the output elsewhere.",
            ],
          },
        },
      },
    },
  },
  faq: {
    title: "Frequently asked questions",
    description:
      "Common questions about uploads, supported formats, mobile use and support.",
    metadata: {
      title: "FAQ | Cleanup & Conversion Toolkit",
      description:
        "Answers to common questions about local processing, supported formats and contact options.",
    },
    notice: {
      title: "Key points before you start",
      description:
        "This page summarizes the questions people usually check before trying a cleanup tool for the first time.",
    },
    sections: {
      dataHandling: {
        title: "Data handling",
        body: [
          "Questions about uploads and storage are usually the first thing users want to confirm.",
        ],
        subsections: {
          localProcessing: {
            title: "Is processing done locally?",
            body: [
              "Supported tools process your files and text in the browser. The site does not include a mechanism that sends those inputs for AI training.",
            ],
          },
          storagePolicy: {
            title: "Are files stored permanently?",
            body: [
              "Supported tools are not intended to permanently retain the files or text you load for processing. If a page ever behaves differently, it should say so clearly.",
            ],
          },
        },
      },
      usage: {
        title: "Using the tools",
        body: [
          "The site focuses on common cleanup workflows rather than every advanced or specialist case.",
        ],
        subsections: {
          supportedFormats: {
            title: "What formats are supported?",
            body: [
              "Supported formats vary by tool. Check the supported-format chips on each page before you upload or paste anything.",
            ],
          },
          mobile: {
            title: "Can I use the site on mobile?",
            body: [
              "Yes. The layout is responsive, but larger file and table workflows will usually feel more comfortable on desktop.",
            ],
          },
        },
      },
      support: {
        title: "Support",
        body: [
          "If something is unclear or a tool does not behave as expected, you can use the contact page linked in the footer.",
        ],
        subsections: {
          updates: {
            title: "How do I know what changed?",
            body: [
              "Tool pages include update-history sections so you can quickly see recent additions and adjustments.",
            ],
          },
          contact: {
            title: "Where can I ask a question?",
            body: [
              "Use the contact form linked on the contact page for questions, bug reports or general feedback.",
            ],
          },
        },
      },
    },
  },
  privacy: {
    title: "Privacy policy",
    description:
      "How this site handles tool input data and in-browser processing.",
    metadata: {
      title: "Privacy policy | Cleanup & Conversion Toolkit",
      description:
        "Read how supported tools on this site handle files, text and in-browser processing.",
    },
    notice: {
      title: "Supported tools process inputs in-browser",
      description:
        "Files and text used in supported tools stay in the browser and are not sent for AI training.",
    },
    sections: {
      localFirst: {
        title: "How tool inputs are handled",
        body: [
          "Supported tools are designed so you can work with files and text while keeping the original input in your browser.",
        ],
        subsections: {
          browserProcessing: {
            title: "No AI-training upload mechanism",
            body: [
              "For supported cleanup and conversion tools, the site does not include a mechanism that sends your tool inputs for AI training.",
            ],
          },
          noRetention: {
            title: "No permanent storage of tool inputs",
            body: [
              "Supported tools are not intended to permanently store the files or text you load for processing.",
            ],
          },
        },
      },
      limitations: {
        title: "If an exception is needed",
        body: [
          "If a feature ever needs behavior outside the browser, that should be explained in a concrete and visible way on the relevant page.",
        ],
        subsections: {
          exceptions: {
            title: "No hidden uploads",
            body: [
              "Users should not need to guess whether a tool sends data away. The page should make that clear before work begins.",
            ],
          },
          disclosure: {
            title: "Visible disclosure before use",
            body: [
              "If any page ever behaves differently, that difference should be explained near the tool before you use it.",
            ],
          },
        },
      },
      updates: {
        title: "Policy updates",
        body: [
          "This policy is reviewed alongside product changes so privacy behavior stays aligned with the tools actually available on the site.",
        ],
        subsections: {
          changes: {
            title: "When this page is updated",
            body: [
              "Material changes to privacy behavior should be reflected here and also made clear on the affected tool pages.",
            ],
          },
          contact: {
            title: "Questions about privacy",
            body: [
              "If you want to confirm how a specific page behaves, please use the contact form before using the tool.",
            ],
          },
        },
      },
    },
  },
  terms: {
    title: "Terms of use",
    description:
      "Basic usage terms for the tools and pages provided on this site.",
    metadata: {
      title: "Terms of use | Cleanup & Conversion Toolkit",
      description:
        "Review the basic usage terms, review expectations and disclaimer for this site.",
    },
    notice: {
      title: "Built for practical cleanup work",
      description:
        "The tools are designed to help with routine tasks quickly, with clear defaults and predictable output.",
    },
    sections: {
      scope: {
        title: "Scope of the site",
        body: [
          "This site is intended for routine cleanup, formatting and conversion work that can be handled through straightforward browser workflows.",
        ],
        subsections: {
          intendedUse: {
            title: "Intended use",
            body: [
              "The tools are meant for practical day-to-day tasks and are not a replacement for specialist desktop software or enterprise data systems.",
            ],
          },
          unsupported: {
            title: "Not every case will be covered",
            body: [
              "Supported formats and edge cases vary by tool, so you should confirm the limits of a page before using it for critical work.",
            ],
          },
        },
      },
      responsibility: {
        title: "Review before final use",
        body: [
          "Even when a tool completes the transformation correctly, you are responsible for checking the output before sharing, uploading or publishing it.",
        ],
        subsections: {
          review: {
            title: "Final review is still important",
            body: [
              "The interface is designed to make review easier, but it does not remove the need to confirm that the result matches your actual purpose.",
            ],
          },
          disclaimer: {
            title: "Disclaimer",
            body: [
              "We do not guarantee that every output will be suitable for every downstream system, workflow or policy requirement.",
            ],
          },
        },
      },
      changes: {
        title: "Updates and availability",
        body: [
          "The site may change over time as tools are improved, added or adjusted.",
        ],
        subsections: {
          updates: {
            title: "Tool pages may evolve",
            body: [
              "When a tool changes, we aim to preserve the same clarity around supported formats, review steps and privacy behavior.",
            ],
          },
          availability: {
            title: "Availability",
            body: [
              "Temporary interruptions, maintenance or changes in supported behavior may occur while the site is being maintained.",
            ],
          },
        },
      },
    },
  },
  contact: {
    title: "Contact",
    description:
      "Use the contact form for questions, bug reports or general feedback about the site.",
    metadata: {
      title: "Contact | Cleanup & Conversion Toolkit",
      description:
        "Open the contact form for questions, issue reports and feedback about the tools on this site.",
    },
    notice: {
      title: "Questions and feedback are welcome",
      description:
        "If a page is unclear or a tool does not work as expected, please use the form linked below.",
    },
    panel: {
      title: "Contact information",
      items: {
        emailLabel: "Contact form",
        responseLabel: "Reply timing",
        hoursLabel: "Form availability",
      },
    },
    sections: {
      beforeContact: {
        title: "Before you send a message",
        body: [
          "If your question is about how a tool works, the tool page, FAQ and guide pages may already answer it.",
        ],
        subsections: {
          checkGuide: {
            title: "Pages worth checking first",
            body: [
              "Check the related tool page, the FAQ and the guide library if you want usage steps or supported-format details.",
            ],
          },
          includeDetails: {
            title: "Helpful details",
            body: [
              "If you are reporting a problem, it helps to mention the page you used and what happened on screen.",
            ],
          },
        },
      },
      methods: {
        title: "How to contact us",
        body: [
          "We currently handle questions, bug reports and feedback through the contact form shown above.",
        ],
        subsections: {
          primaryRoute: {
            title: "Contact form",
            body: [
              "Open the form, send your message, and we will review it through that contact route.",
            ],
          },
          responseTime: {
            title: "Reply timing",
            body: [
              "Please check the information panel above for the current reply target and form availability.",
            ],
          },
        },
      },
    },
  },
};
