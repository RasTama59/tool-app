import {AppLink} from "@/components/ui/app-link";
import {Container} from "@/components/ui/container";
import {LocalProcessingBadge} from "@/components/ui/local-processing-badge";

type Props = {
  badge: string;
  categoriesTitle: string;
  categoryLinks: Array<{
    href: string;
    label: string;
  }>;
  copyright: string;
  description: string;
  pageLinks: Array<{
    href: string;
    label: string;
  }>;
  pagesTitle: string;
  title: string;
};

export function SiteFooter({
  badge,
  categoriesTitle,
  categoryLinks,
  copyright,
  description,
  pageLinks,
  pagesTitle,
  title,
}: Props) {
  return (
    <footer className="border-t border-line bg-[rgba(255,255,255,0.82)]">
      <Container className="max-w-[88rem] py-12" size="wide">
        <div className="grid gap-x-14 gap-y-10 lg:grid-cols-[minmax(0,2.15fr)_minmax(160px,0.65fr)_minmax(160px,0.65fr)] xl:grid-cols-[minmax(0,2.5fr)_minmax(180px,0.55fr)_minmax(180px,0.55fr)]">
          <div className="space-y-4">
            <LocalProcessingBadge label={badge} />
            <div className="space-y-3">
              <p className="text-[1.7rem] font-semibold leading-tight tracking-tight text-foreground sm:text-[1.85rem]">
                {title}
              </p>
              <p className="text-sm leading-7 text-muted sm:text-base">
                {description}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#215da8]">
              {categoriesTitle}
            </h2>
            <ul className="space-y-2.5">
              {categoryLinks.map((item) => (
                <li key={item.href}>
                  <AppLink
                    className="text-sm text-foreground/76 transition hover:text-foreground"
                    href={item.href}
                  >
                    {item.label}
                  </AppLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#215da8]">
              {pagesTitle}
            </h2>
            <ul className="space-y-2.5">
              {pageLinks.map((item) => (
                <li key={item.href}>
                  <AppLink
                    className="text-sm text-foreground/76 transition hover:text-foreground"
                    href={item.href}
                  >
                    {item.label}
                  </AppLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-10 border-t border-line pt-5 text-xs leading-6 text-foreground/55 sm:text-sm">
          {copyright}
        </p>
      </Container>
    </footer>
  );
}
