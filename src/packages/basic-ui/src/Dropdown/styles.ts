// src/packages/basic-ui/src/Dropdown/styles.ts
export const baseDropdownStyles = {
  container: "relative inline-block w-full",
  trigger: `
    w-full text-left bg-white border border-[#CCCCCC] shadow-sm
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    transition-colors duration-200
    flex items-center justify-between
  `,
  triggerContent: "flex items-center gap-2",
  icon: "flex-shrink-0",
  placeholder: "text-gray-[#8F9098]",
  arrow: "ml-auto transition-transform duration-200",
  arrowOpen: "transform rotate-180",
  disabled: "bg-gray-100 text-gray-400 cursor-not-allowed",
  dropdown: `
    absolute z-50 w-full bg-white border border-[#CCCCCC]
    shadow-lg max-h-60 overflow-auto
  `,
  option: `
    px-3 py-4 cursor-pointer hover:bg-gray-100 transition-colors duration-150
    flex items-center gap-2
    border-b border-[#CCCCCC]
  `,
  optionSelected: "bg-blue-50 text-blue-600",
  optionDisabled: "text-gray-400 cursor-not-allowed hover:bg-transparent",
  optionIcon: "flex-shrink-0",
  empty: "px-3 py-2 text-gray-500 text-center",
};

export const baseDropdownVariants = {
  default: {
    trigger: "border-gray-[#CCCCCC] focus:border-blue-500 focus:ring-blue-500",
    dropdown: "border-gray-300",
  },
  outlined: {
    trigger:
      "border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500",
    dropdown: "border-2 border-gray-300",
  },
  filled: {
    trigger:
      "bg-gray-50 border-gray-300 focus:bg-blue-50 focus:border-blue-500 focus:ring-blue-500",
    dropdown: "border-gray-300",
  },
};

export const baseDropdownSizes = {
  small: {
    trigger: "px-2 py-2 text-sm",
    dropdown: "text-sm",
  },
  medium: {
    trigger: "px-3 py-4  text-base",
    dropdown: "text-base",
  },
  large: {
    trigger: "px-5 py-6 text-lg",
    dropdown: "text-lg",
  },
};
