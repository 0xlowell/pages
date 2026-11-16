# How this garden is kept

This site follows the LLM wiki pattern: you feed raw material, an agent keeps a
wiki of linked pages up to date, and the site shows the wiki as a garden.

## Glossary

Use these words, and only these, in pages, logs and the interface. A metaphor
held consistently is easier to think with than a mix of jargon.

| Word | Means | Pattern term |
| --- | --- | --- |
| compost | raw material in `raw/`, unedited | raw sources |
| seed | where a plant starts, on the ground line; one per root | |
| plant | one page in `wiki/` | wiki page |
| seedling, budding, evergreen | how settled a plant is | maturity |
| root | a foundational subject; each root is its own plant, below the ground line | |
| branch | a subject that reaches out, above the ground, on the plant it shares most with | |
| harvest | a long article in `writing/` | output |
| field notes | the summary of current work | |
| tending | reading new compost and updating plants | ingest |
| weeding | checking the garden's health | lint |
| herbarium | the list view: every plant, sorted by subject | index |

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

- `subjects` decide where a plant grows: around a root below the ground line,
  or around a branch above it. Which subjects are roots is set in
  `content/subjects.md`.
- `stage`: `seedling` for a raw thought, `budding` once it has been worked on,
  `evergreen` when it is settled. Plants grow with their stage and with the
  number of `sources`.
- `tended` is the last day the page changed.

## Tending (ingest)

When asked to tend the garden (or to ingest):

1. Read the files in `raw/` that are not yet listed in any page's `sources`.
2. For each, either tend existing pages (update the text, add the source,
   update `tended`, raise the `stage` if the idea has matured) or plant new
   pages (`stage: seedling`).
3. Keep the person's wording where possible. Do not invent facts, names or
   numbers that are not in the raw material.
4. Add a line to `wiki/_log.md`.

## Weeding (health check)

When asked to weed the garden (or to check it): list pages with no sources, pages that
contradict each other, subjects with a single page, and pages not tended for
three months. Report; change nothing without being asked.
