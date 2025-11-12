import * as path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

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
