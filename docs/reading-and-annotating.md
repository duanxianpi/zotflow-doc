---
sidebar_position: 4
---

# Reader & Annotations

ZotFlow has a built-in reader — using the same PDF/EPUB/HTML rendering engine as Zotero, with Obsidian-matched theming. You can read and annotate literature without ever leaving Obsidian.

---

## Opening Attachments

### Method 1: Tree View

1. Open **Zotero Tree View** (command palette → `ZotFlow: Open Zotero Tree View`)
2. Expand Library → Collection → Item
3. **Double-click** an attachment (PDF, EPUB, or HTML) to open it in the reader

If the attachment is already open in another tab, ZotFlow activates the existing tab instead of opening a duplicate.

### Method 2: Search Modal

1. Click the left ribbon icon, or run `ZotFlow: Search Zotero Library` from the command palette
2. Type keywords to search your library
3. Navigate with arrow keys, press **Enter** on an attachment result to open it

### Method 3: Protocol URI

You can jump to an attachment or Source Note from external links or within notes via URI:

```
obsidian://zotflow?type=open-attachment&libraryID=<id>&key=<key>
obsidian://zotflow?type=open-note&libraryID=<id>&key=<key>
```

Add `&navigation=<json>` to jump to a specific page or annotation.

---

## Annotation Types

The reader supports the following annotation types:

| Type          | Description                                                  |
| ------------- | ------------------------------------------------------------ |
| **Highlight** | Select text, apply a colored highlight                       |
| **Underline** | Select text, apply a colored underline                       |
| **Note**      | Place a sticky note anywhere on the page                     |
| **Image**     | Rectangular selection to capture a page region as an image   |
| **Ink**       | Freehand drawing/writing                                     |
| **Eraser**    | Erase parts of ink annotations                               |

Each annotation can have:

- **Color** (reader palette)
- **Comment** (note text attached to a highlighted passage)
- **Tags** (inherited from Zotero)

---

## Library Reader vs Local Reader

### Library Reader (Zotero Attachments)

- Opens attachments synced from your Zotero library
- Annotations are written back to Zotero during bidirectional sync

### Local Reader (Vault Files)

- Opens PDF/EPUB/HTML files in your vault (non-Zotero sources)
- Annotations are stored in a co-located `.zf.json` sidecar file — never sent to Zotero
- Enable via: **Settings → ZotFlow → General → Overwrite PDF/EPUB/HTML Viewer** → On → **Restart Obsidian**
- Once enabled, all PDF/EPUB/HTML files in your vault automatically open with the ZotFlow reader

| Action                              | Library File                                                 | Local File                          |
| ----------------------------------- | ------------------------------------------------------------ | ----------------------------------- |
| Select annotation, press Ctrl+C     | Default format citation                                      | Embed link (`![[path#^id]]`)        |
| Select annotation, press Ctrl+Shift+C | Raw annotation text                                         | Raw annotation text                 |
| Right-click menu                    | All formats (embed, text, pandoc, footnote, wikilink, default) | Only embed + text                  |
| Tree View drag                      | Various citation formats supported                           | N/A (local files not in Tree View)  |

---

## Annotation Image Extraction

For **image** and **ink** type annotations, ZotFlow can automatically extract the visual content and save it as a PNG.

### Configuration

1. **Settings → ZotFlow → General**
2. Enable **Auto Import Annotation Images**
3. Set **Annotation Image Folder** (e.g., `Attachments/ZotFlow`)

### Behavior

- When a Source Note is created or updated, image/ink annotations are extracted from the PDF and saved as `<annotation-key>.png` in the specified directory
- The Source Note embeds:
  ```markdown
  > > ![[Attachments/ZotFlow/ANNOTATION_KEY.png]]
  ```
- You can also manually trigger extraction: right-click an item in Tree View → **Extract annotation images**

---

## Tree View Drag Behavior

Dragging from Tree View into an editor:

| Dragged object                  | Inserted content                                                                  |
| ------------------------------- | --------------------------------------------------------------------------------- |
| **Attachment** (PDF/EPUB/HTML)  | Markdown link: `[filename](obsidian://zotflow?type=open-attachment&...)`          |
| **Regular item**                | Citation (format depends on citation settings and modifier keys)                    |

Dragging a regular item also triggers Source Note creation/update, ensuring the citation target exists and is up to date.

---

## Tree View Right-Click Menu

| Right-click target               | Action                                   | Description                                              |
| --------------------------------- | ---------------------------------------- | -------------------------------------------------------- |
| **Collection or Library**         | Create source note for all child items   | Batch-create Source Notes for all items under this node   |
| **Collection or Library**         | Extract anno images for all child items  | Batch-extract annotation images                           |
| **Top-level item** (non-attachment) | Open source note                        | Open (and force-update) the item's Source Note            |
| **Top-level item** (non-attachment) | Extract annotation images               | Extract annotation images for this item                   |

---

## Common Edge Cases

### Attachment Won't Open

- Check whether the attachment is cached or downloadable (network + storage strategy)
- Check WebDAV / Zotero Storage configuration
- Confirm the attachment file actually exists in Zotero

### Annotation Changes but Zotero Doesn't Update

- The library must be in Bidirectional mode
- The API Key must have write permission
- Manually trigger a sync

### Local File Annotations Don't Sync to Zotero

- This is by design: Local Reader annotations are never written back to Zotero; they only live in `.zf.json`

### Same Attachment Opens Twice

- ZotFlow detects whether the attachment is already open in another tab and focuses the existing tab

---

## Related Pages

- [Source Note](source-notes.md)
- [Citation & Writing Flow](citation-guide.md)
- [Working Model Overview](concepts.md)
