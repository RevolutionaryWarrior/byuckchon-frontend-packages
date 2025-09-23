// src/packages/basic-ui/src/Dropdown/styles.ts
export const baseDropdownStyles = {
  container: "relative inline-block w-full",
  trigger: `
    w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md
    shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    transition-colors duration-200
  `,
  triggerContent: "flex items-center gap-2",
  icon: "flex-shrink-0",
  placeholder: "text-gray-500",
  arrow: "ml-auto transition-transform duration-200",
  arrowOpen: "transform rotate-180",
  disabled: "bg-gray-100 text-gray-400 cursor-not-allowed",
  dropdown: `
    absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md
    shadow-lg max-h-60 overflow-auto
  `,
  option: `
    px-3 py-2 cursor-pointer hover:bg-gray-100 transition-colors duration-150
    flex items-center gap-2
  `,
  optionSelected: "bg-blue-50 text-blue-600",
  optionDisabled: "text-gray-400 cursor-not-allowed hover:bg-transparent",
  optionIcon: "flex-shrink-0",
  empty: "px-3 py-2 text-gray-500 text-center",
};

export const baseDropdownVariants = {
  default: {
    trigger: "border-gray-300 focus:border-blue-500 focus:ring-blue-500",
    dropdown: "border-gray-300",
  },
  outlined: {
    trigger:
      "border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500",
    dropdown: "border-2 border-gray-300",
  },
  filled: {
    trigger:
      "bg-gray-50 border-gray-300 focus:bg-white focus:border-blue-500 focus:ring-blue-500",
    dropdown: "border-gray-300",
  },
};

export const baseDropdownSizes = {
  small: {
    trigger: "px-2 py-1 text-sm",
    dropdown: "text-sm",
  },
  medium: {
    trigger: "px-3 py-2 text-base",
    dropdown: "text-base",
  },
  large: {
    trigger: "px-4 py-3 text-lg",
    dropdown: "text-lg",
  },
};
