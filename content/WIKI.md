# How this garden is kept

This site follows the LLM wiki pattern: you feed raw material, an agent keeps a
wiki of linked pages up to date, and the site shows the wiki as a garden.

## Layers

- `raw/`: yours. Never edited by the agent.
- `wiki/`: one Markdown file per idea, maintained by the agent. Each page
  grows from one or more raw sources.
- `writing/`: long articles, written by you.
- `wiki/_log.md`: one line per ingest.

## Page format

    ---
    subjects: art, memory
    stage: seedling | budding | evergreen
    planted: 2026-11-20
    tended: 2026-11-20
    sources: 2026-11-20-expo-matisse.md, 2026-11-02-notes.md
    link: /writing/some-article/
    image: /wiki/some-image.jpg
    alt: What the image shows
    ---
    The idea, in one to three sentences.

- `subjects` decide which bed a plant grows in. A page with two subjects
  joins two beds with a path.
- `stage`: `seedling` for a raw thought, `budding` once it has been worked on,
  `evergreen` when it is settled. Plants grow with their stage and with the
  number of `sources`.
- `tended` is the last day the page changed.

## Ingest

When asked to ingest:

1. Read the files in `raw/` that are not yet listed in any page's `sources`.
2. For each, either tend existing pages (update the text, add the source,
   update `tended`, raise the `stage` if the idea has matured) or plant new
   pages (`stage: seedling`).
3. Keep the person's wording where possible. Do not invent facts, names or
   numbers that are not in the raw material.
4. Add a line to `wiki/_log.md`.

## Health check

When asked to check the garden: list pages with no sources, pages that
contradict each other, subjects with a single page, and pages not tended for
three months. Report; change nothing without being asked.
