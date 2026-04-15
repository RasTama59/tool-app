import type {ToolExample} from "@/content/tools/tool-types";
import {Card} from "@/components/ui/card";

type Props = {
  items: ToolExample[];
  labels: {
    after: string;
    before: string;
    note: string;
  };
  title: string;
};

export function ToolExampleSection({items, labels, title}: Props) {
  return (
    <Card className="p-6 sm:p-7">
      <h2 className="text-xl font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      <div className="mt-6 grid gap-4">
        {items.map((item) => (
          <article
            className="rounded-[28px] border border-line bg-[#fbfdff] p-5"
            key={item.title}
          >
            <h3 className="text-lg font-semibold tracking-tight text-foreground">
              {item.title}
            </h3>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div className="rounded-[24px] border border-[#e1e9f4] bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#215da8]">
                  {labels.before}
                </p>
                <pre className="mt-3 whitespace-pre-wrap break-words font-sans text-sm leading-7 text-muted">
                  {item.before}
                </pre>
              </div>
              <div className="rounded-[24px] border border-[#d3e3f6] bg-[#f8fbff] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#215da8]">
                  {labels.after}
                </p>
                <pre className="mt-3 whitespace-pre-wrap break-words font-sans text-sm leading-7 text-foreground">
                  {item.after}
                </pre>
              </div>
            </div>
            {item.note ? (
              <p className="mt-4 rounded-[22px] bg-[#eef4fb] px-4 py-3 text-sm leading-7 text-muted">
                <span className="font-semibold text-foreground">{labels.note}: </span>
                {item.note}
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </Card>
  );
}
