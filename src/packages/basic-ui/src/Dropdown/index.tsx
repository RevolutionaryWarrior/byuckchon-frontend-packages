import React, { useCallback, useEffect, useMemo, useState } from "react";
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
};

export type Props = {
  options: DropdownOptionType[];
  value?: string | number;
  placeholder?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  triggerClassName?: string;
  onChange?: (value: string | number, option: DropdownOptionType) => void;
  onClose?: () => void;
  renderTrigger?: (props: TriggerProps) => React.ReactNode;
  renderOption?: (option: DropdownOptionType) => React.ReactNode;
};

export default function Dropdown({
  options = [],
  value,
  placeholder = "선택하세요",
  disabled = false,
  icon,
  triggerClassName,
  onChange,
  renderTrigger,
  renderOption,
}: Props) {
  const { isOpen, setIsOpen, ref: dropdownRef } = useDetectClose();
  const [selectedOption, setSelectedOption] = useState<
    DropdownOptionType | undefined
  >();

  // 기본 값 설정
  useEffect(() => {
    const option = options.find((opt) => opt.value === value);
    setSelectedOption(option);
  }, [value, options]);

  const selectOption = useCallback(
    (option: DropdownOptionType) => {
      if (option.disabled) return;

      setSelectedOption(option);
      onChange?.(option.value, option);
    },
    [onChange]
  );

  const toggleDropdown = useCallback(() => {
    if (disabled) return;
    if (isOpen) {
      setIsOpen(false);
    } else {
      if (disabled) return;
      setIsOpen(true);
    }
  }, [disabled, isOpen, setIsOpen]);

  // 옵션 선택 핸들러
  const handleOptionClick = useCallback(
    (option: DropdownOptionType) => {
      selectOption(option);
      setIsOpen(false);
    },
    [selectOption, setIsOpen]
  );

  const dropdownClassName = twMerge(
    "absolute z-50 w-full border border-[#CCCCCC] shadow-lg max-h-[260px] overflow-y-auto text-base",
    triggerClassName
  );

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
        <DropdownTrigger {...triggerProps} onClick={toggleDropdown} />
      )}

      {options.length > 0 && isOpen && (
        <div
          className={dropdownClassName}
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
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
