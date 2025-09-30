import React, { useMemo } from "react";
import { DropdownTrigger } from "./components/DropdownTrigger";
import { DropdownOption } from "./components/DropdownOption";
import { useDetectClose } from "@byuckchon-frontend/hooks";
import { twMerge } from "tailwind-merge";

// 타입 정의
export type DropdownOptionType = {
  value: string | number;
  label: string;
  disabled?: boolean;
};

export type TriggerProps = {
  isOpen: boolean;
  selectedOption?: DropdownOptionType;
  placeholder?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
};

export type Props = {
  options: DropdownOptionType[];
  selectedOption?: {
    value: string | number;
    label: string;
  };
  placeholder?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  triggerClassName?: string;
  optionWrapperClassName?: string;
  optionClassName?: string;
  onChange?: (option: DropdownOptionType) => void;
  onClose?: () => void;
  renderTrigger?: (props: TriggerProps) => React.ReactNode;
  renderOption?: (option: DropdownOptionType) => React.ReactNode;
};

export default function Dropdown({
  options = [],
  selectedOption,
  placeholder = "선택하세요",
  disabled = false,
  icon,
  triggerClassName,
  optionWrapperClassName,
  optionClassName,
  onChange,
  renderTrigger,
  renderOption,
}: Props) {
  const { isOpen, setIsOpen, ref: dropdownRef } = useDetectClose();

  const selectOption = (option: DropdownOptionType) => {
    if (option.disabled) return;
    onChange?.(option);
  };

  // 옵션 선택 핸들러
  const handleOptionClick = (option: DropdownOptionType) => {
    selectOption(option);
    setIsOpen(false);
  };

  // 트리거 props
  const triggerProps: TriggerProps = useMemo(
    () => ({
      isOpen,
      selectedOption,
      placeholder,
      disabled,
      icon,
    }),
    [isOpen, selectedOption, placeholder, disabled, icon]
  );

  return (
    <div ref={dropdownRef} className="relative inline-block w-full">
      {renderTrigger ? (
        renderTrigger(triggerProps)
      ) : (
        <DropdownTrigger
          {...triggerProps}
          onClick={() => setIsOpen((prev) => !prev)}
          className={triggerClassName}
        />
      )}

      {options.length > 0 && isOpen && (
        <div
          className={twMerge(
            "absolute z-50 w-full border border-[#CCCCCC] shadow-lg max-h-[260px] overflow-y-auto text-base",
            optionWrapperClassName
          )}
          role="listbox"
          aria-label="옵션 목록"
        >
          {options.map((option, index) => {
            if (renderOption) {
              return renderOption(option);
            }

            return (
              <DropdownOption
                key={`${option.label}-${option.value}-${index}`}
                option={option}
                isSelected={selectedOption?.value === option.value}
                handleOptionClick={handleOptionClick}
                className={optionClassName}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
