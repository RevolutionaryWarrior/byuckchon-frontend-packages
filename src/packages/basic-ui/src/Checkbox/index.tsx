import React from "react";
import clsx from "clsx";
import { useUITheme } from "../UIThemeProvider/useUITheme";

type Size = "sm" | "md" | "lg";
type Variant = "activate" | "inactivate" | "disabled";

type Props = {
  children?: React.ReactNode;
  defaultSize?: Size;
  variant?: Variant;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const baseSizeVariants = {
  sm: {
    box: "w-4 h-4",
    text: "w-2 h-2",
  },
  md: {
    box: "w-5 h-5",
    text: "w-2.5 h-2.5",
  },
  lg: {
    box: "w-6 h-6",
    text: "w-3 h-3",
  },
};

const baseInputVariants = {
  activate: {
    box: "bg-[#0058E4]",
    text: "bg-[#EEEEEE]",
  },
  inactivate: {
    box: "bg-transparent border-1 border-[#D4D6DD]",
    text: "bg-[#D4D6DD]",
  },
  disabled: {
    box: "bg-[#D4D6DD]",
    text: "bg-[#FEFEFE]",
  },
};

export default function Checkbox({
  children,
  disabled = false,
  defaultSize = "md",
  variant = "inactivate",
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
      className={clsx(
        "cursor-pointer",
        mergedStyle.box,
        baseSizeVariants[defaultSize].box,
        className
      )}
    >
      <p
        className={clsx(
          "text-center",
          mergedStyle.text,
          baseSizeVariants[defaultSize].text
        )}
      >
        {children}
      </p>
    </input>
  );
}
