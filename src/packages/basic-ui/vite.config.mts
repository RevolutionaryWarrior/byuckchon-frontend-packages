import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import * as path from "path";
import { defineConfig } from "vite";
import { patchCssModules } from "vite-css-modules";
import dts from "vite-plugin-dts";
import libCss from "vite-plugin-libcss";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    cssCodeSplit: true,
    lib: {
      entry: {
        index: path.resolve(__dirname, "src/index.ts"),
        styles: path.resolve(__dirname, "styles.css"),
      },
      name: "index",
      fileName: (format, entryName) => {
        if (entryName === "styles") {
          return `${entryName}.css`;
        }
        return `${entryName}.${format === "es" ? "mjs" : "umd.js"}`;
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "jsxRuntime",
        },
      },
    },
    commonjsOptions: {
      esmExternals: ["react", "react/jsx-runtime"],
    },
  },
  plugins: [
    react({
      jsxRuntime: "automatic",
    }),
    tailwindcss(),
    svgr({
      svgrOptions: {
        icon: true,
      },
    }),
    patchCssModules(),
    libCss(),
    dts({
      insertTypesEntry: true,
      tsconfigPath: "tsconfig.node.json",
    }),
  ],
  resolve: {
    alias: {
      react: path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
    },
  },
});
