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
    option: "p-1 text-sm",
  },
  medium: {
    option: "p-2 text-base",
  },
  large: {
    option: "p-3 text-lg",
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
    "cursor-pointer",
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
