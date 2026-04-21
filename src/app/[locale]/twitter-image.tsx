import type {AppLocale} from "@/config/site";
import {createShareImageResponse, shareImageAlt, shareImageContentType, shareImageSize} from "@/lib/share-image";

type Props = {
  params: Promise<{locale: string}>;
};

export const alt = shareImageAlt;
export const contentType = shareImageContentType;
export const size = shareImageSize;

function resolveLocale(locale: string): AppLocale {
  return locale === "en" ? "en" : "ja";
}

export default async function TwitterImage({params}: Props) {
  const {locale} = await params;

  return createShareImageResponse(resolveLocale(locale));
}
