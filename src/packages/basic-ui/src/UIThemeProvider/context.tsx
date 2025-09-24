import { createContext } from "react";
import type { ButtonTheme } from "../ActiveButton/theme";
import type { DropdownTheme } from "../Dropdown/theme";

export type Theme = {
  button?: ButtonTheme;
  dropdown?: DropdownTheme;
};

export const UIThemeContext = createContext<Theme | undefined>(undefined);
