import {AppLink} from "@/components/ui/app-link";

type BreadcrumbItem = {
  href?: string;
  label: string;
};

type Props = {
  items: BreadcrumbItem[];
  label?: string;
};

export function Breadcrumbs({items, label = "Breadcrumb"}: Props) {
  return (
    <nav aria-label={label}>
      <ol className="flex flex-wrap items-center gap-2 text-sm text-muted">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li className="flex items-center gap-2" key={`${item.label}-${index}`}>
              {item.href && !isLast ? (
                <AppLink className="transition hover:text-foreground" href={item.href}>
                  {item.label}
                </AppLink>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={isLast ? "font-medium text-foreground" : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast ? <span aria-hidden="true">/</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
