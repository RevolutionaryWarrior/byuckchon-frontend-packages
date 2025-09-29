import React from "react";
import type { DropdownOptionType } from "../index";
import { twMerge } from "tailwind-merge";

type Props = {
  option: DropdownOptionType;
  isSelected: boolean;
  handleOptionClick: (option: DropdownOptionType) => void;
  renderOption?: (option: DropdownOptionType) => React.ReactNode;
};

export function DropdownOption({
  option,
  isSelected,
  handleOptionClick,
  renderOption,
}: Props) {
  const className = twMerge([
    option.disabled && "opacity-50",
    isSelected && "bg-blue-500 text-white",
    "cursor-pointer border-b border-[#CCCCCC] h-[52px] text-base flex items-center px-3",
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
