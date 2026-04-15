import type {ToolStep} from "@/content/tools/tool-types";
import {Card} from "@/components/ui/card";

type Props = {
  items: ToolStep[];
  title: string;
};

export function ToolStepsSection({items, title}: Props) {
  return (
    <Card className="p-6 sm:p-7">
      <h2 className="text-xl font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      <ol className="mt-6 grid gap-4 lg:grid-cols-3">
        {items.map((item, index) => (
          <li
            className="rounded-[28px] border border-line bg-[#fbfdff] p-5"
            key={`${item.title}-${index}`}
          >
            <div className="space-y-4">
              <span className="inline-flex rounded-full bg-[#eaf2ff] px-3 py-1 text-xs font-semibold tracking-[0.18em] text-[#215da8]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold tracking-tight text-foreground">
                  {item.title}
                </h3>
                <p className="text-sm leading-7 text-muted sm:text-base">
                  {item.description}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}
