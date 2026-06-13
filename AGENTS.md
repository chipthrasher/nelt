# AGENTS.md

You have free rein to edit this codebase. I have everything tracked in Git, so be careful before running destructive Git commands.

When you fix something that was in the below "Maintainability assessment", please remove it from the list.

If you can accomplish something with less code, please do so. If you can accomplish something with more code but better readability, please do so.

## Maintainability assessment

This is a single-page Leaflet map app: `index.html` + `main.js` (~650 lines) +
`style.css`, with data pulled from a Google Sheet as TSV and deployed by syncing
the repo to S3. It works, but several things actively fight maintainability.

### 2. HTML is built by string concatenation and injected via `innerHTML`
- Untrusted spreadsheet content goes straight into markup: `Wiki URL`
  (`main.js:204`), `Warning` title (`:213`), name/description/entity
  (`:218-231`). Anyone who can edit the source Google Sheet can inject
  script/HTML — a stored XSS vector.
- `portalGroup.innerHTML += ...` inside the portal loop (`main.js:326`) and
  `lineGroup.innerHTML += ...` (`:343`) re-parse and re-serialize the growing DOM
  on every iteration — O(n²).

### 3. Leaked implicit globals and `for…in` over arrays
`for (i in colorData)`, `for (j in innerLines)`, `for (k in innerLines)`, etc.
(`main.js:65, 72, 183, 251, 277, 331`) never declare the loop variable — these
are implicit globals, and `for…in` over arrays is fragile.

### 4. The data schema lives in a spreadsheet, referenced by magic string keys
Column names like `'Political Entity'`, `'Inner Line'`, `'X Connector'`,
`'National'`, `'IBWH'` are string literals scattered across the file. Rename a
column in the sheet and the app silently breaks with no error. There's no schema
definition or validation. `mapSizeMultiplier = 687.5` is a hardcoded magic
constant the code itself flags as wrong (`main.js:127`).

### 5. Dependencies are unpinned and partly duplicated
`index.html:62-66` loads popper + tippy **twice** (a "Development" pair and a
"Production" pair, both from `unpkg @2`/`@6` floating major versions).
`dom-slider` is loaded from a githack raw commit URL (`:68`). Leaflet, tippy, and
`window.domSlider` are ambient globals with no manifest or lockfile.

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
1. Stop building DOM via `innerHTML +=` string concatenation — use
   `textContent`/`createElement`, which kills both the XSS exposure and the
   O(n²) reparse.
2. Introduce a `package.json` with pinned dependencies and a minimal lint/format
   step in CI.

None of this requires a framework — it's the same vanilla approach, just
structured so a change in one area can't silently break another.
