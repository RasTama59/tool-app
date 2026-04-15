"use client";

import {useState} from "react";

import {LocaleSwitcher} from "@/components/common/locale-switcher";
import type {AppLocale} from "@/config/site";
import {Link} from "@/i18n/navigation";
import {AppLink} from "@/components/ui/app-link";
import {Button} from "@/components/ui/button";
import {Container} from "@/components/ui/container";
import {LocalProcessingBadge} from "@/components/ui/local-processing-badge";
import {Card} from "@/components/ui/card";

type Props = {
  closeMenuLabel: string;
  brand: string;
  badge: string;
  navItems: Array<{
    href: string;
    label: string;
  }>;
  navigationLabel: string;
  openMenuLabel: string;
  pageLinks: Array<{
    href: string;
    label: string;
  }>;
  pagesTitle: string;
  localeSwitcher: {
    label: string;
    options: Array<{
      value: AppLocale;
      label: string;
    }>;
  };
};

export function SiteHeader({
  closeMenuLabel,
  brand,
  badge,
  navItems,
  navigationLabel,
  openMenuLabel,
  pageLinks,
  pagesTitle,
  localeSwitcher,
}: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-[rgba(249,252,255,0.9)] backdrop-blur-xl">
      <Container size="wide">
        <div className="flex items-center justify-between gap-4 py-4">
          <div className="flex min-w-0 shrink-0 items-center gap-3">
            <Link
              className="truncate text-base font-semibold tracking-tight text-foreground sm:text-lg"
              href="/"
            >
              {brand}
            </Link>
            <LocalProcessingBadge className="hidden 2xl:inline-flex" label={badge} />
          </div>

          <nav
            aria-label={navigationLabel}
            className="hidden items-center gap-2 text-[13px] text-foreground/72 min-[1180px]:flex xl:gap-3 xl:text-sm"
          >
            {navItems.map((item) => (
              <AppLink
                className="shrink-0 whitespace-nowrap rounded-full px-2.5 py-2 transition hover:bg-[#eef4fb] hover:text-foreground xl:px-3"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </AppLink>
            ))}
          </nav>

          <div className="hidden shrink-0 items-center gap-3 min-[1180px]:flex">
            <LocaleSwitcher
              label={localeSwitcher.label}
              options={localeSwitcher.options}
            />
          </div>

          <div className="flex shrink-0 items-center gap-2 min-[1180px]:hidden">
            <LocaleSwitcher
              label={localeSwitcher.label}
              options={localeSwitcher.options}
            />
            <Button
              aria-controls="mobile-site-menu"
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((current) => !current)}
              variant="secondary"
            >
              {isMenuOpen ? closeMenuLabel : openMenuLabel}
            </Button>
          </div>
        </div>

        {isMenuOpen ? (
          <Card
            className="mb-4 space-y-6 px-5 py-5 lg:hidden"
            id="mobile-site-menu"
            tone="accent"
          >
            <LocalProcessingBadge label={badge} />

            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#215da8]">
                {navigationLabel}
              </p>
              <nav aria-label={navigationLabel}>
                <ul className="space-y-2">
                  {navItems.map((item) => (
                    <li key={item.href}>
                      <AppLink
                        className="block rounded-2xl px-3 py-3 text-sm font-medium text-foreground transition hover:bg-white"
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </AppLink>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#215da8]">
                {pagesTitle}
              </p>
              <ul className="space-y-2">
                {pageLinks.map((item) => (
                  <li key={item.href}>
                    <AppLink
                      className="block rounded-2xl px-3 py-3 text-sm font-medium text-foreground transition hover:bg-white"
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </AppLink>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ) : null}
      </Container>
    </header>
  );
}
