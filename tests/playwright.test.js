import { test } from "node:test";
import assert from "node:assert/strict";
import { nixChromiumLaunchOptions } from "../src/playwright.js";

function withEnv(key, value, fn) {
  const prev = process.env[key];
  if (value === undefined) {
    delete process.env[key];
  } else {
    process.env[key] = value;
  }
  try {
    return fn();
  } finally {
    if (prev === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = prev;
    }
  }
}

test("returns { executablePath } when env var is set", () => {
  withEnv(
    "PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH",
    "/nix/store/fake-chromium/bin/chromium",
    () => {
      assert.deepStrictEqual(nixChromiumLaunchOptions(), {
        executablePath: "/nix/store/fake-chromium/bin/chromium",
      });
    },
  );
});

test("empty string env var falls through to discovery (not returned as executablePath)", () => {
  withEnv("PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH", "", () => {
    const result = nixChromiumLaunchOptions();
    assert.notDeepStrictEqual(result, { executablePath: "" });
  });
});

test("never throws — always returns a plain object", () => {
  withEnv("PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH", undefined, () => {
    let result;
    assert.doesNotThrow(() => {
      result = nixChromiumLaunchOptions();
    });
    assert.ok(result !== null && typeof result === "object");
    if ("executablePath" in result) {
      assert.equal(typeof result.executablePath, "string");
      assert.ok(result.executablePath.length > 0);
    }
  });
});
