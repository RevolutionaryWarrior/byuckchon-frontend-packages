import { createContext } from "react";
import type { ButtonTheme } from "../ActiveButton/theme";
import type { PaginationTheme } from "../Pagination/theme";

export type Theme = {
  button?: ButtonTheme;
  pagination?: PaginationTheme;
};

export const UIThemeContext = createContext<Theme | undefined>(undefined);
