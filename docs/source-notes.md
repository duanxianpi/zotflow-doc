---
sidebar_position: 5
description: "Source Notes are template-generated Markdown pages for each Zotero item, collecting metadata, annotations and child notes in Obsidian."
---

# Source Notes

Source Notes are ZotFlow's core mechanism: each Zotero item automatically generates a structured Markdown file, serving as a stable, addressable "source-of-fact layer" in your knowledge graph.

---

## Quick Understanding

1. A Source Note is the item's **hub page** — metadata, annotation excerpts, and child notes are template-driven and auto-refresh as the item changes
2. Content inside it has three owners: the **template** regenerates its skeleton on every update; **Zotero-synced regions** (Item Notes, annotation comments) are editable and flow back on sync; **persist regions** and custom frontmatter fields are **yours alone** — local-only and preserved verbatim. See the [ownership model](concepts.md#-distill--content-ownership-inside-a-source-note) for the full picture
3. The page opens locked (`zotflow-locked: true`) so template-owned content can't be edited by accident — everything that is yours stays editable, and nothing you own is ever lost to a re-render

---

## Rendering Pipeline

### Library Source Note (Zotero Items)

The full pipeline when creating or updating a Source Note:

1. **Path template** renders, determining file placement
2. ZotFlow reads your content template (or uses the built-in default)
3. Item metadata, child notes, attachments, and annotations are collected from local IndexedDB
4. LiquidJS renders the template, producing the Markdown body
5. **Frontmatter merge**: If the target file already exists, the annotated merge strategy executes: fields you added directly in the note are untouched; template fields with the `??` prefix only fill when absent from the note; template fields without `??` always overwrite
6. **Mandatory field injection** (these always overwrite the template):
   - `zotflow-locked: true`
   - `library-id` — Zotero library identifier
   - `zotero-key` — links to the Zotero item
   - `item-version` — used for update detection; triggers re-render only on version change
7. File written to disk

### Local Source Note (Vault Files)

Same pipeline, but with different context variables and mandatory fields:

- `zotflow-locked: true`
- `zotflow-local-attachment: [[path/to/file.pdf]]`

Annotation data for local files is stored in a co-located `.zf.json` sidecar (e.g., `Papers/paper.pdf` → `Papers/paper.zf.json`), not inside the Source Note.

Local Source Notes support editable regions too: **annotation comment regions** (edits are written back to the `.zf.json` sidecar, and an open local reader picks them up automatically) and **persist regions** (local-only, survive every re-render — see below). Zotero note regions don't apply, since local files have no Zotero children.

---

## User-Editable Scope

The template owns the page's skeleton — but every other kind of content is yours to edit: frontmatter (always free), Zotero-synced regions (Item Notes and annotation comments), and local-only persist regions.

### Frontmatter (Always Editable)

Frontmatter has two editing sources:

- **Fields defined in the template**: Declared in the template's `---` block
- **Fields you add directly in the note**: Manually written into the `.md` file's frontmatter

#### Fields You Add Directly in the Note

ZotFlow **never modifies them**. They are preserved as-is across re-renders and do not participate in any merge logic.

#### Fields Defined in the Template

On re-render, they are merged according to prefix rules:

| Prefix                                | Behavior                                                                                                   |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **`??` prefix** (e.g., `??rating`)    | If the field **does not exist** in the note → fill with template value. If **already exists** → keep the note's value |
| **No `??` prefix**                    | Always overwrite the note with template content                                                            |

Mandatory fields (`zotflow-locked`, `library-id`, `zotero-key`, `item-version`, and `zotflow-local-attachment` for local notes) are always re-injected, unaffected by the above rules.

#### Typical Usage

- Write `??rating: 0` in the template → on first generation the note gets `rating: 0`; later you change it to 5 in the note → re-render preserves your 5
- Write `tags:` in the template → overwritten on every re-render, ensuring tags stay in sync with Zotero
- Write `myNotes: "..."` directly in the note → ZotFlow never touches it

### Editable Regions: Three Kinds

In the body, three region types are wrapped by hidden HTML comment markers and treated as editable:

| Region Type            | Marker                                                            | Default content                                                |
| ---------------------- | ----------------------------------------------------------------- | -------------------------------------------------------------- |
| **Zotero child note**  | `<!-- ZF_NOTE_BEG_<key> -->` … `<!-- ZF_NOTE_END_<key> -->`       | The Markdown rendering of a Zotero note item                   |
| **Annotation comment** | `<!-- ZF_ANNO_BEG_<key> -->` … `<!-- ZF_ANNO_END_<key> -->`       | The comment text you attached to an annotation                 |
| **Persist region**     | `<!-- ZF_PERSIST_BEG_<id> -->` … `<!-- ZF_PERSIST_END_<id> -->`   | Whatever the template puts there — then yours, local-only      |

In **Source / Live Preview** mode, each region displays a 🔒 lock icon at the start of the BEG marker line. Click to unlock — the region content becomes editable.

On save (debounced ~2s):

- **Note region** → Markdown is converted back to Zotero HTML, updating the corresponding note record in IndexedDB. If the region contains a `<!-- ZF_NOTE_META … -->` line, wrapper attributes are reconstructed on write-back
- **Annotation comment region** → Leading `> ` prefix is stripped, Markdown is converted to Zotero comment HTML (only `<b>`, `<i>`, `<sub>`, `<sup>` are supported), updating the corresponding annotation comment in IndexedDB

The next bidirectional sync pushes the changes to Zotero.

### Persist Regions (Local-Only Content)

A **persist region** belongs to *you*, not to Zotero: whatever you write inside it survives every source-note re-render, and it is **never synced to Zotero**. The classic use case is a personal summary or reading notes directly in the source note, without creating an item note.

Declare one in your template with a stable id of your choosing — either as a raw comment pair or via `wrap_editable: "PERSIST", "your-id"` (see [Template Filters](template-filters.md#wrap_editable) for syntax and id rules):

```markdown
## My Summary
<!-- ZF_PERSIST_BEG_summary -->

<!-- ZF_PERSIST_END_summary -->
```

On every note update, ZotFlow extracts your persist content before re-rendering and splices it back between the matching markers afterwards. Marker problems (missing id, duplicate ids, unmatched or nested markers) make the note **refuse to update** with an error pointing at the offending line — nothing is ever overwritten on a parse failure.

**Orphans:** if a region id is later removed or renamed in the template, its content is *not* deleted — it moves to a sentinel-bounded **"Orphaned persist regions"** section at the bottom of the note (`<!-- ZF_PERSIST_ORPHAN_BEG -->` … `<!-- ZF_PERSIST_ORPHAN_END -->`), and you get a one-time warning notice. Cleanup is up to you:

- **Delete one region's content** — unlock it and clear the text; an emptied region disappears on the next update.
- **Edit or remove orphaned content** — set `zotflow-locked: false` in the frontmatter (restore it afterwards), or use any external tool: the sentinel markers make the section easy to target with a script, and editor locking does not apply outside Obsidian.

In the editor, persist regions show a frame in a **muted orange** to distinguish them from the accent-colored synced regions.

> ⚠️ Persist content lives in the note file. If **auto-purge of trashed source notes** is enabled and the Zotero item is moved to the trash, the whole file — persist regions included — goes to the system trash with it.

> ⚠️ **The structure outside markers, annotation excerpts, headings, and generated scaffolding — these remain locked. Only the interior of the markers (and frontmatter) is your editable range.** Note and annotation regions are generated by the `wrap_editable` filter in templates (see [Template Filters](template-filters.md#wrap_editable)); persist regions may also be written as raw comment pairs.

### Editable Region Settings

- **Default Editable Region Locked** (Settings → ZotFlow → General) — Whether new regions start locked. Per-region toggles override this default (valid for the current session)
- **Hide Editable Region Markers** — Hides the `ZF_*_BEG` / `ZF_*_END` marker lines
- Read Only library → unlock icon unavailable for note and annotation regions; **persist regions stay editable** (their content never leaves your vault)
- Editable regions are only available in **Source** and **Live Preview** modes. Reading View is entirely read-only

---

## Auto-Update Behavior

### Library Source Note

#### Sync-Triggered Updates

1. Sync pulls changed items from Zotero
2. Each item that has an existing Source Note and has changed schedules a debounced (~2s) re-render
3. Updates are **version-aware**: if the file's `item-version` frontmatter matches the current item version, no re-render is triggered

#### Annotation-Triggered Updates

When you add, edit, or delete an annotation in the reader, the Source Note auto-updates — also ~2s debounce. These updates are **forced**, bypassing the version check. Tag-only edits (via the tag editing modal) also trigger re-renders, since the annotation change detector now compares tag signatures.

#### Manual Trigger

In addition to automatic updates, you can force a re-render at any time:

- **Tree View**: Right-click an item → **Open source note** (forces an update of that item's Source Note)
- **Command palette**: `ZotFlow: Sync Source Notes` batch-syncs all Source Notes

### Local Source Note

Local file Source Notes auto-update on reader annotation add/edit/delete, debounced ~2s.

---

## Recommended Usage

Pick where to write by two questions — *is it about this one source?* and *should Zotero see it?*

| | Should sync to Zotero | Stays in your vault |
| --- | --- | --- |
| **About this one source** | **Item Note** — annotation extensions, paraphrases, summaries you want on every device Zotero reaches | **Persist region** — private reading notes, verdicts, workflow scratch, right inside the source's page |
| **Across sources** | — | **Standalone Obsidian note** — surveys, comparisons, arguments; wikilink back to Source Notes |

Supporting habits:

1. Let the template-owned part hold **source facts** — bibliographic info, abstracts, annotation excerpts. Never write prose there: re-renders regenerate it.
2. For structured per-item metadata (ratings, reading status), use **custom frontmatter fields** — add them directly in the note (never touched), or preset overridable defaults in the template with the `??` prefix (e.g., `??rating: 0`, `??status: unread`).
3. Declare persist regions in your template wherever you routinely want a personal section (e.g., a `## My Summary` block) — one template edit gives every source note a durable home for your words.

---

## FAQ

### My edited content reverted

You wrote in a template-owned area — those are regenerated on every re-render. Three durable homes exist for your content, by design:

- **Persist regions** — local-only blocks declared in your template; ideal for free-form notes inside the source's page ([details](#persist-regions-local-only-content))
- **Synced regions** — Item Note / annotation comment edits are written to IndexedDB and flow back to Zotero
- **Custom frontmatter fields** — never touched by ZotFlow

See the [ownership model](concepts.md#-distill--content-ownership-inside-a-source-note) for the full decision guide.

### Lock icon not clickable

Most common with Read Only libraries or insufficient API Key permissions.

### Source Note not auto-updating

- Confirm sync executed successfully
- Confirm the item's `item-version` actually changed (annotation-triggered updates are exempt from this limitation and always force)
- Check whether the Source Note file was externally modified, causing frontmatter anomalies

---

## Related Pages

- [Item Note](item-notes.md)
- [Template Guide](template-guide.md)
- [Reader & Annotations](reading-and-annotating.md)
- [Working Model Overview](concepts.md)
