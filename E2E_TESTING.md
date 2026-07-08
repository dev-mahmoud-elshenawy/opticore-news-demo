# 🧪 End-to-End Testing with Detox — QC Guide

**Run the real app, tap real buttons, catch real regressions.**

[![E2E: Detox](https://img.shields.io/badge/E2E-Detox_20-262626?logo=testcafe&logoColor=white)](https://wix.github.io/Detox/)
[![Platforms](https://img.shields.io/badge/Platforms-iOS_·_Android-000020?logo=expo&logoColor=white)](https://expo.dev)
[![Runtime](https://img.shields.io/badge/Run-~2_min-brightgreen)]()

This is the practical guide for running and understanding the **Detox** end-to-end (E2E)
tests for the OptiCore News demo. It's written for QC/QA: what E2E covers, how to run it,
how to read the results, and the gotchas that trip people up.

> 💡 Just want to run it? Jump to the [Quick start](#quick-start).

---

---

## 1. What Detox is (and what it is *not*)

**Detox** drives the app the way a real user would — it launches the built app on a
**simulator/emulator**, taps buttons, types into fields, and asserts what's on screen. It is
"grey-box": it waits for the app to be idle (network, animations, timers) before each action,
so tests are far less flaky than screenshot-diffing tools.

| | What it is | What it is not |
|---|---|---|
| **Detox (this guide)** | Full app on a device/simulator, real navigation, real newsapi.org data | Not a component test |
| **Jest** (`npm test`) | Fast unit/integration tests of repositories, hooks, stores | Does not launch the app |

**Two different test suites live in this repo:**

- `test/` → Jest unit/integration (run with `npm test`) — fast, no device.
- `e2e/`  → Detox end-to-end (this guide) — needs a built app on a simulator.

> Detox needs a **native debug build** of the app. It does **not** run in Expo Go.

---

## 2. Prerequisites

**iOS (primary target for QC on macOS):**
- macOS with **Xcode** installed (+ Command Line Tools).
- An iOS Simulator. The config targets **iPhone 17** (see [Changing the device](#changing-the-device) if you don't have it).
- CocoaPods (`sudo gem install cocoapods`) — used by the native build.

**Android (optional):**
- Android Studio + SDK.
- An emulator named **`Pixel_9_Pro_XL`** (or edit `.detoxrc.js`).

**Both:**
- Node + `npm install` already run.
- A newsapi.org key in `.env` — the tests hit **live** newsapi.org data:
  ```bash
  cp .env.example .env      # then set EXPO_PUBLIC_NEWS_API_KEY
  ```
  newsapi.org's free tier only authorizes `localhost`/dev origins, so E2E is dev-only.
- Detox CLI is bundled via the `detox` dev-dependency; run it with `npx detox …` or the npm scripts.

---

## 3. One-time setup (after clone or after any native change)

The `ios/` and `android/` native folders are **generated** (Expo "CNG") and are gitignored, so
they won't exist on a fresh clone. Generate them once:

```bash
npx expo prebuild            # creates ios/ and android/ (wires Detox via @config-plugins/detox)
```

Then build the app for the simulator (this is the slow step — several minutes):

```bash
npm run e2e:build:ios        # or: npm run e2e:build:android
```

**When do you need to rebuild?** Only when the **native** app changes — new native module,
dependency bump, `app.json` change, or after a fresh `expo prebuild`. Editing JavaScript/TypeScript
or the test files does **not** require a rebuild (Detox loads JS from the Metro bundler at runtime).

---

## 4. Running the tests

```bash
npm run e2e:test:ios         # run the full flow on iOS simulator
npm run e2e:test:android     # run the full flow on Android emulator
```

Detox boots the simulator, installs the built app, and runs the suite. A full run takes
roughly **2 minutes**.

### Useful flags (append after the script via `npx detox test -c ios.sim.debug …`)

```bash
# Save a screenshot + device logs for every FAILING test (great for bug reports):
npx detox test -c ios.sim.debug --take-screenshots failing --record-logs failing --artifacts-location ./artifacts

# Verbose logging (dumps the view hierarchy on a failed match — noisy but diagnostic):
npx detox test -c ios.sim.debug --loglevel verbose
```

Artifacts land under `./artifacts/<config>.<timestamp>/<✓|✗ test name>/`:
`testStart.png`, `testDone.png`, `testFnFailure.png` (the screen at the moment of failure), and
`.log` device logs. **Attach `testFnFailure.png` to any bug you file.**
(The `artifacts*/` folders and `*.log` files are gitignored.)

---

## 5. How to read the results

At the end of a run you'll see a summary like:

```
Tests:       12 passed, 12 total
Time:        118 s
```

- A **`✓`** line = passed. A **`✕`** line = failed, followed by the assertion and file/line.
- Exit code `0` = all passed; non-zero = at least one failure.
- A failed assertion reads like:
  `Timed out while waiting for expectation: TOBEVISIBLE WITH MATCHER(text == "…") TIMEOUT(15s)`
  → Detox waited 15s for that element to appear and it never did. Open the `testFnFailure.png`
  to see the actual screen.

---

## 6. What the suite covers

Everything runs as **one continuous user journey** in a single file
(`e2e/tests/full-flow.test.js`) so the whole app shares one running session. The blocks, in order:

| Area | Checks |
|---|---|
| **Headlines** | Article list loads (live data); category filter (Technology) works; reset to General |
| **Bookmarking** | Saved list starts empty; bookmark an article from its detail view; **bookmark survives an app restart**; un-bookmark and the list is empty again |
| **Settings** | Theme switch (light/dark/system); save valid preferences shows the "Saved ✓" flash |
| **Search** | Initial hint shows; a query returns results (live data); clearing the box returns to the hint |

> **Why one file?** Detox resets its connection *between* test files. Keeping the journey in a
> single file is the only way to genuinely share one running app across the whole flow, so a
> bookmark made in one step is still there in the next.

**Two ordering rules the flow depends on** (documented at the top of the test file):
1. Never tap a tab while on the article-detail screen — detail is stacked *over* the tab bar, so
   the tabs aren't reachable there. Leave detail via the save toggle or an app relaunch.
2. Settings runs **before** Search, because Search leaves the keyboard up, which would cover the
   tab bar for whatever runs next. Search is intentionally last.

---

## 7. `testID`s (element hooks)

Detox finds elements by `testID` (`by.id(...)`) or visible text (`by.text(...)`). The stable
`testID`s in this app:

| `testID` | Element |
|---|---|
| `tab-headlines` / `tab-search` / `tab-saved` / `tab-settings` | Bottom tab buttons |
| `article-card` | An article row (use `.atIndex(0)` for the first) |
| `article-save-toggle` | The bookmark toggle on the article-detail screen |
| `category-scroll` | The horizontal category filter strip |
| `category-chip-<name>` | A category chip, e.g. `category-chip-technology` |
| `theme-mode-light` / `theme-mode-dark` / `theme-mode-system` | Appearance toggle |
| `settings-country` / `settings-pagesize` / `settings-save` | Settings form fields + Save |
| `search-input` | The search box |

> If you add a new screen/control that E2E should reach, give it a `testID` — prefer that over
> matching visible text, which changes with copy and localization.

---

## 8. Known limitation — the Settings "Country" field

There is **no E2E test for the invalid-country-code validation message**, and this is deliberate.

The Country field is a **React-Hook-Form-controlled** input: its value is driven asynchronously
(`setValue()` → `watch()`), so when Detox writes text, React re-asserts the previous value before
the update lands and **the typed text is reverted**. Neither `typeText` nor `replaceText` can make
the value stick, so an invalid value can't be entered from a test. (The Search box types fine
because it's backed by plain synchronous state.)

This is a Detox ↔ controlled-input limitation, **not an app bug** — a real user typing at human
speed works correctly. The `saves valid preferences` test still passes because it saves the
already-valid default preferences.

**QC takeaway:** verify the country-code validation message **manually** (type a 1-letter code and
confirm the red "Use a 2-letter country code (e.g. us, gb)" text appears). Don't expect it in the
automated suite.

---

## 9. Troubleshooting

| Symptom | Cause / Fix |
|---|---|
| **All tests fail instantly (~1 ms each), run ends in ~35s** | The app never launched — usually a wedged simulator after several back-to-back runs. Fix: `xcrun simctl shutdown all`, then re-run. |
| `binaryPath … .app does not exist` | You haven't built. Run `npm run e2e:build:ios` (and `npx expo prebuild` first if `ios/` is missing). |
| Tests fail on data-loading steps (headlines/search) | Missing/invalid `EXPO_PUBLIC_NEWS_API_KEY` in `.env`, or no network. newsapi.org data is live. |
| Changed JS but the app behaves like the old code | Make sure the Metro bundler is reachable; for a debug build Detox loads JS at runtime. A full clean: rebuild. |
| iPhone 17 simulator not installed | Edit `devices.simulator.device.type` in `.detoxrc.js` to a simulator you have. |
| A single test is flaky on timing | Timeouts live in `e2e/support/helpers.js` (`TIMEOUT.warm` = 15s, `TIMEOUT.cold` = 45s). |

### Changing the device

Edit `.detoxrc.js`:
```js
devices: {
  simulator: { type: 'ios.simulator', device: { type: 'iPhone 17' } },  // ← change here
  emulator:  { type: 'android.emulator', device: { avdName: 'Pixel_9_Pro_XL' } },
}
```

---

## 10. File map

| File | Purpose |
|---|---|
| `.detoxrc.js` | Detox config — apps (build commands + binary paths), devices, configurations |
| `e2e/jest.config.js` | Jest runner config for Detox (serial, single worker, 120s timeout) |
| `e2e/support/helpers.js` | Shared helpers: `tapTab`, `waitVisible`, `waitGone`, `TIMEOUT` |
| `e2e/tests/full-flow.test.js` | The one end-to-end journey (all assertions) |
| `package.json` scripts | `e2e:build:ios` / `e2e:test:ios` (+ `:android` variants) |

---

## Quick start

```bash
# one time (or after native changes)
cp .env.example .env          # set EXPO_PUBLIC_NEWS_API_KEY
npx expo prebuild             # generate ios/ + android/ (only if missing)
npm run e2e:build:ios         # build the app for the simulator (slow)

# every run
npm run e2e:test:ios          # ~2 min; exit code 0 = all green

# when filing a bug
npx detox test -c ios.sim.debug --take-screenshots failing --artifacts-location ./artifacts
# → attach ./artifacts/**/testFnFailure.png
```

---

## 📚 Related

- 📖 **[README.md](README.md)** — project overview & architecture
- 🗺 **[ORIENTATION.md](ORIENTATION.md)** — diagram-first architecture map
- ⚡ **[opticore-react-native](https://github.com/dev-mahmoud-elshenawy/opticore-react-native)** — the library under test

---

<div align="center">

Maintained by [Mahmoud El Shenawy](https://github.com/dev-mahmoud-elshenawy) · part of the **OptiCore** ecosystem

</div>
