import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { realpathSync } from "node:fs";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    port: 4173,
    fs: { allow: [process.cwd(), realpathSync("node_modules")] },
    proxy: {
      "/api": "http://127.0.0.1:4318",
    },
  },
  preview: {
    host: "127.0.0.1",
    port: 4173,
    proxy: {
      "/api": "http://127.0.0.1:4318",
    },
  },
});
