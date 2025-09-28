import { createContext } from "react";
import type { ButtonTheme } from "../ActiveButton/theme";
import type { ChoiceModalTheme } from "../ChoiceModal/theme";
import type { ConfirmModalTheme } from "../ConfirmModal/theme";

export type Theme = {
  button?: ButtonTheme;
  confirmModal?: ConfirmModalTheme;
  choiceModal?: ChoiceModalTheme;
};

export const UIThemeContext = createContext<Theme | undefined>(undefined);
