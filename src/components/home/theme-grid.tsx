import type {ThemeTone} from "@/content/home";
import {Card} from "@/components/ui/card";
import {Container} from "@/components/ui/container";
import {EmptyState} from "@/components/ui/empty-state";
import {SectionHeading} from "@/components/ui/section-heading";

type Props = {
  id: string;
  title: string;
  description: string;
  statusLabel?: string;
  emptyState: {
    action: {
      href: string;
      label: string;
    };
    eyebrow: string;
    title: string;
    description: string;
  };
  items: Array<{
    title: string;
    description: string;
    examples: string[];
    tone: ThemeTone;
  }>;
};

const toneClasses: Record<
  ThemeTone,
  {
    badge: string;
    panel: string;
  }
> = {
  sun: {
    badge: "bg-[#eaf2ff] text-[#1b4c88]",
    panel:
      "bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(243,248,255,0.98))]",
  },
  sea: {
    badge: "bg-[#e8f6f7] text-[#185f77]",
    panel:
      "bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(240,251,253,0.98))]",
  },
  berry: {
    badge: "bg-[#eef0ff] text-[#4452a5]",
    panel:
      "bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(245,246,255,0.98))]",
  },
};

export function ThemeGrid({
  id,
  title,
  description,
  statusLabel,
  emptyState,
  items,
}: Props) {
  return (
    <section className="py-12 sm:py-14" id={id}>
      <Container>
        <SectionHeading description={description} title={title} />

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {items.map((item) => {
            const tone = toneClasses[item.tone];

            return (
              <Card
                className={`p-6 ${tone.panel}`}
                key={item.title}
                tone="default"
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-xl font-semibold tracking-tight text-foreground">
                    {item.title}
                  </h3>
                  {statusLabel ? (
                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${tone.badge}`}
                    >
                      {statusLabel}
                    </span>
                  ) : null}
                </div>

                <p className="mt-4 text-sm leading-7 text-muted sm:text-base">
                  {item.description}
                </p>

                <ul className="mt-6 space-y-3">
                  {item.examples.map((example) => (
                    <li
                      className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm text-foreground/80"
                      key={example}
                    >
                      {example}
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>

        <div className="mt-6">
          <EmptyState
            action={emptyState.action}
            description={emptyState.description}
            eyebrow={emptyState.eyebrow}
            title={emptyState.title}
          />
        </div>
      </Container>
    </section>
  );
}
