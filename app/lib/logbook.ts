import fs from "node:fs";
import path from "node:path";
import { readEntries, toHtml, toInlineHtml } from "./content";

// Logbook entries: content/log/*.md, newest first.
export function getLog() {
  return readEntries("log")
    .map((e) => ({ id: e.slug, date: e.meta.date || e.slug.slice(0, 10), html: toInlineHtml(e.body.replace(/\s*\n\s*/g, " ")) }))
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
}

// People who inspire: content/people.md, a Markdown list.
export function getPeople() {
  const file = path.join(process.cwd(), "content", "people.md");
  if (!fs.existsSync(file)) return { title: "People who inspire me", html: "" };
  const raw = fs.readFileSync(file, "utf8");
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  const title = m?.[1].match(/title:\s*(.+)/)?.[1].trim() || "People who inspire me";
  return { title, html: toHtml(m ? m[2] : raw) };
}
