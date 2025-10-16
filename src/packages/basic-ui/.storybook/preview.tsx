import type { Preview } from "@storybook/react-vite";
import React from "react";
import "../styles.css";
import { UIThemeProvider } from "../src/UIThemeProvider";

// export const decorators = [
//   (Story) => (
//     <UIThemeProvider>
//       <div style={{ padding: "1.5rem", background: "#fff" }}>
//         <Story />
//       </div>
//     </UIThemeProvider>
//   ),
// ];

const preview: Preview = {
  parameters: {
    layout: "centered",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
