import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  retries: 2,
  testDir: "./src/tests",
  fullyParallel: true,
  // forbidOnly: !!import.meta.env.CI,
  // retries: import.meta.env.CI ? 2 : 0,
  // workers: import.meta.env.CI ? 1 : undefined,
  reporter: "html",
  globalTimeout: 10 * 1000,

  use: {
    trace: "retain-on-failure",
    baseURL: "http://localhost:5173/",
    headless: true,
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  timeout: 30 * 1000,
  expect: {
    timeout: 5 * 1000,
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
