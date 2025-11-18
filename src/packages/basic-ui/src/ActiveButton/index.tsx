import clsx from "clsx";
import React from "react";
import { useUITheme } from "../UIThemeProvider/useUITheme";

type Variant = "primary" | "secondary" | "disabled";

type Props = {
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const baseButtonVariants = {
  primary: {
    bg: "bg-[var(--color-primary)] border-[var(--color-primary)] border-2",
    text: "text-white text-button-active",
  },
  secondary: {
    bg: "bg-white border-[#D4D6DD] border",
    text: "text-[#222] text-button-choice",
  },
  disabled: {
    bg: "bg-[#D4D6DD] border-transparent",
    text: "text-[#8F9098] text-button-choice",
  },
};

export default function ActiveButton({
  children,
  disabled = false,
  variant = "primary",
  className = "",
  ...props
}: Props) {
  const theme = useUITheme();

  const variantKey = disabled ? "disabled" : variant;
  const baseStyle = baseButtonVariants[variantKey];
  const themeStyle = theme?.button?.[variantKey] ?? {};

  const buttonClassName = clsx(
    baseStyle.bg,
    "w-full cursor-pointer py-4",
    themeStyle.bg,
    className
  );

  const textClassName = clsx(baseStyle.text, "text-center", themeStyle.text);

  return (
    <button {...props} className={buttonClassName}>
      <p className={textClassName}>{children}</p>
    </button>
  );
}
