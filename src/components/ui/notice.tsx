import {cx} from "@/lib/utils";

type NoticeTone = "info" | "warning";

type Props = {
  description: string;
  title: string;
  tone?: NoticeTone;
};

const toneClasses: Record<
  NoticeTone,
  {
    dot: string;
    panel: string;
    title: string;
  }
> = {
  info: {
    dot: "bg-[#215da8]",
    panel: "border border-[#cfe0f5] bg-[#f6faff]",
    title: "text-[#174983]",
  },
  warning: {
    dot: "bg-[#b46d1f]",
    panel: "border border-[#ecd7bd] bg-[#fff8ef]",
    title: "text-[#8d5515]",
  },
};

export function Notice({description, title, tone = "info"}: Props) {
  const styles = toneClasses[tone];
  const role = tone === "warning" ? "alert" : "note";

  return (
    <aside className={cx("rounded-[24px] px-5 py-4 sm:px-6", styles.panel)} role={role}>
      <div className="flex gap-3">
        <span
          aria-hidden="true"
          className={cx("mt-2 h-2.5 w-2.5 shrink-0 rounded-full", styles.dot)}
        />
        <div className="space-y-1.5">
          <h3 className={cx("text-base font-semibold", styles.title)}>{title}</h3>
          <p className="text-sm leading-7 text-muted">{description}</p>
        </div>
      </div>
    </aside>
  );
}
