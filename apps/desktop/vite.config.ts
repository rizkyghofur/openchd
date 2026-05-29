import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";
import electron from "vite-plugin-electron";
import renderer from "vite-plugin-electron-renderer";

export default defineConfig({
  root: resolve(__dirname, "src/renderer"),
  plugins: [
    react(),
    electron([
      {
        entry: resolve(__dirname, "src/main/index.ts"),
        onstart(args) {
          args.startup();
        },
        vite: {
          build: {
            outDir: resolve(__dirname, "dist/main"),
            rollupOptions: {
              external: ["electron"],
            },
          },
        },
      },
      {
        entry: resolve(__dirname, "src/preload/index.ts"),
        onstart(args) {
          args.reload();
        },
        vite: {
          build: {
            outDir: resolve(__dirname, "dist/preload"),
            rollupOptions: {
              external: ["electron"],
            },
          },
        },
      },
    ]),
    renderer(),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: resolve(__dirname, "dist/renderer"),
    emptyOutDir: true,
  },
});
