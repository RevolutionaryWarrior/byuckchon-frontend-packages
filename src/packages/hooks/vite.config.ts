import react from "@vitejs/plugin-react";
import * as path from "path";
import { defineConfig, type Plugin } from "vite";
import { patchCssModules } from "vite-css-modules";
import dts from "vite-plugin-dts";
import libCss from "vite-plugin-libcss";

/**
 * 훅·컴포넌트는 모두 클라이언트 전용이다. Next App Router 의 서버 컴포넌트에서
 * import 해도 에러가 나지 않도록 번들(es · umd) 맨 위에 "use client" 를 붙인다.
 * output.banner 는 UMD 를 minify 할 때 지워지므로 번들이 확정된 뒤(generateBundle)에 붙인다.
 */
const clientDirectivePlugin = (): Plugin => ({
  name: "byuckchon:use-client",
  generateBundle(_, bundle) {
    for (const chunk of Object.values(bundle)) {
      if (chunk.type === "chunk" && !chunk.code.startsWith('"use client"')) {
        chunk.code = `"use client";\n${chunk.code}`;
      }
    }
  },
});

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
    clientDirectivePlugin(),
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
});
