import {defineRouting} from "next-intl/routing";

import {appLocales, defaultLocale} from "@/config/site";

export const routing = defineRouting({
  locales: appLocales,
  defaultLocale,
});
