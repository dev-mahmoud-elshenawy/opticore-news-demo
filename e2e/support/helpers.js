/* global element, by, waitFor */
// Shared Detox helpers. element/by/waitFor are Jest-environment globals
// (detox/runners/jest/testEnvironment) — required modules run in the same
// test-file realm, so they're available here without importing anything.

const TIMEOUT = { warm: 15000, cold: 45000 };

async function tapTab(name) {
  await waitFor(element(by.id(`tab-${name}`))).toBeVisible().withTimeout(TIMEOUT.warm);
  await element(by.id(`tab-${name}`)).tap();
}

async function waitVisible(matcher, timeout = TIMEOUT.warm) {
  await waitFor(matcher).toBeVisible().withTimeout(timeout);
}

async function waitGone(matcher, timeout = TIMEOUT.warm) {
  await waitFor(matcher).not.toBeVisible().withTimeout(timeout);
}

module.exports = { TIMEOUT, tapTab, waitVisible, waitGone };
