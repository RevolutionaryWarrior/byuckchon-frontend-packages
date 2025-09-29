import React from "react";
import type { DropdownOptionType } from "../index";
import { twMerge } from "tailwind-merge";

type Props = {
  option: DropdownOptionType;
  isSelected: boolean;
  size: "small" | "medium" | "large";
  handleOptionClick: (option: DropdownOptionType) => void;
  renderOption?: (option: DropdownOptionType) => React.ReactNode;
};

const baseDropdownSizes = {
  small: {
    option: "h-[40px] text-sm px-3 flex items-center",
  },
  medium: {
    option: "h-[52px] text-base flex items-center px-3",
  },
  large: {
    option: "h-[60px] text-lg flex items-center px-3",
  },
};

export function DropdownOption({
  option,
  isSelected,
  size,
  handleOptionClick,
  renderOption,
}: Props) {
  const className = twMerge([
    option.disabled && "opacity-50",
    baseDropdownSizes[size].option,
    isSelected && "bg-blue-500 text-white",
    "cursor-pointer border-b border-[#CCCCCC]",
  ]);

  if (renderOption) {
    return <>{renderOption(option)}</>;
  }

  return (
    <div
      className={className}
      onClick={() => handleOptionClick(option)}
      role="option"
      aria-selected={isSelected}
      tabIndex={-1}
    >
      <span>{option.label}</span>
    </div>
  );
}
