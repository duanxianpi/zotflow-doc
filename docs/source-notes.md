---
sidebar_position: 5
---

# Source Notes

Source Notes are ZotFlow's core mechanism: each Zotero item automatically generates a structured Markdown file, serving as a stable, addressable "source-of-fact layer" in your knowledge graph.

---

## Quick Understanding

1. A Source Note is a system-maintained **reference page** — metadata, annotation excerpts, and child notes are template-driven and auto-refresh as the item changes
2. You can edit Item Notes and annotation comments inside a Source Note (via editable regions). Source Notes lean toward **reference and indexing**: per-paper annotations and excerpts go in Source Notes and their Item Notes; cross-paper synthesis belongs in standalone notes that link back to Source Notes
3. Default `zotflow-locked: true` — in Reading View the entire page is read-only, with exceptions for frontmatter and editable regions. Any illicit modification outside these is overwritten on the next re-render

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

---

## User-Editable Scope

The Source Note is read-only as a whole by default, but two kinds of embedded content are explicitly designed to be editable within Obsidian, and frontmatter is always free.

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

### Zotero Note Editable Regions & Annotation Comment Editable Regions

In the body, two region types are wrapped by hidden HTML comment markers and treated as editable:

| Region Type            | Marker                                                      | Default content                                                |
| ---------------------- | ----------------------------------------------------------- | -------------------------------------------------------------- |
| **Zotero child note**  | `<!-- ZF_NOTE_BEG_<key> -->` … `<!-- ZF_NOTE_END_<key> -->` | The Markdown rendering of a Zotero note item                   |
| **Annotation comment** | `<!-- ZF_ANNO_BEG_<key> -->` … `<!-- ZF_ANNO_END_<key> -->` | The comment text you attached to an annotation                 |

In **Source / Live Preview** mode, each region displays a 🔒 lock icon at the start of the BEG marker line. Click to unlock — the region content becomes editable.

On save (debounced ~2s):

- **Note region** → Markdown is converted back to Zotero HTML, updating the corresponding note record in IndexedDB. If the region contains a `<!-- ZF_NOTE_META … -->` line, wrapper attributes are reconstructed on write-back
- **Annotation comment region** → Leading `> ` prefix is stripped, Markdown is converted to Zotero comment HTML (only `<b>`, `<i>`, `<sub>`, `<sup>` are supported), updating the corresponding annotation comment in IndexedDB

The next bidirectional sync pushes the changes to Zotero.

> ⚠️ **The structure between markers, annotation excerpts, headings, and generated scaffolding — these remain locked. Only the interior of the markers (and frontmatter) is your editable range.** Editable regions are generated by the `wrap_editable` filter in templates (see [Template System](template-guide.md#wrap_editable)). Currently only Note Region and Annotation Comment Region types are supported. Users cannot manually create other types of editable regions.

### Editable Region Settings

- **Default Editable Region Locked** (Settings → ZotFlow → General) — Whether new regions start locked. Per-region toggles override this default (valid for the current session)
- **Hide Editable Region Markers** — Hides the `ZF_*_BEG` / `ZF_*_END` marker lines
- Read Only library → unlock icon unavailable, regions are non-editable
- Editable regions are only available in **Source** and **Live Preview** modes. Reading View is entirely read-only

---

## Auto-Update Behavior

### Library Source Note

#### Sync-Triggered Updates

1. Sync pulls changed items from Zotero
2. Each item that has an existing Source Note and has changed schedules a debounced (~2s) re-render
3. Updates are **version-aware**: if the file's `item-version` frontmatter matches the current item version, no re-render is triggered

#### Annotation-Triggered Updates

When you add, edit, or delete an annotation in the reader, the Source Note auto-updates — also ~2s debounce. These updates are **forced**, bypassing the version check.

#### Manual Trigger

In addition to automatic updates, you can force a re-render at any time:

- **Tree View**: Right-click an item → **Open source note** (forces an update of that item's Source Note)
- **Command palette**: `ZotFlow: Sync Source Notes` batch-syncs all Source Notes

### Local Source Note

Local file Source Notes auto-update on reader annotation add/edit/delete, debounced ~2s.

---

## Recommended Usage

1. Let it hold **source facts**: bibliographic info, abstracts, annotation excerpts, child notes
2. Your understanding **of this specific paper** — annotation extensions, paraphrases, summaries — goes in **Item Notes** (editable, synced back to Zotero, embedded in the Source Note). Insights about **relationships between papers**, topic surveys, cross-paper arguments — go in **standalone Obsidian notes**, linked to Source Notes via wikilinks. This way: Source Note re-renders don't affect your notes; per-paper thinking travels with the paper; cross-paper synthesis is independently organized
3. Don't put long-form content in template-rendered areas (non-editable-region parts) — re-renders will discard them. Long-lived content should go in editable regions, or as custom frontmatter fields added directly in the note (ZotFlow never modifies these)
4. When you want preset default values in the template that users can override, use the `??` prefix (e.g., `??rating: 0`, `??status: unread`) — written on first generation, then freely editable in the note

---

## FAQ

### My edited content reverted

You edited a template-driven area. Those areas get overwritten by template output on re-render. Put long-lived content in frontmatter fields you add directly (ZotFlow won't touch them), or make sure you're editing inside an editable region (note region and annotation comment region edits are written back to IndexedDB and preserved across re-renders).

### Lock icon not clickable

Most common with Read Only libraries or insufficient API Key permissions.

### Source Note not auto-updating

- Confirm sync executed successfully
- Confirm the item's `item-version` actually changed (annotation-triggered updates are exempt from this limitation and always force)
- Check whether the Source Note file was externally modified, causing frontmatter anomalies

---

## Related Pages

- [Item Note](item-notes.md)
- [Template System](template-guide.md)
- [Reader & Annotations](reading-and-annotating.md)
- [Working Model Overview](concepts.md)
