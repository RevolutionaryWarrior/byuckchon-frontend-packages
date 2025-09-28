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
    bg: "bg-[#ED6D01] border-[#ED6D01]",
    text: "text-white",
  },
  secondary: {
    bg: "bg-white border-[#ED6D01]",
    text: "text-[#ED6D01]",
  },
  disabled: {
    bg: "bg-[#F5F5F5] border-transparent",
    text: "text-[#8F9098]",
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
  const mergedStyle = {
    ...baseButtonVariants[variantKey],
    ...(theme?.button?.[variantKey] ?? {}),
  };

  return (
    <button {...props} className={`${className} ${mergedStyle.bg} w-full cursor-pointer`}>
      <p className={`${mergedStyle.text} text-center`}>{children}</p>
    </button>
  );
}
