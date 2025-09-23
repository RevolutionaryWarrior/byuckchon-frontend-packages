import { useEffect, type RefObject } from "react";

export function useClickOutside(
  dropdownRef: RefObject<HTMLElement | null>,
  closeDropdown: () => void,
  isOpen: boolean
) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, closeDropdown, isOpen]);
}
