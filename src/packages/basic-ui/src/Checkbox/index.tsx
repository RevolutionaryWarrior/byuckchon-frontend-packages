import React from "react";
import { useUITheme } from "../UIThemeProvider/useUITheme";

type Variant = "small" | "medium" | "large";

type Props = {
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
} & React.InputHTMLAttributes<HTMLInputElement>;

const baseInputVariants = {
  small: {
    text: "text-white",
    bg: "",
  },
  medium: {
    text: "text-[#ED6D01]",
    bg: "",
  },
  large: {
    text: "text-[#8F9098]",
    bg: "",
  },
};

export default function Checkbox({
  children,
  disabled = false,
  variant = "medium",
  className = "",
  ...props
}: Props) {
  const theme = useUITheme();

  const mergedStyle = {
    ...baseInputVariants[variant],
    ...(theme?.checkbox?.[variant] ?? {}),
  };

  return (
    <input
      type={"checkbox"}
      {...props}
      className={`${className} ${mergedStyle.bg} cursor-pointer`}
    >
      <p className={`${mergedStyle.text} text-center`}>{children}</p>
    </input>
  );
}
