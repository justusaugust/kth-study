import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "**/*.spec.ts",
  webServer: [
    {
      command: "pnpm exec tsx src/server/main.ts --root . --port 4318",
      url: "http://127.0.0.1:4318/api/health",
      reuseExistingServer: true,
    },
    {
      command:
        "pnpm exec vite build && pnpm exec vite preview --host 127.0.0.1 --port 4173",
      url: "http://127.0.0.1:4173",
      reuseExistingServer: true,
    },
  ],
  use: {
    baseURL: "http://127.0.0.1:4173",
  },
});
