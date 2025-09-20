import { createContext } from "react";
import type { ButtonTheme } from "../ActiveButton/theme";

export type Theme = {
  button?: ButtonTheme;
};

export const UIThemeContext = createContext<Theme | undefined>(undefined);
