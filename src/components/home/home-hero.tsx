import {AppLink} from "@/components/ui/app-link";
import {getButtonClasses} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {Container} from "@/components/ui/container";
import {LocalProcessingBadge} from "@/components/ui/local-processing-badge";
import {Notice} from "@/components/ui/notice";

type Props = {
  badge: string;
  eyebrow: string;
  title: string;
  description: string;
  chips: string[];
  primaryAction: {
    href: string;
    label: string;
  };
  secondaryAction: {
    href: string;
    label: string;
  };
  panelLabel: string;
  panelTitle: string;
  panelItems: string[];
  footnote: string;
  notice: {
    title: string;
    description: string;
  };
};

export function HomeHero({
  badge,
  eyebrow,
  title,
  description,
  chips,
  primaryAction,
  secondaryAction,
  panelLabel,
  panelTitle,
  panelItems,
  footnote,
  notice,
}: Props) {
  return (
    <section className="pb-12 pt-10 sm:pt-14">
      <Container className="grid gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(340px,0.92fr)] lg:items-center">
        <div className="space-y-7">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex rounded-full border border-[#d5e4f4] bg-[#f5f9ff] px-4 py-1.5 text-sm font-medium text-[#215da8]">
              {eyebrow}
            </div>
            <LocalProcessingBadge label={badge} />
          </div>

          <div className="space-y-5">
            <h1 className="max-w-4xl font-display text-4xl leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="max-w-2xl text-base leading-8 text-muted sm:text-lg">
              {description}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <AppLink
              className={getButtonClasses({size: "lg"})}
              href={primaryAction.href}
            >
              {primaryAction.label}
            </AppLink>
            <AppLink
              className={getButtonClasses({size: "lg", variant: "secondary"})}
              href={secondaryAction.href}
            >
              {secondaryAction.label}
            </AppLink>
          </div>

          <ul className="grid gap-3 text-sm text-foreground/80 sm:grid-cols-3">
            {chips.map((chip) => (
              <li
                className="rounded-2xl border border-line bg-white px-4 py-3 shadow-[0_14px_34px_rgba(29,59,99,0.07)]"
                key={chip}
              >
                {chip}
              </li>
            ))}
          </ul>

          <Notice
            description={notice.description}
            title={notice.title}
            tone="info"
          />
        </div>

        <Card className="relative overflow-hidden p-7 sm:p-8" tone="accent">
          <div className="absolute -right-12 top-6 h-40 w-40 rounded-full bg-[#9fc1ea]/28 blur-3xl" />
          <div className="absolute -left-8 bottom-0 h-32 w-32 rounded-full bg-[#dceaf7]/70 blur-3xl" />

          <div className="relative space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#215da8]">
                {panelLabel}
              </p>
              <h2 className="font-display text-3xl leading-tight tracking-tight text-foreground">
                {panelTitle}
              </h2>
            </div>

            <ol className="space-y-3">
              {panelItems.map((item, index) => (
                <li
                  className="flex gap-4 rounded-2xl border border-[#d9e6f4] bg-white/92 px-4 py-4 shadow-[0_12px_30px_rgba(29,59,99,0.07)]"
                  key={item}
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#edf4fd] text-sm font-semibold text-[#215da8]">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-7 text-foreground/80">{item}</p>
                </li>
              ))}
            </ol>

            <p className="rounded-2xl border border-dashed border-[#c8d9ef] px-4 py-4 text-sm leading-7 text-muted">
              {footnote}
            </p>
          </div>
        </Card>
      </Container>
    </section>
  );
}
