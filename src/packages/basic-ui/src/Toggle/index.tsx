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
  unactivate: {
    bg: "bg-[#D4D6DD]",
  },
};

export default function Toggle({ className = "", ...props }: Props) {
  const theme = useUITheme();

  const inactive = {
    ...baseToggleVariants.unactivate,
    ...(theme?.toggle?.unactivate ?? {}),
  };
  const active = {
    ...baseToggleVariants.activate,
    ...(theme?.toggle?.activate ?? {}),
  };

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
          ["--knob-x" as any]: `${Math.max(0, (wNum - hNum) * 0.25)}rem`,
          ["--knob-size" as any]: `${Math.max(0, hNum * 0.25 - 0.5)}rem`,
        }}
        className={clsx(
          "relative w-full h-full rounded-full transition-colors duration-200",
          getBaseBgClasses(className) || inactive.bg,
          getCheckedBgClasses(className) || `peer-checked:${active.bg}`,
          "peer-checked:[&>span]:translate-x-[var(--knob-x)]"

          // disabled의 경우 아직 따로 디자인이 없어서 임의로 지정했습니다!
          // disabled && "opacity-50 cursor-not-allowed"
        )}
        aria-hidden
      >
        <span
          className="absolute w-5 h-5 left-1 top-1 rounded-full bg-[#FEFEFE] transition-transform duration-200"
          style={{ width: "var(--knob-size)", height: "var(--knob-size)" }}
        />
      </span>
    </label>
  );
}
