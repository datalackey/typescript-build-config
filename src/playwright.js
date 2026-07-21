import { execSync } from "child_process";
import { existsSync } from "fs";
import { defineConfig } from "@playwright/test";

const FALLBACK_PATHS = [
  "/run/current-system/sw/bin/chromium",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "/usr/local/bin/chromium",
  "/usr/local/bin/chromium-browser",
];

// Returns {} (not an error) when no system Chromium is found — Playwright
// then falls back silently to its own bundled browser.
export function nixChromiumLaunchOptions() {
  const envPath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
  if (envPath) return { executablePath: envPath };

  for (const cmd of ["chromium", "chromium-browser"]) {
    try {
      const p = execSync(`which ${cmd}`, { encoding: "utf8" }).trim();
      if (p) return { executablePath: p };
    } catch {
      // not in PATH
    }
  }

  for (const p of FALLBACK_PATHS) {
    if (existsSync(p)) return { executablePath: p };
  }

  return {};
}

// Merges nixChromiumLaunchOptions() into overrides.use.launchOptions so that
// consumer-supplied launchOptions are preserved and the NixOS path wins only
// when the env var or a discoverable system binary is present.
export function definePlaywrightConfig(overrides) {
  const nixLaunchOptions = nixChromiumLaunchOptions();
  return defineConfig({
    ...overrides,
    use: {
      ...overrides.use,
      launchOptions: {
        ...overrides.use?.launchOptions,
        ...nixLaunchOptions,
      },
    },
  });
}
