export type TooltipTheme = {
  default?: {
    bg?: string;
    text?: string;
    arrowColor?: string;
  };
  variant?: {
    [key: string]: {
      bg?: string;
      text?: string;
      arrowColor?: string;
    };
  };
};
