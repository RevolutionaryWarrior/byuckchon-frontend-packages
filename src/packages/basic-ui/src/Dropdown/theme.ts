// src/packages/basic-ui/src/Dropdown/theme.ts
export type DropdownTheme = {
  default?: {
    trigger?: {
      bg?: string;
      border?: string;
      text?: string;
      focus?: string;
    };
    dropdown?: {
      bg?: string;
      border?: string;
    };
    option?: {
      hover?: string;
      selected?: string;
      disabled?: string;
    };
  };
  outlined?: {
    trigger?: {
      bg?: string;
      border?: string;
      text?: string;
      focus?: string;
    };
    dropdown?: {
      bg?: string;
      border?: string;
    };
  };
  filled?: {
    trigger?: {
      bg?: string;
      border?: string;
      text?: string;
      focus?: string;
    };
    dropdown?: {
      bg?: string;
      border?: string;
    };
  };
};
