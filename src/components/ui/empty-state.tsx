import {AppLink} from "@/components/ui/app-link";
import {Card} from "@/components/ui/card";
import {getButtonClasses} from "@/components/ui/button";

type Props = {
  action?: {
    href: string;
    label: string;
  };
  description: string;
  eyebrow?: string;
  title: string;
};

export function EmptyState({action, description, eyebrow, title}: Props) {
  return (
    <Card
      className="border-dashed px-6 py-10 text-center sm:px-8"
      tone="soft"
    >
      <div className="mx-auto max-w-2xl space-y-3">
        {eyebrow ? (
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#215da8]">
            {eyebrow}
          </p>
        ) : null}
        <h3 className="text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h3>
        <p className="text-sm leading-7 text-muted sm:text-base">{description}</p>
        {action ? (
          <div className="pt-2">
            <AppLink
              className={getButtonClasses({variant: "secondary"})}
              href={action.href}
            >
              {action.label}
            </AppLink>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
