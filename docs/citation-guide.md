---
sidebar_position: 7
---

# Citation & Writing Flow

ZotFlow lets you insert citations with controlled formatting at your writing point: drag from Tree View, type a trigger character in the editor, or copy from the reader — three paths, five formats, with annotation context available to templates.

Citations are rendered by LiquidJS templates (see the [Template System](template-guide.md#3-citation-templates) for variable reference).

---

## Citation Formats

Four citation formats, each with a customizable LiquidJS template:

| Format         | Example output                          | Description                                                                               |
| -------------- | ---------------------------------------- | ----------------------------------------------------------------------------------------- |
| **Pandoc**     | `[@smith2024, pp. 3, 7]`                | Pandoc-style citation key + brackets. Annotation page numbers automatically appended       |
| **Footnote**   | `[^smith2024]` + definition at doc end   | Markdown footnote. Inline reference marker inserted; definition text appended to document end |
| **Wikilink**   | `[[Source/@smith2024\|Smith (2024)]]`     | Obsidian wikilink pointing to Source Note. With annotations, points to specific annotation block |
| **Citekey**    | `@smith2024`                              | Bare citation key — no template processing, direct output                                  |

If a citation key (e.g., from Better BibTeX) is not set, falls back to the Zotero item key.

---

## Four Insertion Methods

### 1. Tree View Drag

1. Open the **Zotero Tree View** sidebar
2. Drag any non-note item (article, book, etc.) into the editor
3. ZotFlow inserts a citation in your default format at the drop position

Hold modifier keys while dragging to temporarily switch formats (see [Modifier Keys](#modifier-keys-override-default-format) below).

> Dragging an **attachment** (PDF/EPUB) inserts a link to open the attachment, not a citation.

### 2. Citation Suggest (Trigger Character)

1. Type the trigger character in the editor (default `@@`)
2. A search popup appears — type keywords to filter your Zotero library
3. Select an item, press **Enter** to insert the citation

The trigger character is configurable in **Settings → Citation → Trigger Character**.

### 3. Reader Copy

With an annotation selected in the reader:

| Shortcut                                        | Behavior                                       |
| ----------------------------------------------- | ---------------------------------------------- |
| **Ctrl+C** (macOS: **Cmd+C**)                   | Copy citation in default format to clipboard   |
| **Ctrl+Shift+C** (macOS: **Cmd+Shift+C**)       | Copy raw annotation text to clipboard          |

Paste into any editor or external application.

### 4. Reader Right-Click Menu

Right-click a selected annotation in the reader to see citation options:

- **Copy Embed** — `![[Source/@smith2024#^annotationId]]` (block embed pointing to the annotation in the Source Note)
- **Copy Annotation Text** — Raw highlighted text
- **Copy Default Citation** — Uses the default citation format
- **Copy Pandoc Citation**
- **Copy Footnote Citation**
- **Copy Wikilink Citation**

---

## Modifier Keys Override Default Format

Hold modifier keys while dragging (or dropping) to temporarily override the default citation format:

| Modifier Key                        | Format                        |
| ----------------------------------- | ----------------------------- |
| _(none)_                            | Default format (set in Settings) |
| **Shift**                           | Wikilink                      |
| **Alt**                             | Pandoc                        |
| **Ctrl** / **Cmd**                  | Footnote                      |
| **Ctrl+Shift** / **Cmd+Shift**      | Citekey (bare key)            |

---

## How Annotation Context Enters Citations

When you copy a citation from the reader with an annotation selected, the template context includes an `annotations` array. Templates can use this data to concatenate page numbers, generate links to annotation blocks, output multiple annotations per format, etc.

### Multi-Annotation Behavior

When multiple annotations are selected and copied, the default templates handle them as follows:

- **Pandoc**: Deduplicated and concatenated page numbers → `[@smith2024, pp. 3, 7, 12]`
- **Wikilink**: Generates a separate `[[note#^id|Author (year), p. X]]` per annotation, comma-separated
- **Footnote**: Default template does not use annotation data (but can be customized)

### Embed Format

The Embed format generates an Obsidian block-embed per annotation, pointing to the corresponding block ID in the Source Note:

```
![[Source/@smith2024#^annotationKey]]
```

Multiple annotations produce one line each.

> Embed requires the Source Note to exist and contain the corresponding annotation block ID (`^annotationKey`). ZotFlow's default template includes these block IDs automatically.

---

## Local File vs Library Item Citation Behavior

| Action                            | Library item            | Local file                        |
| --------------------------------- | ----------------------- | --------------------------------- |
| **Ctrl+C** copy annotation        | Default format citation | Embed link (`![[path#^id]]`)      |
| **Ctrl+Shift+C**                  | Annotation text         | Annotation text                   |
| Right-click menu                  | All formats             | Only Embed + Text                 |
| Tree View drag                    | Multiple citation formats | N/A                             |

Local files lack Zotero metadata (citation key, creators, etc.), so citation templates that depend on item data are unavailable. In this case, Ctrl+C copies an embed link pointing to the annotation in the local Source Note.

---

## Citation Settings

Configure under **Settings → Citation**:

| Setting                          | Description                                              | Default               |
| -------------------------------- | -------------------------------------------------------- | --------------------- |
| **Default Citation Format**      | Citation format when no modifier key is held              | `footnote`            |
| **Trigger Character**            | String that opens the citation suggest popup              | `@@`                  |
| **Pandoc Template**              | LiquidJS template for Pandoc citations                    | _(built-in fallback)_ |
| **Footnote Reference Template**  | Template for the inline `[^key]` part                     | _(built-in fallback)_ |
| **Footnote Definition Template** | Template for the footnote definition text                 | _(built-in fallback)_ |
| **Wikilink Template**            | Template for Wikilink citations                           | _(built-in fallback)_ |

Leaving a template field empty uses the built-in default. Default template source code is in the [Template System](template-guide.md#3-citation-templates).

---

## FAQ

### Wrong output format after insertion

- Check your **Default Citation Format** setting
- Check if you accidentally pressed a modifier key that overrides the default
- Check if the corresponding format template has been customized

### Page numbers not appearing

- Pandoc/Wikilink templates need `pageLabel` from the `annotations` array. Make sure an annotation was selected when copying
- Custom templates may not be consuming page information from `annotations`

### Wikilink doesn't jump to target

- The target item's Source Note may not exist yet. Create it manually first (Tree View right-click → Open source note) or drag the item to trigger auto-creation
- Confirm that the Source Note path template matches the actual file path

### Trigger character doesn't open popup

- Check if the **Trigger Character** setting has been changed
- Confirm the current editor type supports suggestion popups

---

## Related Pages

- [Template System](template-guide.md)
- [Reader & Annotations](reading-and-annotating.md)
- [Source Note](source-notes.md)
