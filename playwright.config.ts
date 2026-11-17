
import { defineConfig, devices } from "@playwright/test";

const baseURL =
  process.env.BASE_URL ||
  "https://shop-zone-ecommerce-demo.vercel.app";

const hostname = new URL(baseURL).hostname;

const isLocalApplication =
  hostname === "127.0.0.1" ||
  hostname === "localhost";

export default defineConfig({
  testDir: "./tests",

  fullyParallel: false,

  forbidOnly: Boolean(process.env.CI),

  retries: process.env.CI ? 2 : 0,

  workers: 1,

  reporter: [
    ["list"],
    ["html", { open: "never" }],
  ],

  use: {
    baseURL,

    trace: "retain-on-failure",

    screenshot: "only-on-failure",

    video: "retain-on-failure",

    ...devices["Desktop Chrome"],
  },

  // Automatically start React for local testing.
  // Do not start a local server for Vercel tests.
  ...(isLocalApplication
    ? {
        webServer: {
          command:
            "npm run dev -- --host 127.0.0.1 --port 5173 --strictPort",

          cwd: "../ecommerce-demo-app",

          url: "http://127.0.0.1:5173",

          reuseExistingServer: !process.env.CI,

          timeout: 120_000,
        },
      }
    : {}),
});
