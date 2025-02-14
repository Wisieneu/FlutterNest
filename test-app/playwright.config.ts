import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  retries: 2,
  testDir: "./src/tests",
  fullyParallel: true,
  // forbidOnly: !!import.meta.env.CI,
  // retries: import.meta.env.CI ? 2 : 0,
  // workers: import.meta.env.CI ? 1 : undefined,
  reporter: "html",
  globalSetup: "./src/engine/test.config.ts",

  use: {
    trace: "retain-on-failure",
    baseURL: process.env.baseUrl,
    headless: true,
    screenshot: "only-on-failure",
    video: "off",
  },

  timeout: 10 * 1000,

  expect: {
    timeout: 5 * 1000,
  },

  projects: [
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
});
