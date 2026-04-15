"use client";

import {useLocale} from "next-intl";
import {useTransition} from "react";

import type {AppLocale} from "@/config/site";
import {usePathname, useRouter} from "@/i18n/navigation";

type Props = {
  label: string;
  options: Array<{
    value: AppLocale;
    label: string;
  }>;
};

export function LocaleSwitcher({label, options}: Props) {
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div
      aria-busy={isPending}
      aria-label={label}
      className="inline-flex shrink-0 whitespace-nowrap rounded-full border border-line bg-surface-strong p-1 shadow-[0_10px_30px_rgba(73,55,30,0.08)]"
      role="group"
    >
      {options.map((option) => {
        const isActive = option.value === locale;

        return (
          <button
            aria-pressed={isActive}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition ${
              isActive
                ? "bg-[#215da8] text-white shadow-sm"
                : "text-foreground/70 hover:bg-white hover:text-foreground"
            } ${isPending && !isActive ? "opacity-60" : ""}`}
            disabled={isPending}
            key={option.value}
            onClick={() => {
              if (isActive) {
                return;
              }

              startTransition(() => {
                router.replace(pathname, {locale: option.value});
              });
            }}
            type="button"
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
