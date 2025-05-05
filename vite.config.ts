/// <reference types="vite/client" />
import path, { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { globSync } from "glob";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { libInjectCss } from "vite-plugin-lib-inject-css";
import dts from "vite-plugin-dts";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    libInjectCss(),
    dts({
      tsconfigPath: "./tsconfig.app.json",
      exclude: ["**/*.stories.tsx", "**/*.stories.ts", "**/*.test.tsx"],
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    lib: {
      entry: Object.fromEntries(
        globSync(
          [
            resolve(__dirname, "src/main.ts"),
            resolve(__dirname, "src/lib/**/*.ts"),
            resolve(__dirname, "src/lib/**/*.tsx"),
          ],
          {
            ignore: ["**/*.stories.tsx", "**/*.stories.ts", "**/*.test.tsx"],
          }
        ).map((file) => [
          path.relative(
            "src",
            file.slice(0, file.length - path.extname(file).length)
          ),
          fileURLToPath(new URL(file, import.meta.url)),
        ])
      ),
      name: "test-re-export",
      formats: ["es"],
    },
    sourcemap: true,
    minify: false,
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "tailwind-merge",
        "@tanstack/react-router",
        "react-intl",
        "@tanstack/react-query",
      ],
      input: Object.fromEntries(
        globSync(
          [
            "src/components/**/*.tsx",
            "src/main.ts",
            "src/lib/**/*.ts",
            "src/lib/**/*.tsx",
          ],
          {
            ignore: ["**/*.stories.tsx", "**/*.stories.ts", "**/*.test.tsx"],
          }
        ).map((file) => {
          // This remove `src/` as well as the file extension from each
          // file, so e.g. src/nested/foo.js becomes nested/foo
          const entryName = path.relative(
            "src",
            file.slice(0, file.length - path.extname(file).length)
          );
          // This expands the relative paths to absolute paths, so e.g.
          // src/nested/foo becomes /project/src/nested/foo.js
          const entryUrl = fileURLToPath(new URL(file, import.meta.url));
          return [entryName, entryUrl];
        })
      ),
      output: {
        entryFileNames: "[name].js",
        assetFileNames: ({ names }) => {
          // We only have one asset, and that is the `index.css` file
          const name = names[0];
          if (name && name.endsWith(".css")) {
            return name;
          }
          // This line should never be reached, as we only have one asset, and that is the css file
          return "assets/[name][extname]";
        },
        globals: {
          react: "React",
          "react-dom": "React-dom",
          "react/jsx-runtime": "react/jsx-runtime",
        },
      },
    },
  },
});
