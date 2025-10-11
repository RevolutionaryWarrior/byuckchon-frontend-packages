import React from "react";
import clsx from "clsx";

import { useUITheme } from "../UIThemeProvider/useUITheme";
import { checkNumber, getBgClasses } from "./util";

type Props = {
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const baseToggleVariants = {
  activate: {
    bg: "bg-[#0058E4]",
  },
  inactivate: {
    bg: "bg-[#D4D6DD]",
  },
};

export default function Toggle({ className = "", ...props }: Props) {
  const theme = useUITheme();
  const isChecked = !!props.checked;

  const inactivate = {
    ...baseToggleVariants.inactivate,
    ...(theme?.toggle?.inactivate ?? {}),
  };
  const activate = {
    ...baseToggleVariants.activate,
    ...(theme?.toggle?.activate ?? {}),
  };

  const bgClass = React.useMemo(() => {
    return isChecked
      ? getBgClasses(isChecked, className) || activate.bg
      : getBgClasses(isChecked, className) || inactivate.bg;
  }, [isChecked, className, activate.bg, inactivate.bg]);

  // full, [..px] 과 같은 경우는 고려하지 않음
  // 오직 tailwindCSS에서 제공하는 width, height만 취급
  // ex) w-10 h-10
  const widthNum = checkNumber(className, "w") ?? 11;
  const heightNum = checkNumber(className, "h") ?? 7;

  return (
    <label
      className={clsx(
        "flex items-center cursor-pointer",
        `w-${widthNum} h-${heightNum}`
      )}
    >
      <input
        type="checkbox"
        className="peer sr-only"
        aria-label={props["aria-label"]}
        {...props}
      />
      <span
        style={{
          ...({
            ["--knob-x"]: `${Math.max(0, (widthNum - heightNum) * 0.25)}rem`,
            ["--knob-size"]: `${Math.max(0, heightNum * 0.25 - 0.5)}rem`,
          } as React.CSSProperties),
        }}
        className={clsx(
          "relative w-full h-full rounded-full",
          "transition-colors duration-200",
          bgClass
        )}
        aria-hidden
      >
        <span
          className={clsx(
            "absolute w-5 h-5 left-1 top-1 rounded-full bg-[#FEFEFE]",
            "transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]"
          )}
          style={{
            width: "var(--knob-size)",
            height: "var(--knob-size)",
            transform: isChecked
              ? "translateX(var(--knob-x))"
              : "translateX(0)",
            willChange: "transform",
          }}
        />
      </span>
    </label>
  );
}
