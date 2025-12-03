import react from "@vitejs/plugin-react";
import * as path from "path";
import { defineConfig } from "vite";
import { patchCssModules } from "vite-css-modules";
import dts from "vite-plugin-dts";
import libCss from "vite-plugin-libcss";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "index",
      fileName: (format) => (format === "es" ? "index.mjs" : "index.umd.js"),
      formats: ["es", "umd"],
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
