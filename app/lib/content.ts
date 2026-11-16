import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

// Plain-text content lives in /content. Each file starts with a small header:
//
//   ---
//   title: Something
//   subjects: art, memory
//   ---
//
// Files marked `draft: true` only show up in `npm run dev`.

const ROOT = path.join(process.cwd(), "content");
const BASE = process.env.PAGES_BASE_PATH || "";
const SHOW_DRAFTS = process.env.NODE_ENV === "development" || process.env.SHOW_DRAFTS === "1";

export type Entry = { slug: string; meta: Record<string, string>; body: string };

export function readEntries(dir: string): Entry[] {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".md") && f.toLowerCase() !== "readme.md")
    .sort()
    .map((file) => {
      const raw = fs.readFileSync(path.join(full, file), "utf8");
      const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
      const meta: Record<string, string> = {};
      if (match) {
        for (const line of match[1].split(/\r?\n/)) {
          const i = line.indexOf(":");
          if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
        }
      }
      return { slug: file.replace(/\.md$/, ""), meta, body: (match ? match[2] : raw).trim() };
    })
    .filter((e) => SHOW_DRAFTS || e.meta.draft !== "true");
}

export function list(value: string | undefined): string[] {
  return (value || "")
    .replace(/^\[|\]$/g, "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

// Site-relative paths ("/fragments/x.jpg") need the GitHub Pages prefix.
export function asset(src: string): string {
  return src.startsWith("/") ? BASE + src : src;
}

export function toHtml(markdown: string): string {
  const html = marked.parse(markdown, { async: false }) as string;
  return html.replace(/(src|href)="\/(?!\/)/g, `$1="${BASE}/`);
}

export function toInlineHtml(markdown: string): string {
  return marked.parseInline(markdown, { async: false }) as string;
}
