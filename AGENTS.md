# AGENTS.md

You have free rein to edit this codebase. I have everything tracked in Git, so be careful before running destructive Git commands.

When you fix something that was in the below "Maintainability assessment", please remove it from the list.

If you can accomplish something with less code, please do so. If you can accomplish something with more code but better readability, please do so.

## Maintainability assessment

This is a single-page Leaflet map app: `index.html` + `style.css` + a small
`main.js` entry point that wires together ES modules under `js/` (`data`, `map`,
`render`, `events`, etc. — ~625 lines of JS total). Data is pulled from a Google
Sheet as TSV and deployed by syncing the repo to S3. 