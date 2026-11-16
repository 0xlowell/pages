# Lowell's portfolio

An AI engineering portfolio built with Next.js, React and Tailwind, published
as static files on GitHub Pages.

## Local development

Use Linux-native Node.js 24 and npm.

```sh
npm ci
npm run dev
```

## Validation and export

```sh
npm run lint
npm run build
```

The build includes TypeScript validation and exports to `out/`. Reproduce the
GitHub Pages deployment path with:

```sh
PAGES_BASE_PATH=/pages npm run build
```

## Content

- `app/lib/projects.tsx` and `app/projects/`: summaries and case studies.
- `app/lib/articles.ts` and `app/articles/`: writing and article content.
- `app/components/`: shared presentation and illustrative interactions.
- `app/globals.css`: design tokens, layout and styles.
- `app/fonts/`: Switzer (Fontshare, ITF Free Font License), self-hosted so
  pages make no third-party requests.
- [Anonymized brief](docs/portfolio-brief.md): context for another designer.
- [Claude prompt](docs/claude-design-prompt.md): an independent design handoff.

Use Lowell as the only public name and GitHub-only contact. Examples use
fictional data; do not add private screenshots or workplace artifacts.

## Publication

One workflow, `.github/workflows/deploy.yml`, validates pushes to `main`, builds
with the Pages base path and deploys that artifact. It also supports manual
execution. Do not queue a duplicate deployment while one is already running.
