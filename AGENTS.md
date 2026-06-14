# AGENTS.md

You have free rein to edit this codebase. I have everything tracked in Git, so be careful before running destructive Git commands.

When you fix something that was in the below "Roadmap", please remove it from the list.

If you can accomplish something with less code, please do so. If you can accomplish something with more code but better readability, please do so.

## Roadmap

This is a single-page Leaflet map app: `index.html` + `style.css` + a small
`main.js` entry point that wires together ES modules under `js/` (`data`, `map`,
`render`, `events`, etc. — ~625 lines of JS total). Data is pulled from a Google
Sheet as TSV and deployed by syncing the repo to S3. 

1. 

- map data updates. The Lambda runs every 2hr, but doesn't always result in a change. It needs to detect when an actual change happened, and update a "last updated" value into config.json in the S3 bucket (which already contains "version" so there would need to be some jq action). The site should show this value, only if it's set.
This should address all the points of failure in # 1, as far as I know!

2.