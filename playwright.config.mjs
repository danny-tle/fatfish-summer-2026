import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    // Use the same host as Next dev's client assets so hydration is not treated
    // as a cross-origin request.
    baseURL: "http://localhost:3100",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chrome", use: { ...devices["Pixel 5"] } },
  ],
  webServer: {
    command: "npm run dev -- --hostname localhost --port 3100",
    url: "http://localhost:3100",
    reuseExistingServer: !process.env.CI,
    // E2E tests cover the rendered site, not the restaurant's live POS API.
    // A closed local port makes getMenuData use its committed snapshot.
    env: { TOAST_HOST: "http://127.0.0.1:1" },
  },
});
