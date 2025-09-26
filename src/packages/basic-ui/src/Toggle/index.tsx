import React from "react";
import { useUITheme } from "../UIThemeProvider/useUITheme";

type Variant = "activate" | "unactivate";

type Props = {
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
} & React.InputHTMLAttributes<HTMLInputElement>;

const baseToggleVariants = {
  activate: {
    bg: "bg-[#ED6D01] border-[#ED6D01]",
    text: "text-white",
  },
  unactivate: {
    bg: "bg-[#F5F5F5] border-transparent",
    text: "text-[#8F9098]",
  },
};

export default function Toggle({
  children,
  disabled = false,
  variant = "activate",
  className = "",
  ...props
}: Props) {
  const theme = useUITheme();

  const variantKey = disabled ? "unactivate" : variant;
  const mergedStyle = {
    ...baseToggleVariants[variantKey],
    ...(theme?.toggle?.[variantKey] ?? {}),
  };

  return (
    <label className="inline-flex items-center cursor-pointer">
      <input type="checkbox" {...props} className="sr-only peer" />
      <span
        className={`${className} ${mergedStyle} w-12 h-7 rounded-full bg-gray-300 peer-checked:bg-blue-600 relative transition-colors duration-200`}
      >
        <span className="absolute left-1 top-1 w-5 h-5 rounded-full bg-white transition-transform duration-200 peer-checked:translate-x-5" />
      </span>
    </label>
  );
}
