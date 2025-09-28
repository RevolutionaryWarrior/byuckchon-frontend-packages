import { createContext } from "react";
import type { ButtonTheme } from "../ActiveButton/theme";
import type { ConfirmModalTheme } from "../ConfirmModal/theme";

export type Theme = {
  button?: ButtonTheme;
  confirmModal?: ConfirmModalTheme;
};

export const UIThemeContext = createContext<Theme | undefined>(undefined);
