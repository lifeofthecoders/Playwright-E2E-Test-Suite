
import { execFile, spawn } from "node:child_process";
import { promisify } from "node:util";
import { setTimeout as delay } from "node:timers/promises";
import path from "node:path";
import { existsSync } from "node:fs";

const execFileAsync = promisify(execFile);

const WORKFLOW = "playwright.yml";

const REPOSITORY =
  "lifeofthecoders/Playwright-E2E-Test-Suite";

const REPORT_URL =
  "https://lifeofthecoders.github.io/Playwright-E2E-Test-Suite/";

const ACTIONS_URL =
  `https://github.com/${REPOSITORY}/actions`;

async function runGH(args) {
  try {
    const { stdout, stderr } = await execFileAsync(
      "gh",
      args,
      {
        encoding: "utf8",
        windowsHide: true,
        maxBuffer: 10 * 1024 * 1024,
      }
    );

    return `${stdout}\n${stderr}`;
  } catch (error) {
    throw new Error(
      error.stderr?.trim() ||
      error.message ||
      "GitHub CLI command failed."
    );
  }
}

async function getLatestRunId() {
  const output = await runGH([
    "run",
    "list",
    "--workflow",
    WORKFLOW,
    "--event",
    "workflow_dispatch",
    "--branch",
    "main",
    "--limit",
    "1",
    "--json",
    "databaseId",
  ]);

  const runs = JSON.parse(output);
  return runs[0]?.databaseId ?? null;
}

async function findNewWorkflowRun(previousRunId, triggerTime) {
  console.log("\nWaiting for GitHub Actions to create the run...");

  for (let attempt = 0; attempt < 60; attempt++) {
    const output = await runGH([
      "run",
      "list",
      "--workflow",
      WORKFLOW,
      "--event",
      "workflow_dispatch",
      "--branch",
      "main",
      "--limit",
      "10",
      "--json",
      "databaseId,createdAt",
    ]);

    const runs = JSON.parse(output);

    const newRun = runs.find(run =>
      run.databaseId !== previousRunId &&
      Date.parse(run.createdAt) >= triggerTime - 10000
    );

    if (newRun) {
      return newRun.databaseId;
    }

    await delay(2000);
  }

  throw new Error("Could not find the newly created workflow run.");
}

async function waitForWorkflow(runId) {
  console.log(`\nMonitoring workflow: ${runId}`);

  for (let attempt = 0; attempt < 120; attempt++) {
    const output = await runGH([
      "run",
      "view",
      String(runId),
      "--json",
      "status,conclusion,jobs",
    ]);

    const details = JSON.parse(output);

    const deploymentJob = details.jobs?.find(job =>
      job.name === "Publish Live Playwright HTML Report"
    );

    console.log(
      `Workflow status: ${details.status} | Result: ${details.conclusion || "Pending"}`
    );

    if (details.status === "completed") {
      if (deploymentJob?.conclusion !== "success") {
        throw new Error(
          `Report deployment failed. Check: ${ACTIONS_URL}/runs/${runId}`
        );
      }

      return details;
    }

    await delay(5000);
  }

  throw new Error(
    `Workflow timed out. Check: ${ACTIONS_URL}/runs/${runId}`
  );
}

function openReportInChrome(url) {
  if (process.platform === "win32") {
    const chromePaths = [
      path.join(
        process.env.PROGRAMFILES || "C:\\Program Files",
        "Google",
        "Chrome",
        "Application",
        "chrome.exe"
      ),

      path.join(
        process.env["PROGRAMFILES(X86)"] ||
          "C:\\Program Files (x86)",
        "Google",
        "Chrome",
        "Application",
        "chrome.exe"
      ),

      path.join(
        process.env.LOCALAPPDATA || "",
        "Google",
        "Chrome",
        "Application",
        "chrome.exe"
      ),
    ];

    const chromePath = chromePaths.find(existsSync);

    if (chromePath) {
      const browser = spawn(chromePath, [url], {
        detached: true,
        stdio: "ignore",
        windowsHide: true,
      });

      browser.unref();
      return;
    }

    // Fall back to the Windows default browser.
    const browser = spawn(
      "cmd.exe",
      ["/c", "start", "", url],
      {
        detached: true,
        stdio: "ignore",
        windowsHide: true,
      }
    );

    browser.unref();
    return;
  }

  const command =
    process.platform === "darwin" ? "open" : "xdg-open";

  const browser = spawn(command, [url], {
    detached: true,
    stdio: "ignore",
  });

  browser.unref();
}

async function main() {
  console.log("\n========================================");
  console.log("   PUBLISH LIVE PLAYWRIGHT HTML REPORT");
  console.log("========================================\n");

  // Verify GitHub authentication.
  await runGH(["auth", "status"]);

  // Remember the previous report workflow run.
  const previousRunId = await getLatestRunId();

  // Trigger the GitHub Actions workflow.
  console.log("Triggering GitHub Actions workflow...\n");

  const triggerTime = Date.now();

  await runGH([
    "workflow",
    "run",
    WORKFLOW,
    "--ref",
    "main",
  ]);

  // Identify the new workflow run.
  const runId = await findNewWorkflowRun(
    previousRunId,
    triggerTime
  );

  console.log(`\nWorkflow Run ID: ${runId}`);

  // Wait for report deployment.
  const details = await waitForWorkflow(runId);

  const testJob = details.jobs?.find(
    job => job.name === "Run Playwright Tests"
  );

  console.log("\n========================================");
  console.log("       LIVE REPORT DEPLOYED");
  console.log("========================================");

  console.log(`\nPublic report: ${REPORT_URL}`);
  console.log(`${ACTIONS_URL}/runs/${runId}`);

  if (testJob?.conclusion !== "success") {
    console.error("\nWarning: The GitHub Actions test job failed.");
    console.error("Open the report to inspect the results.");

    process.exitCode = 1;
  }

  // Add a unique query parameter to help load the newest report.
  const reportWithRunId = `${REPORT_URL}?run=${runId}`;

  console.log("\nOpening the published report in Google Chrome...");

  openReportInChrome(reportWithRunId);
}

main().catch(error => {
  console.error("\nLive report publishing failed:");
  console.error(error.message);

  console.error(`\nGitHub Actions: ${ACTIONS_URL}`);

  process.exitCode = 1;
});
