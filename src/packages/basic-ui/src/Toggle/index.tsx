import React from "react";
import clsx from "clsx";
import { useUITheme } from "../UIThemeProvider/useUITheme";

type Variant = "activate" | "unactivate";

type Props = {
  children?: React.ReactNode;
  className?: string;
  variant?: Variant;
} & React.InputHTMLAttributes<HTMLInputElement>;

const baseToggleVariants = {
  activate: {
    bg: "bg-[#0058E4]",
  },
  unactivate: {
    bg: "bg-[#D4D6DD]",
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

  const inactive = {
    ...baseToggleVariants.unactivate,
    ...(theme?.toggle?.unactivate ?? {}),
  };
  const active = {
    ...baseToggleVariants.activate,
    ...(theme?.toggle?.activate ?? {}),
  };

  return (
    <label
      className={clsx("flex items-center w-11 h-7 cursor-pointer", className)}
    >
      <input
        type="checkbox"
        disabled={disabled}
        className="peer sr-only"
        {...props}
      />
      {children ?? (
        <span
          className={clsx(
            `relative w-full h-full rounded-full transition-colors duration-200 ${inactive.bg}`,
            `peer-checked:${active.bg} peer-checked:[&>span]:translate-x-4`,
            // disabled의 경우 아직 따로 디자인이 없어서 임의로 지정했습니다!
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <span className="absolute w-5 h-5 left-1 top-1 rounded-full bg-[#FEFEFE] transition-transform duration-200" />
        </span>
      )}
    </label>
  );
}
