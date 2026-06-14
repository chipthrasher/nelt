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


### 7. Recomputation and uncached lookups
`lineDrawingMode(portals[i])` is invoked 4× per portal (`main.js:275, 310, 313`),
recomputing the same result. `document.querySelector(...)` is re-run constantly
inside loops and handlers instead of caching references.

### 9. No quality gates; weak error handling
- CI (`.github/workflows/main.yml`) only does `aws s3 sync .` — no lint, no
  tests, no type check. It also uploads the entire repo (README, AGENTS.md,
  `.github/`, the 3 MB `political.webp`) to the public bucket.
- Fetch failures just `console.error` and continue (`main.js:42-60`), then
  `tsvJSON(colorTSV)` throws on the resulting `undefined` — a failed data load
  produces a blank page, not a graceful message.
