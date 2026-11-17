
import { defineConfig, devices } from "@playwright/test";

const LOCAL_BASE_URL = "http://127.0.0.1:5173";
const LIVE_BASE_URL = "https://shop-zone-ecommerce-demo.vercel.app";

const baseURL =
  process.env.BASE_URL?.trim() || LIVE_BASE_URL;

const hostname = new URL(baseURL).hostname;

const isLocalApplication =
  hostname === "127.0.0.1" ||
  hostname === "localhost";

const isCI = Boolean(process.env.CI);

console.log("\n=================================");
console.log(`Playwright Target: ${baseURL}`);
console.log(`Environment: ${isLocalApplication ? "LOCAL" : "LIVE"}`);
console.log(`Browser: ${isCI ? "Chromium (CI)" : "Google Chrome"}`);
console.log(`Mode: ${isCI ? "HEADLESS" : "HEADED"}`);
console.log("=================================\n");

export default defineConfig({
  testDir: "./tests",

  fullyParallel: false,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
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

    // Use installed Google Chrome for local execution.
    // GitHub Actions uses the Playwright-installed Chromium.
    ...(!isCI ? { channel: "chrome" } : {}),
  },

  // Automatically start React only when testing localhost.
  ...(isLocalApplication
    ? {
        webServer: {
          command:
            "npm run dev -- --host 127.0.0.1 --port 5173 --strictPort",

          cwd: "../ecommerce-demo-app",

          url: LOCAL_BASE_URL,

          reuseExistingServer: !isCI,

          timeout: 120_000,
        },
      }
    : {}),
});
