import { baseDropdownStyles } from "../styles";
import type { TriggerProps } from "../index";

type Props = TriggerProps & {
  triggerClassName: string;
  toggleDropdown: () => void;
};

export function DropdownTrigger({
  triggerClassName,
  icon,
  toggleDropdown,
  ...props
}: Props) {
  return (
    <button
      type="button"
      className={triggerClassName}
      onClick={toggleDropdown}
      disabled={props.disabled}
      aria-haspopup="listbox"
      aria-expanded={props.isOpen}
      aria-label={props.selectedOption?.label || props.placeholder}
    >
      <span className={baseDropdownStyles.triggerContent}>
        {props.selectedOption ? (
          <span>{props.selectedOption.label}</span>
        ) : (
          <span className={baseDropdownStyles.placeholder}>
            {props.placeholder}
          </span>
        )}
      </span>
      <span
        className={`${baseDropdownStyles.arrow} ${
          props.isOpen ? baseDropdownStyles.arrowOpen : ""
        }`}
      >
        {icon ? icon : "▼"}
      </span>
    </button>
  );
}
