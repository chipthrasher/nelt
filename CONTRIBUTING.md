# CONTRIBUTING.md

Thanks for helping!

## Local Development

To run the Nelt map:
1. Clone this repo
2. Install [Deno](https://deno.com) — a linter:
    - macOS (Homebrew): `brew install deno`
    - macOS / Linux: `curl -fsSL https://deno.land/install.sh | sh`
    - Windows (PowerShell): `irm https://deno.land/install.ps1 | iex`
3. Run `./cache.sh` to pull a copy of map data
4. Serve the website (I use VS Code's "Go Live")

Lint runs automatically before each commit.

Run it manually anytime with `deno lint`.

## Etiquette

To help me keep track of your changes, please:

1. Make branches & pull requests for your changes. If you want to contribute regularly, I can add you as a collaborator, so you don't have to fork the repo!
2. Let me be the one to resolve open threads.
3. Title your PRs with conventional commits, like `fix: typo in README` or `feat: add new exit`. This helps the automatic versionining work correctly.