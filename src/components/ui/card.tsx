import type {HTMLAttributes} from "react";

import {cx} from "@/lib/utils";

type CardTone = "default" | "soft" | "accent";

const toneClasses: Record<CardTone, string> = {
  default:
    "border border-line bg-white shadow-[0_20px_46px_rgba(29,59,99,0.08)]",
  soft:
    "border border-[#dce7f4] bg-[#f8fbff] shadow-[0_14px_32px_rgba(29,59,99,0.05)]",
  accent:
    "border border-[#cfe0f5] bg-[linear-gradient(180deg,#ffffff_0%,#f5f9ff_100%)] shadow-[0_20px_48px_rgba(33,93,168,0.1)]",
};

type Props = HTMLAttributes<HTMLDivElement> & {
  tone?: CardTone;
};

export function Card({
  children,
  className,
  tone = "default",
  ...props
}: Props) {
  return (
    <div
      className={cx("rounded-[28px]", toneClasses[tone], className)}
      {...props}
    >
      {children}
    </div>
  );
}
