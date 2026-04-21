import {ImageResponse} from "next/og";

import type {AppLocale} from "@/config/site";

export const shareImageAlt = "Cleanup & Conversion Toolkit preview card";
export const shareImageContentType = "image/png";
export const shareImageSize = {
  width: 1200,
  height: 630,
} as const;

type ShareImageKind = "opengraph" | "twitter";

const shareImageContent: Record<
  AppLocale,
  {
    description: string;
    eyebrow: string;
    localeLabel: string;
    points: string[];
    tags: string[];
    titleFirstLine: string;
    titleSecondLine: string;
  }
> = {
  ja: {
    description:
      "Rename files, clean CSV, reorder PDF pages, resize images and shift subtitles in your browser.",
    eyebrow: "BROWSER TOOLS FOR REPETITIVE CLEANUP WORK",
    localeLabel: "JA",
    points: [
      "In-browser processing",
      "Preview before export",
      "Batch-friendly downloads",
    ],
    tags: ["Files", "Tables", "PDF", "Subtitles"],
    titleFirstLine: "Cleanup &",
    titleSecondLine: "Conversion Toolkit",
  },
  en: {
    description:
      "Rename files, clean CSV, reorder PDF pages, resize images and shift subtitles in your browser.",
    eyebrow: "BROWSER TOOLS FOR REPETITIVE CLEANUP WORK",
    localeLabel: "EN",
    points: [
      "In-browser processing",
      "Preview before export",
      "Batch-friendly downloads",
    ],
    tags: ["Files", "Tables", "PDF", "Subtitles"],
    titleFirstLine: "Cleanup &",
    titleSecondLine: "Conversion Toolkit",
  },
};

function getShareImageContent(locale: AppLocale) {
  return shareImageContent[locale];
}

export function getShareImagePath(locale: AppLocale, kind: ShareImageKind) {
  return `/${locale}/${kind}-image`;
}

export function getOpenGraphImages(locale: AppLocale) {
  return [
    {
      alt: shareImageAlt,
      height: shareImageSize.height,
      url: getShareImagePath(locale, "opengraph"),
      width: shareImageSize.width,
    },
  ];
}

export function getTwitterImages(locale: AppLocale) {
  return [
    {
      alt: shareImageAlt,
      height: shareImageSize.height,
      url: getShareImagePath(locale, "twitter"),
      width: shareImageSize.width,
    },
  ];
}

export function createShareImageResponse(locale: AppLocale) {
  const content = getShareImageContent(locale);

  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "stretch",
          background: "#eef4fb",
          color: "#0f172a",
          display: "flex",
          fontFamily: "sans-serif",
          height: "100%",
          justifyContent: "center",
          padding: "34px",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            background: "rgba(37, 99, 235, 0.12)",
            borderRadius: "9999px",
            display: "flex",
            height: "260px",
            position: "absolute",
            right: "-36px",
            top: "-58px",
            width: "260px",
          }}
        />
        <div
          style={{
            background: "rgba(59, 130, 246, 0.08)",
            borderRadius: "9999px",
            bottom: "-84px",
            display: "flex",
            height: "240px",
            left: "-44px",
            position: "absolute",
            width: "240px",
          }}
        />
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #d9e4f3",
            borderRadius: "30px",
            boxShadow: "0 24px 64px rgba(37, 99, 235, 0.12)",
            display: "flex",
            height: "100%",
            justifyContent: "space-between",
            overflow: "hidden",
            padding: "52px",
            position: "relative",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: "700px",
            }}
          >
            <div
              style={{
                alignItems: "center",
                display: "flex",
                gap: "16px",
                marginBottom: "18px",
              }}
            >
              <div
                style={{
                  background: "#dbeafe",
                  border: "1px solid #bfdbfe",
                  borderRadius: "9999px",
                  color: "#1d4ed8",
                  display: "flex",
                  fontSize: "20px",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  padding: "10px 16px",
                }}
              >
                {content.localeLabel}
              </div>
              <div
                style={{
                  color: "#38628f",
                  display: "flex",
                  fontSize: "22px",
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                }}
              >
                {content.eyebrow}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  color: "#0f172a",
                  display: "flex",
                  fontSize: "80px",
                  fontWeight: 800,
                  letterSpacing: "-0.045em",
                  lineHeight: 1,
                  marginBottom: "8px",
                }}
              >
                {content.titleFirstLine}
              </div>
              <div
                style={{
                  color: "#215da8",
                  display: "flex",
                  fontSize: "80px",
                  fontWeight: 800,
                  letterSpacing: "-0.045em",
                  lineHeight: 1,
                  marginBottom: "24px",
                }}
              >
                {content.titleSecondLine}
              </div>
              <div
                style={{
                  color: "#31455f",
                  display: "flex",
                  fontSize: "31px",
                  lineHeight: 1.35,
                  maxWidth: "660px",
                }}
              >
                {content.description}
              </div>
            </div>
            <div
              style={{
                alignItems: "center",
                display: "flex",
                flexWrap: "wrap",
                gap: "14px",
              }}
            >
              {content.tags.map((tag) => (
                <div
                  key={tag}
                  style={{
                    background: "#eff6ff",
                    border: "1px solid #d6e8ff",
                    borderRadius: "9999px",
                    color: "#1f4f87",
                    display: "flex",
                    fontSize: "22px",
                    fontWeight: 700,
                    padding: "12px 18px",
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              background: "linear-gradient(180deg, #f8fbff 0%, #ecf4ff 100%)",
              border: "1px solid #d7e6fb",
              borderRadius: "28px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "28px",
              width: "304px",
            }}
          >
            <div
              style={{
                color: "#215da8",
                display: "flex",
                fontSize: "22px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                marginBottom: "18px",
              }}
            >
              SHARE PREVIEW
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              {content.points.map((point) => (
                <div
                  key={point}
                  style={{
                    alignItems: "center",
                    display: "flex",
                    gap: "14px",
                  }}
                >
                  <div
                    style={{
                      alignItems: "center",
                      background: "#dbeafe",
                      borderRadius: "9999px",
                      color: "#1d4ed8",
                      display: "flex",
                      fontSize: "20px",
                      fontWeight: 800,
                      height: "34px",
                      justifyContent: "center",
                      width: "34px",
                    }}
                  >
                    •
                  </div>
                  <div
                    style={{
                      color: "#163250",
                      display: "flex",
                      fontSize: "24px",
                      fontWeight: 700,
                      lineHeight: 1.3,
                    }}
                  >
                    {point}
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                background: "#215da8",
                borderRadius: "22px",
                color: "#ffffff",
                display: "flex",
                flexDirection: "column",
                padding: "18px 20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: "18px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  marginBottom: "10px",
                  opacity: 0.82,
                }}
              >
                GOOD FOR
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: "26px",
                  fontWeight: 700,
                  lineHeight: 1.35,
                }}
              >
                File cleanup, conversion, review and export work in one place.
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    shareImageSize,
  );
}
