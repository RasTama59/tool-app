import {AppLink} from "@/components/ui/app-link";
import {EmptyState} from "@/components/ui/empty-state";

type Props = {
  emptyState: {
    description: string;
    eyebrow: string;
    title: string;
  };
  items: Array<{
    description: string;
    href: string;
    label: string;
  }>;
  title: string;
};

export function ToolLinkSection({emptyState, items, title}: Props) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold tracking-tight text-foreground">
        {title}
      </h2>

      {items.length ? (
        <div className="grid gap-4">
          {items.map((item) => (
            <AppLink
              className="block rounded-[28px] border border-line bg-white p-6 shadow-[0_20px_46px_rgba(29,59,99,0.08)] transition hover:border-[#bfd4ed] hover:bg-[#fbfdff]"
              href={item.href}
              key={item.href}
            >
              <div className="space-y-2">
                <p className="text-lg font-semibold tracking-tight text-foreground">
                  {item.label}
                </p>
                <p className="text-sm leading-7 text-muted sm:text-base">
                  {item.description}
                </p>
              </div>
            </AppLink>
          ))}
        </div>
      ) : (
        <EmptyState
          description={emptyState.description}
          eyebrow={emptyState.eyebrow}
          title={emptyState.title}
        />
      )}
    </section>
  );
}
