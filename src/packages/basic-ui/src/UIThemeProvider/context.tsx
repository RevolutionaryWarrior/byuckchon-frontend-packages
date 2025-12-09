import { createContext } from "react";
import type { ButtonTheme } from "../ActiveButton/theme";
import type { TooltipTheme } from "../Tooltip/theme";
import type { AlertModalTheme } from "../AlertModal/theme";
import type { CheckboxTheme } from "../Checkbox/theme";
import type { ChoiceModalTheme } from "../ChoiceModal/theme";
import type { ConfirmModalTheme } from "../ConfirmModal/theme";
import type { PaginationTheme } from "../Pagination/theme";
import type { ToggleTheme } from "../Toggle/theme";
import type { AccordionTheme } from "../Accordion/theme";
import type { ToastMessageTheme } from "../ToastMessage/theme";

export type Theme = {
  button?: ButtonTheme;
  tooltip?: TooltipTheme;
  toggle?: ToggleTheme;
  pagination?: PaginationTheme;
  checkbox?: CheckboxTheme;
  confirmModal?: ConfirmModalTheme;
  choiceModal?: ChoiceModalTheme;
  alertModal?: AlertModalTheme;
  accordion?: AccordionTheme;
  toastMessageTheme?: ToastMessageTheme;
};

export const UIThemeContext = createContext<Theme | undefined>(undefined);
