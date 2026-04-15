import type {ElementType, ReactNode} from "react";

import {cx} from "@/lib/utils";

type Props<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
  size?: "default" | "narrow" | "wide";
};

const sizeClasses = {
  default: "max-w-6xl",
  narrow: "max-w-4xl",
  wide: "max-w-7xl",
} as const;

export function Container<T extends ElementType = "div">({
  as,
  children,
  className,
  size = "default",
}: Props<T>) {
  const Component = as ?? "div";

  return (
    <Component
      className={cx(
        "mx-auto w-full px-5 sm:px-6 lg:px-8",
        sizeClasses[size],
        className,
      )}
    >
      {children}
    </Component>
  );
}
