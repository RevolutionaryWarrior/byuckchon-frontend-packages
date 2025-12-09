export type AccordionMode = "default" | "inverted" | "highlight";

export type AccordionTheme = {
  mode?: AccordionMode;
  header?: {
    defaultBg?: string;
    openBg?: string;
    hoverBg?: string;
  };
  content?: {
    defaultBg?: string;
    openBg?: string;
  };
  details?: {
    itemTextStyle?: string;
    contentTextStyle?: string;
    dropdownIconStyle?: string;
    borderColor?: string;
  };
};
