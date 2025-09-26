import { baseDropdownStyles } from "../styles";
import type { TriggerProps } from "../index";

type DropdownTriggerProps = TriggerProps & {
  triggerClassName: string;
  toggleDropdown: () => void;
};

export function DropdownTrigger({
  isOpen,
  selectedOption,
  placeholder,
  disabled,
  triggerClassName,
  icon,
  toggleDropdown,
}: DropdownTriggerProps) {
  return (
    <button
      type="button"
      className={triggerClassName}
      onClick={toggleDropdown}
      disabled={disabled}
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      aria-label={selectedOption?.label || placeholder}
    >
      <span className={baseDropdownStyles.triggerContent}>
        {selectedOption ? (
          <span>{selectedOption.label}</span>
        ) : (
          <span className={baseDropdownStyles.placeholder}>{placeholder}</span>
        )}
      </span>
      <span
        className={`${baseDropdownStyles.arrow} ${
          isOpen ? baseDropdownStyles.arrowOpen : ""
        }`}
      >
        {icon ? icon : "▼"}
      </span>
    </button>
  );
}
