import { createContext } from "react";

import type { ButtonTheme } from "../ActiveButton/theme";
import type { PaginationTheme } from "../Pagination/theme";
import type { ToggleTheme } from "../Toggle/theme";

export type Theme = {
  button?: ButtonTheme;
  toggle?: ToggleTheme;
  pagination?: PaginationTheme;
};

export const UIThemeContext = createContext<Theme | undefined>(undefined);
