import { createContext } from "react";

import type { ButtonTheme } from "../ActiveButton/theme";
import type { AlertModalTheme } from "../AlertModal/theme";
import type { CheckboxTheme } from "../Checkbox/theme";
import type { ChoiceModalTheme } from "../ChoiceModal/theme";
import type { ConfirmModalTheme } from "../ConfirmModal/theme";
import type { PaginationTheme } from "../Pagination/theme";
import type { ToggleTheme } from "../Toggle/theme";

export type Theme = {
  button?: ButtonTheme;
  toggle?: ToggleTheme;
  pagination?: PaginationTheme;
  checkbox?: CheckboxTheme;
  confirmModal?: ConfirmModalTheme;
  choiceModal?: ChoiceModalTheme;
  alertModal?: AlertModalTheme;
};

export const UIThemeContext = createContext<Theme | undefined>(undefined);
