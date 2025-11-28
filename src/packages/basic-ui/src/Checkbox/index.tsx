import React from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { useUITheme } from "../UIThemeProvider/useUITheme";
import type { CheckboxTheme } from "./theme";

type Size = "sm" | "md" | "lg";
type Variant = "activate" | "inactivate" | "disabled";

type Props = {
  children?: React.ReactNode;
  defaultSize?: Size;
  variant?: Variant;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const baseSizeVariants = {
  sm: { box: "w-4 h-4 ", text: "w-2.5 h-2.75" },
  md: { box: "w-5 h-5 ", text: "w-3 h-3.25" },
  lg: { box: "w-6 h-6 ", text: "w-4 h-4.25" },
};

const baseInputVariants = {
  activate: {
    box: "bg-[#0058E4]",
    text: "text-[#EEEEEE]",
  },
  inactivate: {
    box: "bg-[#D4D6DD]",
    text: "text-[#FEFEFE]",
  },
  disabled: {
    box: "border-[#D4D6DD]",
    text: "text-[#D4D6DD]",
  },
};

export default function Checkbox({ children, disabled = false, defaultSize = "md", className = "", ...props }: Props) {
  const theme = useUITheme();
  const isChecked = !!props.checked;

  const generateMergedStyle = (themeKey: keyof CheckboxTheme) => {
    return Object.entries(baseInputVariants[themeKey]).reduce((acc, [key, value]) => {
      acc[key as keyof (keyof Partial<CheckboxTheme[typeof themeKey]>)] = twMerge(
        value,
        theme?.checkbox?.[themeKey]?.[key as keyof CheckboxTheme[typeof themeKey]] ?? ""
      );
      return acc;
    }, {} as Record<keyof (keyof CheckboxTheme[typeof themeKey]), string>);
  };

  const mergedInactiveStyle = generateMergedStyle("inactivate");
  const mergedActiveStyle = generateMergedStyle("activate");
  const mergedDisabledStyle = generateMergedStyle("disabled");

  // input 과 label 연동을 위해 (커스텀) 임의로 해시 값 아이디 생성
  const checkboxId = `checkbox-${Math.random().toString(36).slice(2, 9)}`;
  const hasCustomChild = !!children;

  const stateTextColor = disabled
    ? mergedDisabledStyle.text
    : isChecked
    ? mergedActiveStyle.text
    : mergedInactiveStyle.text;

  return (
    <div className="inline-flex items-center">
      <>
        <input type="checkbox" id={checkboxId} className="sr-only peer" onChange={props.onChange} {...props} />

        <label
          htmlFor={checkboxId}
          className={clsx(
            "relative inline-flex items-center justify-center transition-all duration-200",
            disabled ? "cursor-not-allowed" : "cursor-pointer",
            baseSizeVariants[defaultSize].box,

            hasCustomChild
              ? clsx("bg-transparent border-0 outline-none ring-0", stateTextColor)
              : clsx(
                  disabled
                    ? `border-2 bg-transparent ${mergedDisabledStyle.box}`
                    : props.checked
                    ? `${mergedActiveStyle.box} border-0`
                    : mergedInactiveStyle.box
                ),

            className
          )}
        >
          {hasCustomChild ? (
            children
          ) : (
            <svg
              className={clsx(
                baseSizeVariants[defaultSize].text,
                disabled ? mergedDisabledStyle.text : props.checked ? mergedActiveStyle.text : mergedInactiveStyle.text
              )}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </label>
      </>
    </div>
  );
}
