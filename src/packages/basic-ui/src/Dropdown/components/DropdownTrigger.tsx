import { useMemo } from "react";
import type { TriggerProps } from "../index";
import { twMerge } from "tailwind-merge";

type Props = TriggerProps & {
  size: "small" | "medium" | "large";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const baseDropdownSizes = {
  small: {
    trigger: "px-2 py-2 text-sm",
  },
  medium: {
    trigger: "px-3 py-4  text-base",
  },
  large: {
    trigger: "px-5 py-6 text-lg",
  },
};

export function DropdownTrigger({ size, ...props }: Props) {
  const triggerClassName = useMemo(() => {
    return twMerge([
      "cursor-pointer w-full text-left border border-[#CCCCCC] shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 flex items-center justify-between",
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
        {props.icon ? props.icon : "▼"}
      </span>
    </button>
  );
}
