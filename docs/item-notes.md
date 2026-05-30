---
sidebar_position: 6
---

# Item Note: Zotero Child Notes

An Item Note is a child note item under a Zotero entry — Zotero's native note object. ZotFlow treats it as a first-class editable object: you can **create, edit, and delete** entirely within Obsidian, with changes written back to Zotero on the next bidirectional sync.

## Distinction from Source Note (Avoiding Confusion)

Important clarification: the word "note" refers to two completely different concepts in ZotFlow:

| Concept                                     | What it is                                                     | Storage                                        |
| ------------------------------------------- | -------------------------------------------------------------- | ---------------------------------------------- |
| **Source Note** (Obsidian)                  | Auto-generated Markdown file from a template, one per Zotero item | `.md` file in your vault                       |
| **Item Note** (Zotero, the subject of this page) | Zotero native child note item, attached to a parent entry      | IndexedDB → pushed to Zotero via bidirectional sync |

This page covers only **Item Notes**. For Source Notes, see [Source Note](source-notes.md).

---

## Where Item Notes Appear

In the **Zotero Tree View**, child notes appear as `📝` leaf nodes under their parent item:

```
📚 My Library
└── 📄 Smith et al. (2024) — Distributed Tracing
    ├── 📎 smith2024.pdf
    ├── 📝 Open questions
    └── 📝 Summary
```

Inside the **Source Note** body, each child note is rendered by default within its own editable region, wrapped by `<!-- ZF_NOTE_BEG_<key> -->` / `<!-- ZF_NOTE_END_<key> -->` markers (see [Editable Regions](source-notes.md#zotero-note-editable-regions--annotation-comment-editable-regions)).

---

## Creating an Item Note

In **Zotero Tree View**:

1. **Right-click** a parent item (any item that is not a standalone attachment)
2. Select **Create child note**
3. ZotFlow will:
   - Create an empty note in IndexedDB with `syncStatus: "created"`
   - Refresh the Tree View — a new `📝` node appears
   - Open the Note Editor in a **new tab**, ready for input

> At this point the note's key is temporary. On the next bidirectional sync, Zotero assigns the real key, and ZotFlow automatically updates the local record. Until then, the note is fully functional locally.

**Entry point hidden when:**

- The target is a standalone attachment (attachments without a parent cannot have children)
- The library mode is Read Only
- The API Key lacks notes write permission

---

## Editing an Item Note

There are two equivalent editing entry points. Both write to the same IndexedDB record and produce the same outgoing sync — choose by context.

### Method 1: Note Editor (Standalone Tab Editor)

Open via:

- **Double-click** a `📝` node in Tree View, or
- Right-click → **Open note** (appears in applicable contexts), or
- URI: `obsidian://zotflow?type=open-note&libraryID=<id>&key=<key>`

The editor is Obsidian's standard embeddable Markdown editor — your shortcuts, snippets, CSS, and other plugin behaviors all work normally. On top of this, ZotFlow:

- **Loads** the note's Zotero HTML, converts to Markdown, and renders
- **Strips** the internal `<!-- ZF_NOTE_META … -->` round-trip comment — you never see or edit it
- **Auto-saves** (~2s debounce), with no "Save" button
- **Updates the tab title** from the note's first line automatically
- **Refreshes the parent item's Source Note** (debounced), so the embedded region reflects your edits
- **For Read Only libraries**, the tab title shows `(READ ONLY)` and the editor loads but is locked

### Method 2: Source Note Inline Editing

Open the **parent item's Source Note** (Source or Live Preview mode), scroll to the corresponding child note region, and click the 🔒 lock icon before the `ZF_NOTE_BEG_…` fence. The region unlocks and you can edit in place. After a ~2s debounce, ZotFlow converts the Markdown back to Zotero HTML and updates IndexedDB. The Note Editor (if open) refreshes in sync; the Source Note itself does not re-render, to avoid overwriting what you just typed.

> ⚠️ **Editing the same note from both entry points simultaneously carries an overwrite risk.** Both write to the same IDB record. If the Note Editor and Source Note are both open and both receive input within the debounce window, the last writer wins.

---

## Deleting an Item Note

In **Zotero Tree View**:

1. **Right-click** a `📝` note node
2. Select **Delete note**

ZotFlow marks the note as deleted in IndexedDB, refreshes the Tree View, and shows a `Note deleted.` notification. The deletion is pushed to Zotero on the next bidirectional sync. If the note was never synced (`syncStatus: "created"`), it's removed locally immediately.

> There is no undo. If you delete by mistake, recreate the note with the same content before the next sync, or restore from the Zotero side.

---

## Sync Behavior

Item Note create/edit/delete operations are captured locally first and reconciled with Zotero on the next bidirectional sync:

| Local operation | `syncStatus` | Behavior on next bidirectional sync                  |
| --------------- | ------------ | ---------------------------------------------------- |
| Create          | `"created"`  | Push new note item to Zotero, receive the real key   |
| Edit            | `"updated"`  | Push new HTML content to Zotero                      |
| Delete          | `"deleted"`  | Delete the note item from Zotero                     |

Item Notes follow the same **field-level conflict resolution** as regular items: if the same note is edited on both Zotero and ZotFlow between syncs, the diff viewer lets you choose which side wins.

---

## Markdown ↔ Zotero HTML Conversion

Zotero stores notes in ProseMirror HTML format. ZotFlow converts on both read and write:

- **Open/Display** — IDB HTML → Markdown (`html2md` pipeline)
- **Save** — Markdown → HTML (`md2html` pipeline)

The conversion is **round-trip safe** for Zotero-supported features: rich text, headings, lists, tables, images, math formulas, code blocks, blockquotes, links, and citations.

An internal `<!-- ZF_NOTE_META … -->` comment is preserved to maintain Zotero wrapper div attributes (schema version, etc.) across round-trips. The Note Editor strips it on display and re-injects it on save — you never need to care about it.

---

## Permission Quick Reference

| Condition                                              | Behavior                                                               |
| ------------------------------------------------------ | ---------------------------------------------------------------------- |
| Library mode = **Bidirectional**, Key has notes write  | Full create/edit/delete. Changes pushed on next sync                    |
| Library mode = **Read Only**                           | Create and delete entries hidden in Tree; editor loads in read-only mode |
| API Key lacks notes write                              | Notes for items in that library are not synced and not visible in Tree View |
| Library mode = **Ignored**                             | Library not synced; notes not visible in Tree View                      |

---

## Related Pages

- [Source Note](source-notes.md)
- [Reader & Annotations](reading-and-annotating.md)
- [Citation & Writing Flow](citation-guide.md)
- [Working Model Overview](concepts.md)
