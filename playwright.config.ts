import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",

  fullyParallel: false,

  forbidOnly: Boolean(process.env.CI),

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ["list"],
    ["html", { open: "never" }],
  ],

  use: {
    // Use the live application by default.
    // BASE_URL can override it for other environments.
    baseURL:
      process.env.BASE_URL ||
      "https://shop-zone-ecommerce-demo.vercel.app",

    trace: "retain-on-failure",

    screenshot: "only-on-failure",

    video: "retain-on-failure",

    ...devices["Desktop Chrome"],
  },
});