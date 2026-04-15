import {cx} from "@/lib/utils";

type Props = {
  className?: string;
  label: string;
};

export function LocalProcessingBadge({className, label}: Props) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-2 rounded-full border border-[#d8e4f2] bg-[#f5f9ff] px-3 py-1.5 text-xs font-semibold text-[#174983]",
        className,
      )}
    >
      <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#215da8]" />
      {label}
    </span>
  );
}
