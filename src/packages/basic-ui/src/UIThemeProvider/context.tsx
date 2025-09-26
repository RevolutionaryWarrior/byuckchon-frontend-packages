import { createContext } from "react";

import type { ButtonTheme } from "../ActiveButton/theme";
import type { ToggleTheme } from "../Toggle/theme";

export type Theme = {
  button?: ButtonTheme;
  toggle?: ToggleTheme;
};

export const UIThemeContext = createContext<Theme | undefined>(undefined);
