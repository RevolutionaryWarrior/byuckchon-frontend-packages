import React from "react";
import { UIThemeContext, type Theme } from "./context";

export const UIThemeProvider = ({
  theme,
  children,
}: {
  theme?: Theme;
  children: React.ReactNode;
}) => {
  return (
    <UIThemeContext.Provider value={theme}>{children}</UIThemeContext.Provider>
  );
};

export type { Theme };
