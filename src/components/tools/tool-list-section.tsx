import {Card} from "@/components/ui/card";
import {cx} from "@/lib/utils";

type Props = {
  columns?: "one" | "two";
  items: string[];
  title: string;
};

export function ToolListSection({
  columns = "one",
  items,
  title,
}: Props) {
  return (
    <Card className="p-6 sm:p-7">
      <h2 className="text-xl font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      <ul
        className={cx(
          "mt-5 grid gap-3",
          columns === "two" && "md:grid-cols-2",
        )}
      >
        {items.map((item, index) => (
          <li
            className="flex gap-3 rounded-[24px] border border-line bg-[#fbfdff] px-4 py-4 text-sm leading-7 text-muted sm:text-base"
            key={`${item}-${index}`}
          >
            <span
              aria-hidden="true"
              className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#215da8]"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
