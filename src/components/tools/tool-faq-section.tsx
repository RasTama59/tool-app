import type {ToolFaqItem} from "@/content/tools/tool-types";
import {Card} from "@/components/ui/card";

type Props = {
  items: ToolFaqItem[];
  title: string;
};

export function ToolFaqSection({items, title}: Props) {
  return (
    <Card className="p-6 sm:p-7">
      <h2 className="text-xl font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <details
            className="group rounded-[26px] border border-line bg-[#fbfdff]"
            key={item.question}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left">
              <span className="text-base font-semibold tracking-tight text-foreground">
                {item.question}
              </span>
              <span
                aria-hidden="true"
                className="rounded-full border border-[#d7e3f1] px-3 py-1 text-xs font-semibold text-[#215da8] transition group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <div className="px-5 pb-5">
              <p className="text-sm leading-7 text-muted sm:text-base">
                {item.answer}
              </p>
            </div>
          </details>
        ))}
      </div>
    </Card>
  );
}
