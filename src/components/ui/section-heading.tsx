import type {ReactNode} from "react";

import {cx} from "@/lib/utils";

type Props = {
  actions?: ReactNode;
  align?: "start" | "center";
  className?: string;
  description?: string;
  eyebrow?: string;
  title: string;
  titleAs?: "h1" | "h2" | "h3";
};

export function SectionHeading({
  actions,
  align = "start",
  className,
  description,
  eyebrow,
  title,
  titleAs = "h2",
}: Props) {
  const Title = titleAs;

  return (
    <div
      className={cx(
        "space-y-3",
        align === "center" && "text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#215da8]">
          {eyebrow}
        </p>
      ) : null}
      <div
        className={cx(
          "flex gap-4",
          align === "center"
            ? "flex-col items-center"
            : "flex-col sm:flex-row sm:items-end sm:justify-between",
        )}
      >
        <div className="space-y-3">
          <Title className="font-display text-3xl tracking-tight text-foreground sm:text-4xl">
            {title}
          </Title>
          {description ? (
            <p className="max-w-3xl text-base leading-8 text-muted sm:text-lg">
              {description}
            </p>
          ) : null}
        </div>
        {actions}
      </div>
    </div>
  );
}
