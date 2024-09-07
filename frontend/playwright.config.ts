import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  // forbidOnly: !!import.meta.env.CI,
  // retries: import.meta.env.CI ? 2 : 0,
  // workers: import.meta.env.CI ? 1 : undefined,
  reporter: "html",

  use: {
    trace: "on-first-retry",
    baseURL: "http://localhost:5173/",
    headless: false,
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
});
