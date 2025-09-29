import { useMemo } from "react";
import type { TriggerProps } from "../index";
import { twMerge } from "tailwind-merge";
import ChevronDownIcon from "@icons/icon_byuckicon_chevron_down.svg?react";

type Props = TriggerProps & {
  size: "small" | "medium" | "large";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const baseDropdownSizes = {
  small: {
    trigger: "h-[40px] text-sm px-3 flex items-center",
  },
  medium: {
    trigger: "h-[52px] text-base px-3 flex items-center",
  },
  large: {
    trigger: "h-[60px] text-lg px-3 flex items-center",
  },
};

export function DropdownTrigger({ size, ...props }: Props) {
  const triggerClassName = useMemo(() => {
    return twMerge([
      "cursor-pointer w-full text-left border border-[#CCCCCC] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 flex items-center justify-between",
      baseDropdownSizes[size].trigger,
      props.disabled && "bg-gray-100 text-gray-400 cursor-not-allowed",
    ]);
  }, [size, props.disabled]);

  return (
    <button
      type="button"
      className={triggerClassName}
      disabled={props.disabled}
      aria-haspopup="listbox"
      aria-expanded={props.isOpen}
      aria-label={props.selectedOption?.label || props.placeholder}
      {...props}
    >
      <span className="w-full text-left">
        {props.selectedOption ? (
          <span>{props.selectedOption.label}</span>
        ) : (
          <span className="text-gray-500">{props.placeholder}</span>
        )}
      </span>
      <span
        className={twMerge(
          props.isOpen ? "rotate-180" : "",
          "transition-transform duration-200"
        )}
      >
        {props.icon ? props.icon : <ChevronDownIcon />}
      </span>
    </button>
  );
}
