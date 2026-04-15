import type {ButtonHTMLAttributes} from "react";

import {cx} from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type ButtonClassOptions = {
  className?: string;
  fullWidth?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[#215da8] text-white shadow-[0_16px_30px_rgba(33,93,168,0.18)] hover:bg-[#184b88]",
  secondary:
    "border border-line bg-white text-foreground hover:border-[#b8cae1] hover:bg-[#f8fbff]",
  ghost: "text-foreground hover:bg-[#eef4fb]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-10 px-3.5 text-sm",
  md: "min-h-11 px-4 text-sm sm:px-5",
  lg: "min-h-12 px-5 text-sm sm:px-6 sm:text-base",
};

export function getButtonClasses({
  className,
  fullWidth = false,
  size = "md",
  variant = "primary",
}: ButtonClassOptions = {}) {
  return cx(
    "inline-flex items-center justify-center rounded-full font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#215da8]/40 focus-visible:ring-offset-2",
    sizeClasses[size],
    variantClasses[variant],
    fullWidth && "w-full",
    className,
  );
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & ButtonClassOptions;

export function Button({
  children,
  className,
  fullWidth,
  size = "md",
  type = "button",
  variant = "primary",
  ...props
}: Props) {
  return (
    <button
      className={getButtonClasses({className, fullWidth, size, variant})}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
