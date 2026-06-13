# AGENTS.md

You have free rein to edit this codebase. I have everything tracked in Git, so be careful before running destructive Git commands.

When you fix something that was in the below "Maintainability assessment", please remove it from the list.

If you can accomplish something with less code, please do so. If you can accomplish something with more code but better readability, please do so.

## Maintainability assessment

This is a single-page Leaflet map app: `index.html` + `main.js` (~650 lines) +
`style.css`, with data pulled from a Google Sheet as TSV and deployed by syncing
the repo to S3. It works, but several things actively fight maintainability.

### 3. Leaked implicit globals and `for…in` over arrays
`for (i in colorData)`, `for (j in innerLines)`, `for (k in innerLines)`, etc.
(`main.js:65, 72, 183, 251, 277, 331`) never declare the loop variable — these
are implicit globals, and `for…in` over arrays is fragile.

### 4. `MAP_SIZE_MULTIPLIER` is a hardcoded magic constant
`MAP_SIZE_MULTIPLIER = 687.5` (`js/config.js`) is hardcoded; the code itself flags
that it should be computed from the dynmap endpoints rather than pinned.


### 6. Dead code and debugging cruft
- `functions.isMobile` (`main.js:3-8`) — a giant device-detection regex — is
  never called.
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

### 10. Tooling inconsistency — RESOLVED
~~`cache.sh` is **both tracked in git and listed in `.gitignore`**.~~ Fixed:
`cache.sh` removed from `.gitignore`; it remains tracked. Note the canonical data
URL still lives only inside that script.

### Priorities
1. Introduce a `package.json` with pinned dependencies and a minimal lint/format
   step in CI.

None of this requires a framework — it's the same vanilla approach, just
structured so a change in one area can't silently break another.
