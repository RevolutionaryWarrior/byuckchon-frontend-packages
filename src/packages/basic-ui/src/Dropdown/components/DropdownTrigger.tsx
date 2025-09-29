import type { TriggerProps } from "../index";
import { twMerge } from "tailwind-merge";
import ChevronDownIcon from "@icons/icon_byuckicon_chevron_down.svg?react";

type Props = TriggerProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    className?: string;
  };

export function DropdownTrigger({ ...props }: Props) {
  const triggerClassName = twMerge(
    // 기본 스타일
    "cursor-pointer w-full text-left border border-[#CCCCCC] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 flex items-center justify-between h-[52px] text-base px-3",
    // 비활성화 상태
    props.disabled && "bg-gray-100 text-gray-400 cursor-not-allowed",
    // 외부에서 전달받은 클래스
    props.className
  );

  return (
    <button
      type="button"
      aria-haspopup="listbox"
      aria-expanded={props.isOpen}
      aria-label={props.selectedOption?.label || props.placeholder}
      {...props}
      className={triggerClassName}
    >
      <span className="w-full text-left">
        {props.selectedOption && <span>{props.selectedOption.label}</span>}
        {!props.selectedOption && (
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
