import type {AppLocale} from "./site";

const localized = <T extends string>(ja: T, en: T) => ({ja, en});

export const contactProfile = {
  contactUrl:
    "https://docs.google.com/forms/d/e/1FAIpQLScjKbxDLtiPYElgo-Puc3_wA4GbGmG_0zW2X0Bfin-jnrfVdw/viewform?usp=publish-editor",
  contactLabel: localized("お問い合わせフォームを開く", "Open contact form"),
  responseTime: localized(
    "通常 3 営業日以内を目安にご案内します。",
    "Replies usually arrive within 3 business days.",
  ),
  supportHours: localized(
    "フォームは 24 時間送信できます。",
    "The form is available 24/7.",
  ),
};

export function getContactProfile(locale: AppLocale) {
  return {
    contactLabel: contactProfile.contactLabel[locale],
    contactUrl: contactProfile.contactUrl,
    responseTime: contactProfile.responseTime[locale],
    supportHours: contactProfile.supportHours[locale],
  };
}
