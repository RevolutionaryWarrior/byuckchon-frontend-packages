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
    bg: "bg-black border-[#0054DA] border-2",
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
  const mergedStyle = {
    ...baseButtonVariants[variantKey],
    ...(theme?.button?.[variantKey] ?? {}),
  };

  return (
    <button
      {...props}
      className={`${className} ${mergedStyle.bg} w-full cursor-pointer py-4`}
    >
      <p className={`${mergedStyle.text} text-center`}>{children}</p>
    </button>
  );
}
