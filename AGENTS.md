# AGENTS.md

You have free rein to edit this codebase. I have everything tracked in Git, so be careful before running destructive Git commands.

When you fix something that was in the below "Maintainability assessment", please remove it from the list.

If you can accomplish something with less code, please do so. If you can accomplish something with more code but better readability, please do so.

## Maintainability assessment

This is a single-page Leaflet map app: `index.html` + `style.css` + a small
`main.js` entry point that wires together ES modules under `js/` (`data`, `map`,
`render`, `events`, etc. — ~625 lines of JS total). Data is pulled from a Google
Sheet as TSV and deployed by syncing the repo to S3. It works, but several
things actively fight maintainability.

### 4. `MAP_SIZE_MULTIPLIER` is a hardcoded magic constant
`MAP_SIZE_MULTIPLIER = 687.5` (`js/config.js`) is hardcoded; the code itself flags
that it should be computed from the dynmap endpoints rather than pinned.


### 6. Dead code and debugging cruft
- Dozens of commented-out `// console.log(...)` lines throughout, plus
  commented-out code (`:414`) and several `TODO`s (`:127, 308, 341`).

### 7. Recomputation and uncached lookups
`lineDrawingMode(portals[i])` is invoked 4× per portal (`main.js:275, 310, 313`),
recomputing the same result. `document.querySelector(...)` is re-run constantly
inside loops and handlers instead of caching references.

### 8. Fragile by-index event pairing
Circle and directory handlers are paired by array index — `circleElements[i]` ↔
`itemtopElements[i]` (`main.js:607, 612`). This silently assumes both DOM
collections are built in identical order — an unwritten invariant that any change
to rendering order or filtering would break with no warning.

### 9. No quality gates; weak error handling
- CI (`.github/workflows/main.yml`) only does `aws s3 sync .` — no lint, no
  tests, no type check. It also uploads the entire repo (README, AGENTS.md,
  `.github/`, the 3 MB `political.webp`) to the public bucket.
- Fetch failures just `console.error` and continue (`main.js:42-60`), then
  `tsvJSON(colorTSV)` throws on the resulting `undefined` — a failed data load
  produces a blank page, not a graceful message.


### Priorities
1. ~~Introduce a minimal lint step in CI.~~ Done with **zero npm** — no
   `package.json`, `node_modules`, or lockfile. A single Deno binary
   (`brew install deno`) runs `deno lint` (configured in `deno.json` to flag
   unused vars/imports/functions, excluding vendored `assets/`). It runs locally
   via `deno lint`, before each commit via the `.githooks/pre-commit` hook
   (`git config core.hooksPath .githooks` to enable), and in CI (pinned
   `denoland/setup-deno`), gating the S3 deploy on it passing.

None of this requires a framework — it's the same vanilla approach, just
structured so a change in one area can't silently break another.
