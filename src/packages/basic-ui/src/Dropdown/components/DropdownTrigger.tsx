import React from "react";
import { baseDropdownStyles } from "../styles";
import type { TriggerProps } from "../index";

type DropdownTriggerProps = TriggerProps & {
  triggerClassName: string;
  handleKeyDown: (event: React.KeyboardEvent) => void;
  toggleDropdown: () => void;
};

export function DropdownTrigger({
  isOpen,
  selectedOption,
  placeholder,
  disabled,
  triggerClassName,
  handleKeyDown,
  toggleDropdown,
}: DropdownTriggerProps) {
  return (
    <button
      type="button"
      className={triggerClassName}
      onClick={toggleDropdown}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      aria-label={selectedOption?.label || placeholder}
    >
      <span className={baseDropdownStyles.triggerContent}>
        {selectedOption ? (
          <>
            {selectedOption.icon && (
              <span className={baseDropdownStyles.icon}>
                {selectedOption.icon}
              </span>
            )}
            <span>{selectedOption.label}</span>
          </>
        ) : (
          <span className={baseDropdownStyles.placeholder}>{placeholder}</span>
        )}
      </span>
      <span
        className={`${baseDropdownStyles.arrow} ${
          isOpen ? baseDropdownStyles.arrowOpen : ""
        }`}
      >
        ▼
      </span>
    </button>
  );
}
