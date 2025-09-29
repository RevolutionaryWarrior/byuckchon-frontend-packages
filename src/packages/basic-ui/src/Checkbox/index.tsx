import React from "react";
import clsx from "clsx";

import { useUITheme } from "../UIThemeProvider/useUITheme";
import { pickNumber, sizeRatios } from "./util";

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

export default function Checkbox({
  children,
  disabled = false,
  defaultSize = "lg",
  variant = "inactivate",
  className = "",
  ...props
}: Props) {
  const theme = useUITheme();

  const mergedStyle = {
    ...baseInputVariants[variant],
    ...(theme?.checkbox?.[variant] ?? {}),
  };

  const combinedForParse = clsx(baseSizeVariants[defaultSize].box, className);

  const wNum =
    pickNumber(combinedForParse, "w") ??
    (defaultSize === "lg" ? 6 : defaultSize === "md" ? 5 : 4);
  const hNum =
    pickNumber(combinedForParse, "h") ??
    (defaultSize === "lg" ? 6 : defaultSize === "md" ? 5 : 4);

  // 현재 지정해둔 사이즈에 맞춰 비율 그대로 크기가 커질 수 있게끔
  const { rw, rh } = sizeRatios[defaultSize];
  const textWNum = wNum * rw;
  const textHNum = hNum * rh;

  const toRem = (n: number) => `${n * 0.25}rem`;

  // input 과 label 연동을 위해 (커스텀) 임의로 해시 값 아이디 생성
  const checkboxId = `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="inline-flex items-center">
      {children ? (
        <div className={clsx("inline-flex items-center", className)}>
          <input
            type="checkbox"
            id={checkboxId}
            disabled={disabled}
            className="sr-only peer"
            {...props}
          />
          <label
            htmlFor={checkboxId}
            className={clsx(
              "flex items-center cursor-pointer appearance-none",
              disabled && "cursor-not-allowed opacity-50"
            )}
          >
            {children}
          </label>
        </div>
      ) : (
        <>
          <input
            type="checkbox"
            id={checkboxId}
            disabled={disabled}
            className="sr-only peer"
            {...props}
          />
          <label
            htmlFor={checkboxId}
            style={{
              ["--check-w" as any]: toRem(textWNum),
              ["--check-h" as any]: toRem(textHNum),
            }}
            className={clsx(
              "relative inline-flex items-center justify-center transition-all duration-200 cursor-pointer",

              mergedStyle.box,
              baseSizeVariants[defaultSize].box,

              `peer-checked:${baseInputVariants["activate"].box} peer-checked:border-0`,
              `peer-checked:[&>svg]:bg-transparent peer-checked:[&>svg]:${baseInputVariants[variant].text}`,

              `peer-checked:[&>svg]:w-[var(--check-w)] peer-checked:[&>svg]:h-[var(--check-h)]`,
              `[&>svg]:w-[var(--check-w)] [&>svg]:h-[var(--check-h)]`,

              disabled &&
                `cursor-not-allowed bg-transparent border-[1px] ${baseInputVariants["disabled"].box} [&>svg]:${baseInputVariants["disabled"].text}`,

              className
            )}
          >
            <svg
              className={clsx(
                baseSizeVariants[defaultSize].text,
                baseInputVariants[variant].text
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
          </label>
        </>
      )}
    </div>
  );
}
