// src/packages/basic-ui/src/Dropdown/index.tsx
import React, { useCallback, useMemo } from "react";
import {
  baseDropdownSizes,
  baseDropdownStyles,
  baseDropdownVariants,
} from "./styles";
import { useDropdownState } from "./hooks/useDropdownState";
import { DropdownTrigger } from "./components/DropdownTrigger";
import { DropdownList } from "./components/DropdownList";
import { DropdownOption } from "./components/DropdownOption";
import { EmptyState } from "./components/EmptyState";
import { KEYBOARD_KEYS } from "./constants";
import { createClassName } from "./utils/classNameUtils";
import { useDetectClose } from "../../../hooks/src";

// 타입 정의
export type DropdownOptionType = {
  value: string | number;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
};

export type TriggerProps = {
  isOpen: boolean;
  selectedOption?: DropdownOptionType;
  placeholder?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
};

export type DropdownProps = {
  options: DropdownOptionType[];
  value?: string | number;
  placeholder?: string;
  disabled?: boolean;
  variant?: "default" | "outlined" | "filled";
  size?: "small" | "medium" | "large";
  className?: string;
  icon?: React.ReactNode;
  onChange?: (value: string | number, option: DropdownOptionType) => void;
  onOpen?: () => void;
  onClose?: () => void;
  renderTrigger?: (props: TriggerProps) => React.ReactNode;
  renderOption?: (option: DropdownOptionType) => React.ReactNode;
};

export default function Dropdown({
  options = [],
  value,
  placeholder = "선택하세요",
  disabled = false,
  variant = "default",
  size = "medium",
  className = "",
  icon,
  onChange,
  onOpen,
  onClose,
  renderTrigger,
  renderOption,
}: DropdownProps) {
  const { isOpen, setIsOpen, ref: dropdownRef } = useDetectClose();

  const { selectedOption, selectOption } = useDropdownState({
    options,
    value,
    onChange,
  });

  // 드롭다운 열기/닫기 함수들
  const openDropdown = useCallback(() => {
    if (disabled) return;
    setIsOpen(true);
    onOpen?.();
  }, [disabled, onOpen, setIsOpen]);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose, setIsOpen]);

  const toggleDropdown = useCallback(() => {
    if (disabled) return;
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  }, [disabled, isOpen, closeDropdown, openDropdown]);

  // 키보드 네비게이션 핸들러
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (disabled) return;

      switch (event.key) {
        case KEYBOARD_KEYS.ENTER:
        case KEYBOARD_KEYS.SPACE:
          event.preventDefault();
          toggleDropdown();
          break;
        case KEYBOARD_KEYS.ESCAPE:
          closeDropdown();
          break;
        case KEYBOARD_KEYS.ARROW_DOWN:
        case KEYBOARD_KEYS.ARROW_UP:
          event.preventDefault();
          if (!isOpen) openDropdown();
          break;
      }
    },
    [disabled, isOpen, openDropdown, closeDropdown, toggleDropdown]
  );

  // 옵션 선택 핸들러
  const handleOptionClick = useCallback(
    (option: DropdownOptionType) => {
      selectOption(option);
      closeDropdown();
    },
    [selectOption, closeDropdown]
  );

  // 스타일 클래스 메모이제이션
  const triggerClassName = useMemo(
    () =>
      createClassName([
        baseDropdownStyles.trigger,
        baseDropdownVariants[variant].trigger,
        baseDropdownSizes[size].trigger,
        disabled && baseDropdownStyles.disabled,
        className,
      ]),
    [variant, size, disabled, className]
  );

  const dropdownClassName = useMemo(
    () =>
      createClassName([
        baseDropdownStyles.dropdown,
        baseDropdownVariants[variant].dropdown,
        baseDropdownSizes[size].dropdown,
      ]),
    [variant, size]
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
    <div ref={dropdownRef} className={baseDropdownStyles.container}>
      {renderTrigger ? (
        renderTrigger(triggerProps)
      ) : (
        <DropdownTrigger
          triggerClassName={triggerClassName}
          handleKeyDown={handleKeyDown}
          toggleDropdown={toggleDropdown}
          {...triggerProps}
        />
      )}

      {isOpen && (
        <DropdownList className={dropdownClassName}>
          {options.length === 0 ? (
            <EmptyState />
          ) : (
            options.map((option) => (
              <DropdownOption
                key={option.value}
                option={option}
                isSelected={selectedOption?.value === option.value}
                handleOptionClick={handleOptionClick}
                renderOption={renderOption}
              />
            ))
          )}
        </DropdownList>
      )}
    </div>
  );
}
