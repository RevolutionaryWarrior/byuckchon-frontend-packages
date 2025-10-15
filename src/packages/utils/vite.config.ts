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
  },
  plugins: [
    patchCssModules(),
    libCss(),
    dts({
      insertTypesEntry: true,
      tsconfigPath: "tsconfig.node.json",
    }),
  ],
});
