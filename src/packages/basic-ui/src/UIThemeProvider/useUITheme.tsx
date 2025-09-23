import { useContext } from "react";
import { UIThemeContext } from "./context";

export const useUITheme = () => {
  return useContext(UIThemeContext);
};
