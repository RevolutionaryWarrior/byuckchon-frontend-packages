import React from "react";
import { baseDropdownSizes, baseDropdownStyles } from "../styles";
import type { DropdownOptionType } from "../index";
import { createClassName } from "../utils/classNameUtils";

type Props = {
  option: DropdownOptionType;
  isSelected: boolean;
  size: "small" | "medium" | "large";
  handleOptionClick: (option: DropdownOptionType) => void;
  renderOption?: (option: DropdownOptionType) => React.ReactNode;
};

export function DropdownOption({
  option,
  isSelected,
  size,
  handleOptionClick,
  renderOption,
}: Props) {
  const className = createClassName([
    baseDropdownStyles.option,
    baseDropdownSizes[size].option,
    option.disabled && baseDropdownStyles.optionDisabled,
    isSelected && baseDropdownStyles.optionSelected,
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
