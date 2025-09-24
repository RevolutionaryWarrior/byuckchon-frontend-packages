import React from "react";
import { baseDropdownSizes, baseDropdownStyles } from "../styles";
import type { DropdownOptionType } from "../index";
import { createClassName } from "../utils/classNameUtils";

type DropdownOptionProps = {
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
}: DropdownOptionProps) {
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
      {option.icon && (
        <span className={baseDropdownStyles.optionIcon}>{option.icon}</span>
      )}
      <span>{option.label}</span>
    </div>
  );
}
