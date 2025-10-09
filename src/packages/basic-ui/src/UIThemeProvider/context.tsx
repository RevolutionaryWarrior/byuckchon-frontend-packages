import { createContext } from "react";
import type { ButtonTheme } from "../ActiveButton/theme";
import type { TooltipTheme } from "../Tooltip/theme";

export type Theme = {
  button?: ButtonTheme;
  tooltip?: TooltipTheme;
};

export const UIThemeContext = createContext<Theme | undefined>(undefined);
