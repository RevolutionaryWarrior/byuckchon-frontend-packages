import React, { useCallback, useMemo } from "react";
import {
  baseDropdownSizes,
  baseDropdownStyles,
  baseDropdownVariants,
} from "./styles";
import { useDropdownState } from "./hooks/useDropdownState";
import { DropdownTrigger } from "./components/DropdownTrigger";
import { DropdownOption } from "./components/DropdownOption";
import { KEYBOARD_KEYS } from "./constants";
import { createClassName } from "./utils/classNameUtils";
import { useDetectClose } from "../../../hooks/src";
import { useUITheme } from "../UIThemeProvider/useUITheme";

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
  variant?: "primary" | "secondary";
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
  variant = "primary",
  size = "medium",
  className = "",
  icon,
  onChange,
  onOpen,
  onClose,
  renderTrigger,
  renderOption,
}: DropdownProps) {
  const theme = useUITheme();
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
  const triggerClassName = useMemo(() => {
    const baseVariant = baseDropdownVariants[variant];
    const themeVariant = theme?.dropdown?.[variant];

    const mergedVariant = {
      ...baseVariant,
      ...(themeVariant ?? {}),
    };

    return createClassName([
      baseDropdownStyles.trigger,
      mergedVariant.bg,
      mergedVariant.border,
      mergedVariant.textColor,
      baseDropdownSizes[size].trigger,
      disabled && baseDropdownStyles.disabled,
      className,
    ]);
  }, [variant, size, disabled, className, theme]);

  const dropdownClassName = useMemo(() => {
    const baseVariant = baseDropdownVariants[variant];
    const themeVariant = theme?.dropdown?.[variant];

    const mergedVariant = {
      ...baseVariant,
      ...(themeVariant ?? {}),
    };

    return createClassName([
      baseDropdownStyles.dropdown,
      mergedVariant.bg,
      mergedVariant.border,
      mergedVariant.textColor,
      baseDropdownSizes[size].dropdown,
    ]);
  }, [variant, size, theme]);

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
        <div
          className={dropdownClassName}
          role="listbox"
          aria-label="옵션 목록"
        >
          {options.length === 0 ? (
            <div className={baseDropdownStyles.empty}>
              선택할 수 있는 옵션이 없습니다
            </div>
          ) : (
            options.map((option) => (
              <DropdownOption
                key={option.value}
                option={option}
                isSelected={selectedOption?.value === option.value}
                size={size}
                handleOptionClick={handleOptionClick}
                renderOption={renderOption}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
