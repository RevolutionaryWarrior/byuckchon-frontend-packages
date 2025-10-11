import React from "react";
import clsx from "clsx";

import { useUITheme } from "../UIThemeProvider/useUITheme";
import { checkNumber, getBaseBgClasses, getCheckedBgClasses } from "./util";

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
      ? getCheckedBgClasses(className) || activate.bg
      : getBaseBgClasses(className) || inactivate.bg;
  }, [isChecked, className, activate.bg, inactivate.bg]);

  const wNum = checkNumber(clsx("w-11 h-7", className), "w") ?? 11;
  const hNum = checkNumber(clsx("w-11 h-7", className), "h") ?? 7;

  return (
    <label
      className={clsx(
        "flex items-center cursor-pointer",
        `w-${wNum} h-${hNum}`
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
            ["--knob-x"]: `${Math.max(0, (wNum - hNum) * 0.25)}rem`,
            ["--knob-size"]: `${Math.max(0, hNum * 0.25 - 0.5)}rem`,
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
