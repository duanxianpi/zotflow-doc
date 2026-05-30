---
sidebar_position: 3
---

# Working Model Overview

## Core Design Principles

### 1. Stay in the Flow

ZotFlow's fundamental goal is to eliminate tool switching. Reading, annotating, citing, and note-taking — these actions naturally belong in the same tool, under the same keyboard shortcuts, within the same theme. Every ZotFlow feature is designed to reduce your reasons to leave Obsidian.

### 2. Zotero is the Source of Truth (Mostly)

Your Zotero library is the canonical store for bibliographic metadata. ZotFlow's role is:

- **Pull**: Fetch metadata, items, collections, and annotations from the Zotero Web API into a local IndexedDB cache
- **Push**: Write your Obsidian-side changes back to Zotero

> **What data gets written back?** Currently, only **annotations** (add/edit/delete) and **Item Notes** (create/edit/delete child notes) are pushed back to Zotero. Changes to tags, frontmatter, and item metadata (title, creators, etc.) are **not** pushed back to Zotero. Source Note frontmatter custom fields are local-only and invisible to Zotero.

Each accessible Zotero library has an independently configured sync mode:

| Mode              | Behavior                                                                 |
| ----------------- | ------------------------------------------------------------------------ |
| **Bidirectional** | Pull + push. Requires an API Key with write permission                   |
| **Read Only**     | Pull only. Local annotations stay local and never reach Zotero           |
| **Ignored**       | Completely skipped during sync                                           |

When the same field is modified on both sides between syncs, ZotFlow provides a **field-level diff viewer** that lets you choose which side wins on a per-field basis, rather than blunt whole-item overwrites.

### 3. Source Note: One per Item, Auto-Generated, Locked by Default

Each Zotero item gets one auto-rendered Markdown file in your vault — this is the heart of ZotFlow's note model:

- **One source, one note.** Stable, addressable atomic nodes in your knowledge graph.
- **Auto-generated from a template.** You define a LiquidJS template; ZotFlow fills in metadata, child notes, attachments, and annotations.
- **Locked by default.** In Reading View, the entire page is read-only, with exceptions for frontmatter and editable regions. Any illicit modification is overwritten on the next re-render.

Source Notes are generated or updated under these conditions:

| Trigger                          | Behavior                                                                                                         |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **After first sync**             | Source Notes are auto-created after sync completes (can be disabled in settings)                                  |
| **Sync detects item changes**    | Source Note is auto-re-rendered (can be disabled in settings)                                                     |
| **Annotation changes**           | After adding/editing/deleting annotations in the reader, Source Note auto-re-renders (debounced ~2s, bypasses version check) |
| **Item Note changes**            | After editing an Item Note, the parent item's Source Note refreshes to reflect the updated embedded note region    |
| **Manual trigger**               | Tree View right-click item → Open source note (forces update), or batch create command                            |

#### Child Notes & Annotation Comments: Exceptions to the Rule

Zotero **child notes** (native note items attached to bibliographic entries) are the most important exception to the "locked" rule. ZotFlow treats child notes as **first-class editable objects**, providing two equivalent editing entry points:

- **Editable region inside Source Note** — Each child note is rendered into the Source Note wrapped by `<!-- ZF_NOTE_BEG_<key> -->` / `<!-- ZF_NOTE_END_<key> -->` hidden comment markers. In Source / Live Preview mode, a 🔒 lock icon appears at the start of the region line; click to unlock and edit in place. Annotation comments work the same way (markers use `ZF_ANNO_*`).
- **Standalone Note Editor** — Double-click a `📝` node in Tree View (or right-click → Open note) to open a full embedded Markdown editor in a separate tab.

Both entry points write to the same IndexedDB record. See [Item Note](item-notes.md) for details.

#### Frontmatter: Another Exception

Source Note YAML frontmatter has two editable sources:

- **In the template**: You can define frontmatter fields in the template's `---` block
- **In the note**: After generation, you can also add fields directly to the `.md` file's frontmatter

For **fields you add directly in the note** (not defined in the template), ZotFlow never touches them — they are always preserved as-is.

For **frontmatter fields defined in the template**, the following merge rules apply on re-render:

| Field prefix                                   | Behavior                                                                                                |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **`??` prefix** (e.g., `??rating`, `??status`) | If the field **does not exist** in the note → fill with template value. If it **already exists** → keep the note's existing value, template does not overwrite |
| **No `??` prefix**                             | Always overwrite the note's value with the template content                                             |

Mandatory fields (`zotflow-locked`, `library-id`, `zotero-key`, `item-version`) are always re-injected regardless of the above rules.

See [Source Note Frontmatter Merge Strategy](source-notes.md#frontmatter-always-editable).

#### Recommended Note Division of Labor

Understanding the model above leads to a natural usage pattern:

- **Item Note** — Holds your understanding of **this specific piece of literature**: annotation extensions, paragraph paraphrases, key formula derivations, post-reading questions. Item Notes are editable, sync back to Zotero, and are naturally bound to their source when embedded in the Source Note.
- **Standalone Obsidian note** — Holds **cross-literature** synthesis: topic surveys, multi-paper comparisons, methodology discussions, research lineage mapping. Link to Source Notes via wikilinks — one note can connect many sources.

The benefit of this division: per-paper thinking is not lost when Source Notes re-render (Item Notes are stored in IndexedDB and synced back to Zotero), while cross-paper synthesis is not constrained by the structure of any single source.

### 4. Two Reader Modes

ZotFlow's built-in reader (using the same PDF/EPUB/HTML rendering engine as Zotero, but with Obsidian-matched theming) operates in two modes:

| Mode               | What it reads                   | Where annotations are stored                |
| ------------------ | ------------------------------- | ------------------------------------------- |
| **Library Reader** | Attachments synced from Zotero  | Zotero (written back via bidirectional sync) |
| **Local Reader**   | Local PDF/EPUB/HTML in vault    | Co-located `.zf.json` sidecar file          |

Local Reader must be manually enabled: Settings → ZotFlow → General → Overwrite PDF/EPUB/HTML Viewer. Once enabled, all PDF/EPUB/HTML files in your vault open with the ZotFlow reader. Local annotations never touch Zotero.

### 5. Template-First

ZotFlow is **template-first**. Almost all user-visible output is rendered by LiquidJS templates:

- Source Note file path
- Library Source Note body
- Local Source Note body
- Each citation format output (Pandoc, Wikilink, Footnote, Citekey)

If you're not happy with the default output, you don't need to file a feature request — just edit the template. See the [Template System](template-guide.md).

### 6. Offline-First

Every synced Zotero item, collection, and library is cached in local IndexedDB. After your first sync completes, you can browse, search, read, and edit annotations **with no network connection**. The network is only needed for:

- Syncing with the Zotero Web API
- Downloading attachments (from Zotero cloud storage or your WebDAV server)

Cached attachment files are managed with an LRU policy; the size limit is configurable in settings.

### 7. Two Main Interaction Panels

Most of your interaction with ZotFlow is concentrated on two panels:

- **Zotero Tree View** (sidebar) — Navigation panel. Browse the Library → Collection → Item → Attachment hierarchy; search and filter; drag items into the editor to insert citations; double-click attachments to open the reader.
- **Activity Center** (opened via ribbon icon) — Control panel. Trigger syncs, monitor task progress, view logs, test templates.

### 8. Privacy & Security by Default

- No telemetry, analytics, or third-party tracking
- Network requests are only sent to the Zotero API and your configured WebDAV server
- API Key and WebDAV password are stored in Obsidian's platform-native `SecretStorage` — they do **not** appear in your synced `data.json`

---

## Data Flow Overview

```
Zotero Cloud ──pull──→ IndexedDB (local cache) ──template render──→ Source Notes (.md) ←── contain Item Notes
     ↑                      ↑                                │
     │                      │                                │
     └──push── edits/anno changes ─┘                         │
                                                            │
                              Cross-paper synthesis ←──wikilink──┘
```

1. ZotFlow pulls items, collections, attachments, and annotations from the Zotero Web API into local IndexedDB
2. You read attachments, make annotations, and edit Item Notes within Obsidian
3. On the next bidirectional sync, changes are written back to Zotero
4. Source Notes auto-re-render based on item and annotation state changes (debounced ~2s)
5. Your independent thinking notes link to Source Notes via wikilinks

## Conflict Resolution Principles

When the same field is modified on both ends, ZotFlow's field-level diff viewer lets you choose which side to keep on a per-field basis — not wholesale overwrites, but field-level decisions.

Practices to reduce conflict probability:

1. Keep your primary editing side fixed — either Obsidian or Zotero
2. Sync before editing from a second device

## Why This Design

1. **Closed loop**: Reading, annotating, and writing happen in the same tool — zero context switching
2. **Stable references**: Source Notes ensure every source has an always-present "fact layer" node
3. **User control**: The template system puts output formatting in your hands, with no hardcoded workflows
4. **Offline-capable**: Local cache + LRU attachment management means no dependency on a persistent network connection

---

## Related Entry Points

- [Quick Start & Setup](getting-started.md)
- [Reader & Annotations](reading-and-annotating.md)
- [Source Note](source-notes.md)
- [Item Note](item-notes.md)
- [Citation & Writing Flow](citation-guide.md)
- [Template System](template-guide.md)
