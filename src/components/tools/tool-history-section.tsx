import type {ToolHistoryEntry} from "@/content/tools/tool-types";
import {Card} from "@/components/ui/card";

type Props = {
  items: ToolHistoryEntry[];
  title: string;
};

export function ToolHistorySection({items, title}: Props) {
  return (
    <Card className="p-6 sm:p-7">
      <h2 className="text-xl font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      <ol className="mt-6 space-y-4">
        {items.map((item, index) => (
          <li
            className="flex gap-4 rounded-[26px] border border-line bg-[#fbfdff] px-5 py-4"
            key={`${item.date}-${index}`}
          >
            <span
              aria-hidden="true"
              className="mt-2 h-3 w-3 shrink-0 rounded-full bg-[#215da8]"
            />
            <div className="space-y-2">
              <time className="text-xs font-semibold uppercase tracking-[0.18em] text-[#215da8]">
                {item.date}
              </time>
              <p className="text-sm leading-7 text-muted sm:text-base">
                {item.summary}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}
