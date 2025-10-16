import { createContext } from "react";

import type { ButtonTheme } from "../ActiveButton/theme";
import type { PaginationTheme } from "../Pagination/theme";
import type { ToggleTheme } from "../Toggle/theme";
import type { CheckboxTheme } from "../Checkbox/theme";

export type Theme = {
  button?: ButtonTheme;
  toggle?: ToggleTheme;
  pagination?: PaginationTheme;
  checkbox?: CheckboxTheme;
};

export const UIThemeContext = createContext<Theme | undefined>(undefined);
