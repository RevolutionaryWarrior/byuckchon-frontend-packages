import { createContext } from "react";
import type { ButtonTheme } from "../ActiveButton/theme";
import type { CheckboxTheme } from "../Checkbox/theme";

export type Theme = {
  button?: ButtonTheme;
  checkbox?: CheckboxTheme;
};

export const UIThemeContext = createContext<Theme | undefined>(undefined);
