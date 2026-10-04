---
sidebar_position: 11
description: "Reference of every variable available to ZotFlow templates, plus the built-in default templates."
---

# Template Variables & Defaults

Every template type exposes its own context variables. This page is the full reference — all variables for the four template types, plus the built-in default templates you can start from. For syntax and workflow, see the [Template Guide](template-guide.md); for filters, see [Template Filters](template-filters.md).

## 1. Zotero Source Note Template

Controls the body of Source Notes for Zotero library items. Context is `{ item, settings }`.

### `item` — Zotero Item

| Variable                     | Type                      | Description                                                             |
| ---------------------------- | ------------------------- | ----------------------------------------------------------------------- |
| `item.key`                   | `string`                  | Zotero item key                                                         |
| `item.version`               | `number`                  | Item version number, used for incremental update detection              |
| `item.libraryID`             | `number`                  | Library ID                                                              |
| `item.citationKey`           | `string`                  | Citation key (e.g., from Better BibTeX); empty string if not set        |
| `item.itemType`              | `string`                  | Item type (`"journalArticle"`, `"book"`, etc.)                          |
| `item.title`                 | `string`                  | Title                                                                   |
| `item.parentItem`            | `string`                  | Parent item key; empty string for top-level items                       |
| `item.creators`              | `Array<{ name: string }>` | Creator list, `name` is the combined full name                          |
| `item.date`                  | `string \| null`          | Publication date string (raw value from Zotero)                         |
| `item.year`                  | `string \| null`          | Four-digit year extracted from `item.date`, or null if not extractable  |
| `item.dateAdded`             | `string`                  | ISO timestamp when the item was added to Zotero                         |
| `item.dateModified`          | `string`                  | ISO timestamp of last modification                                      |
| `item.accessDate`            | `string \| null`          | Last access date                                                        |
| `item.abstractNote`          | `string \| undefined`     | Abstract                                                                |
| `item.publicationTitle`      | `string \| undefined`     | Journal / conference name                                               |
| `item.publisher`             | `string \| undefined`     | Publisher                                                               |
| `item.place`                 | `string \| undefined`     | Place of publication                                                    |
| `item.volume`                | `string \| undefined`     | Volume                                                                  |
| `item.issue`                 | `string \| undefined`     | Issue                                                                   |
| `item.pages`                 | `string \| undefined`     | Page range                                                              |
| `item.series`                | `string \| undefined`     | Series name                                                             |
| `item.seriesNumber`          | `string \| undefined`     | Series number                                                           |
| `item.edition`               | `string \| undefined`     | Edition                                                                 |
| `item.url`                   | `string \| undefined`     | URL                                                                     |
| `item.DOI`                   | `string \| undefined`     | DOI                                                                     |
| `item.ISBN`                  | `string \| undefined`     | ISBN                                                                    |
| `item.ISSN`                  | `string \| undefined`     | ISSN                                                                    |
| `item.tags`                  | `Array<{ tag, type? }>`   | Tag list                                                                |
| `item.itemPaths`             | `string[]`                | Collection path array for the item (e.g., `["Research/ML"]`)            |
| `item.attachments`           | `AttachmentContext[]`     | Child attachment list (PDFs, etc.)                                      |
| `item.annotations`           | `AnnotationContext[]`     | Annotations directly on the item (only for standalone attachment items) |
| `item.attachmentAnnotations` | `AnnotationContext[]`     | Flattened summary of all annotations across all attachments             |
| `item.notes`                 | `NoteContext[]`           | Zotero child note list                                                  |
| `item.relatedItems`          | `RelatedItemContext[]`    | Zotero "Related" item list                                              |

### `item.attachments[]` — Attachment Sub-Objects

| Variable                  | Type                    | Description                           |
| ------------------------- | ----------------------- | ------------------------------------- |
| `attachment.key`          | `string`                | Attachment item key                   |
| `attachment.libraryID`    | `number`                | Library ID                            |
| `attachment.parentItem`   | `string`                | Key of the parent top-level item      |
| `attachment.filename`     | `string`                | Filename (e.g., `"paper.pdf"`)        |
| `attachment.contentType`  | `string`                | MIME type (e.g., `"application/pdf"`) |
| `attachment.tags`         | `Array<{ tag, type? }>` | Tags                                  |
| `attachment.dateAdded`    | `string`                | ISO timestamp                         |
| `attachment.dateModified` | `string`                | ISO timestamp                         |
| `attachment.annotations`  | `AnnotationContext[]`   | Annotation list on this attachment    |

### `item.notes[]` — Child Notes

| Variable            | Type                    | Description                                |
| ------------------- | ----------------------- | ------------------------------------------ |
| `note.key`          | `string`                | Note item key                              |
| `note.libraryID`    | `number`                | Library ID                                 |
| `note.title`        | `string`                | Note title (first line, or empty)          |
| `note.parentItem`   | `string`                | Parent item key                            |
| `note.note`         | `string`                | Full note HTML (Zotero ProseMirror format) |
| `note.tags`         | `Array<{ tag, type? }>` | Tags                                       |
| `note.dateAdded`    | `string`                | ISO timestamp                              |
| `note.dateModified` | `string`                | ISO timestamp                              |

### `item.relatedItems[]` — Related Items

From Zotero's Related tab (`dc:relation`). Each entry corresponds to a relation URI. `key` and `libraryID` are always parsed from the URI; other fields are populated only when the related item exists in the local database.

| Variable          | Type                  | Description                                                                              |
| ----------------- | --------------------- | ---------------------------------------------------------------------------------------- |
| `rel.key`         | `string`              | Zotero item key of the related item                                                      |
| `rel.libraryID`   | `number`              | Library ID parsed from the relation URI                                                  |
| `rel.resolved`    | `boolean`             | Whether the item is in the local database (`false` = cross-library / unsynced / deleted) |
| `rel.title`       | `string \| undefined` | Title (only when resolved)                                                               |
| `rel.itemType`    | `string \| undefined` | Item type (only when resolved)                                                           |
| `rel.citationKey` | `string \| undefined` | Citation key (only when resolved)                                                        |
| `rel.notePath`    | `string \| undefined` | Path to the item's Source Note in the vault (only when resolved)                         |

Cross-library or unsynced related items still appear in the list (`resolved: false`), useful for placeholder display. Filter with `{% if rel.resolved %}` or `{% if rel.title %}`.

### `item.annotations[]` / `attachment.annotations[]` — Annotations

| Variable                  | Type                    | Description                                                                                              |
| ------------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------- |
| `annotation.key`          | `string`                | Annotation item key                                                                                      |
| `annotation.libraryID`    | `number`                | Library ID                                                                                               |
| `annotation.parentItem`   | `string \| undefined`   | Key of the owning attachment                                                                             |
| `annotation.type`         | `string`                | Type: `"highlight"`, `"note"`, `"image"`, `"ink"`                                                        |
| `annotation.authorName`   | `string \| undefined`   | Annotation author                                                                                        |
| `annotation.text`         | `string \| null`        | Highlighted text (`>` and `<` already escaped)                                                           |
| `annotation.comment`      | `string \| undefined`   | Annotation comment (already Markdown-converted: `<b>`→`**`, `<i>`→`*`, `<sub>`/`<sup>` stay inline HTML) |
| `annotation.color`        | `string \| undefined`   | Hex color (e.g., `"#ffd400"`)                                                                            |
| `annotation.pageLabel`    | `string \| undefined`   | Page label                                                                                               |
| `annotation.tags`         | `Array<{ tag, type? }>` | Tags                                                                                                     |
| `annotation.dateAdded`    | `string`                | ISO timestamp                                                                                            |
| `annotation.dateModified` | `string`                | ISO timestamp                                                                                            |
| `annotation.raw`          | `AnnotationJSON`        | Raw annotation object, for use with the `process_nav_info` filter                                        |

### `settings` — Plugin Configuration

`ZotFlowSettings` exposed in full. Commonly used:

| Variable                         | Type     | Description                   |
| -------------------------------- | -------- | ----------------------------- |
| `settings.annotationImageFolder` | `string` | Annotation image output dir   |
| `settings.sourceNoteFolder`      | `string` | Default Source Note directory |

### Default Template

When no custom template is configured, the following built-in template is used:

```liquid
---
citationKey: {{ item.citationKey | json }}
title: {{ item.title | json }}
itemType: {{ item.itemType | json }}
creators: [{% for c in item.creators %}"{{ c.name }}"{% unless forloop.last %}, {% endunless %}{% endfor %}]
publication: {{ item.publicationTitle | default: item.publisher | json }}
date: {{ item.date | json }}
year: {{ item.year }}
url: {{ item.url | json }}
doi: {{ item.DOI | json }}
tags: [{% for t in item.tags %}"#{{ t.tag | replace: " ", "_" }}"{% unless forloop.last %}, {% endunless %}{% endfor %}]
---
{%- capture quote_string %}{{ newline }}> {% endcapture -%}
{%- capture quote_string_2 %}{{ newline }}> >{% endcapture -%}
# {{ item.title }}
{%- if item.abstractNote -%}
## Abstract
> {{ item.abstractNote | replace: newline, quote_string }}

{%- endif -%}
{%- if item.attachments.length > 0 -%}
## Attachments
{%- for attachment in item.attachments -%}
- [{{ attachment.filename }}]({{ attachment | attachment_link }})
{%- endfor -%}

{%- endif -%}
## Notes
{%- if item.notes.length > 0 -%}
{%- for note in item.notes -%}
{{ note.note | html2md | wrap_editable: "NOTE", note.key }}

{%- endfor -%}
{%- endif -%}
{%- if item.attachments.length > 0 and item.attachmentAnnotations.length > 0 -%}
## Annotations
{%- for attachment in item.attachments -%}
{%- if attachment.annotations.length > 0 -%}
### {{ attachment.filename }}
{%- for annotation in attachment.annotations -%}
> [!zotflow-{{ annotation.type }}-{{ annotation.color }}] [{{ attachment.filename }}, p.{{ annotation.pageLabel }}]({{ annotation | annotation_link }})
{%- if annotation.type == "ink" or annotation.type == "image"-%}
> > ![[{{settings.annotationImageFolder}}/{{ annotation.key }}.png]]
{%- else -%}
> > {{ annotation.text | replace: newline, quote_string_2 }}
{%- endif -%}
>
> {{ annotation.comment | wrap_editable: "ANNO", annotation.key | replace: newline, quote_string }}
> {% if annotation.tags and annotation.tags.length > 0 -%} {% for t in annotation.tags %}#{{ t.tag | replace: " ", "_" }}{% unless forloop.last %} {% endunless %}{% endfor %} {%- endif %}
^{{ annotation.key }}

{%- endfor -%}
{%- endif -%}
{%- endfor -%}
{%- endif -%}
{%- if item.attachments.length == 0 and item.itemType == "attachment" and item.annotations.length > 0 -%}
## Annotations
{%- for annotation in item.annotations -%}
> [!zotflow-{{ annotation.type }}-{{ annotation.color }}] [{{ item.title }}, p.{{ annotation.pageLabel }}]({{ annotation | annotation_link }})
{%- if annotation.type == "ink" or annotation.type == "image"-%}
> > ![[{{settings.annotationImageFolder}}/{{ annotation.key }}.png]]
{%- else -%}
> > {{ annotation.text | replace: newline, quote_string_2 }}
{%- endif -%}
>
> {{ annotation.comment | wrap_editable: "ANNO", annotation.key | replace: newline, quote_string }}
> {% if annotation.tags and annotation.tags.length > 0 -%} {% for t in annotation.tags %}#{{ t.tag | replace: " ", "_" }}{% unless forloop.last %} {% endunless %}{% endfor %} {%- endif %}
^{{ annotation.key }}

{%- endfor -%}
{%- endif -%}
```

1. **Frontmatter** — Outputs `citationKey`, `title`, `itemType`, `creators`, `publication`, `date`, `year`, `url`, `doi`, `tags`
2. **Title** — `# Title`
3. **Abstract** — Rendered in blockquote format
4. **Attachments** — List of clickable links (via `attachment_link` filter, opening in ZotFlow reader by default)
5. **Child notes** — Each note rendered with `html2md | wrap_editable` as an editable region
6. **Annotations** — Grouped by attachment, rendered with `[!zotflow-<type>-<color>]` callouts, annotation comments wrapped as editable regions, tags displayed on a dedicated line below the comment

---

## 2. Local Source Note Template

Controls Source Notes for vault-local files (PDF/EPUB/HTML). Context is `{ item, settings, path }`.

### `item` — Local File

| Variable           | Type                | Description                                        |
| ------------------ | ------------------- | -------------------------------------------------- |
| `item.name`        | `string`            | Full filename (e.g., `"paper.pdf"`)                |
| `item.path`        | `string`            | Vault-relative path (e.g., `"Articles/paper.pdf"`) |
| `item.extension`   | `string`            | Extension (e.g., `"pdf"`)                          |
| `item.basename`    | `string`            | Filename without extension (e.g., `"paper"`)       |
| `item.annotations` | `LocalAnnotation[]` | Annotation list from the local reader              |

### `item.annotations[]` — Local Annotations

| Variable                  | Type                    | Description                                                 |
| ------------------------- | ----------------------- | ----------------------------------------------------------- |
| `annotation.key`          | `string`                | Annotation ID                                               |
| `annotation.libraryID`    | `number`                | Always `0` (local file)                                     |
| `annotation.type`         | `string`                | `"highlight"`, `"note"`, `"image"`, `"ink"`                 |
| `annotation.authorName`   | `string \| undefined`   | Annotation author                                           |
| `annotation.text`         | `string \| null`        | Highlighted text                                            |
| `annotation.comment`      | `string \| undefined`   | User comment                                                |
| `annotation.color`        | `string \| undefined`   | Color                                                       |
| `annotation.pageLabel`    | `string \| undefined`   | Page label                                                  |
| `annotation.tags`         | `Array<{ tag, type? }>` | Tags                                                        |
| `annotation.dateAdded`    | `string \| undefined`   | ISO timestamp                                               |
| `annotation.dateModified` | `string \| undefined`   | ISO timestamp                                               |
| `annotation.raw`          | `AnnotationJSON`        | Raw object, for use with the `process_raw_anno_json` filter |

### `path` / `settings`

- `path` — Same as `item.path`
- `settings` — Shares the same `ZotFlowSettings` object as the Zotero template

### Default Template

Output logic is similar to the Zotero template but simpler: no metadata fields (local files lack Zotero metadata), only title and annotation list. Annotation comments are wrapped as **editable regions** — edits in the note are written back to the `.zf.json` sidecar. `wrap_editable` (including `"PERSIST"` regions) works in local templates too; read-only/external annotations are rendered as plain locked text automatically.

```liquid
---
zotflow-locked: {{true}}
zotflow-local-attachment: [[{{ path }}]]
---
{%- capture quote_string %}{{ newline }}> {% endcapture -%}
{%- capture quote_string_2 %}{{ newline }}> >{% endcapture -%}
# {{ item.basename }}
{%- if item.annotations.length > 0 -%}
## Annotations
{%- for annotation in item.annotations -%}

> [!zotflow-{{ annotation.type }}-{{ annotation.color }}] [[{{item.path}}#page={{ annotation.pageLabel }}#annotation={{ annotation.key | process_nav_info }}|{{ item.name }}, p.{{ annotation.pageLabel }}]]
{%- if annotation.type == "ink" or annotation.type == "image"-%}
> > ![[{{settings.annotationImageFolder}}/{{ annotation.key }}.png]]
{%- else -%}
> > {{ annotation.text | replace: newline, quote_string_2 }}
{%- endif -%}
>
> {{ annotation.comment | wrap_editable: "ANNO", annotation.key | replace: newline, quote_string }}
{%- if annotation.tags and annotation.tags.length > 0 -%}
>
> {% for t in annotation.tags %}#{{ t.tag | replace: " ", "_" }}{% unless forloop.last %} {% endunless %}{% endfor %}
{%- endif -%}
^{{ annotation.key }}

{%- endfor -%}
{%- endif -%}
```

---

## 3. Citation Templates

Control the rendered output for citation insertion. Five slots:

| Slot                    | Output                            | Trigger scenario                             |
| ----------------------- | --------------------------------- | -------------------------------------------- |
| **Pandoc**              | `[@key]` format citation          | Drag / suggest / copy with Pandoc selected   |
| **Wikilink**            | `[[notePath\|label]]` format link | Drag / suggest / copy with Wikilink selected |
| **Footnote Reference**  | Inline `[^key]` marker            | Inline part of a Footnote citation           |
| **Footnote Definition** | Footnote definition at doc end    | Definition part of a Footnote citation       |
| **Citekey**             | Bare `@key`                       | Direct output, no template rendering         |

### Citation Context Variables

| Variable                | Type                  | Description                                                     |
| ----------------------- | --------------------- | --------------------------------------------------------------- |
| `item.key`              | `string`              | Zotero item key                                                 |
| `item.citationKey`      | `string`              | Citation key (falls back to `item.key` if empty)                |
| `item.title`            | `string`              | Title                                                           |
| `item.creators`         | `Array<{ name }>`     | Creator list                                                    |
| `item.date`             | `string`              | Publication date                                                |
| `item.itemType`         | `string`              | Item type                                                       |
| `item.url`              | `string \| undefined` | URL                                                             |
| `item.DOI`              | `string \| undefined` | DOI                                                             |
| `item.publicationTitle` | `string \| undefined` | Journal / conference name                                       |
| `item.publisher`        | `string \| undefined` | Publisher                                                       |
| `item.volume`           | `string \| undefined` | Volume                                                          |
| `item.issue`            | `string \| undefined` | Issue                                                           |
| `item.pages`            | `string \| undefined` | Page range                                                      |
| `item.tags`             | `Array<{ tag }>`      | Tags                                                            |
| `item.*`                |                       | Other Zotero item fields are also available                     |
| `notePath`              | `string`              | Vault-relative path to the Source Note                          |
| `annotations`           | `Array`               | Currently selected annotations (empty array when none selected) |

`annotations[]` sub-fields: `annotation.key`, `annotation.type`, `annotation.text`, `annotation.comment`, `annotation.color`, `annotation.pageLabel`, `annotation.tags`, `annotation.dateAdded`, `annotation.dateModified`.

Use `annotations.size` to check whether annotations are selected, and `annotations | map: 'pageLabel'` to extract page numbers.

### Default Citation Templates

**Pandoc:**

```liquid
[@{{ item.citationKey | default: item.key }}{% if annotations.size > 0 %}{% assign pages = annotations | map: 'pageLabel' | compact | uniq | join: ', ' %}{% if pages != empty %}, pp. {{ pages }}{% endif %}{% endif %}]
```

Example output: `[@smith2024, pp. 3, 7]`

**Footnote Reference:**

```liquid
[^{{ item.citationKey | default: item.key }}]
```

Example output: `[^smith2024]`

**Footnote Definition:**

```liquid
{%- if item.creators.length > 1 -%}
{{ item.creators[0].name }} et al.
{%- elsif item.creators.length == 1 -%}
{{ item.creators[0].name }}
{%- else -%}
Unknown Author
{%- endif -%}, *{{ item.title }}* ({{ item.date | slice: 0, 4 }}).
```

Example output: `Smith et al., *Deep Learning for NLP* (2024).`

**Wikilink:**

```liquid
{%- if annotations.size > 0 -%}
{%- for annotation in annotations -%}
[[{{ notePath }}#^{{ annotation.key }}|{{ item.creators[0].name | default: "Unknown" }} ({{ item.date | slice: 0, 4 }}), p. {{ annotation.pageLabel }}]]
{%- if forloop.last == false %}, {% endif -%}
{%- endfor -%}
{%- else -%}
[[{{ notePath }}|{{ item.creators[0].name | default: "Unknown" }} ({{ item.date | slice: 0, 4 }})]]
{%- endif -%}
```

---

## 4. Path Templates

Control where Source Note files land in your vault. Each path segment is automatically sanitized (illegal characters removed, reserved names handled).

### Library Path Variables

| Variable           | Type              | Description                            |
| ------------------ | ----------------- | -------------------------------------- |
| `key`              | `string`          | Zotero item key                        |
| `citationKey`      | `string`          | Citation key                           |
| `libraryID`        | `number`          | Library ID                             |
| `itemType`         | `string`          | Item type                              |
| `title`            | `string`          | Title                                  |
| `creators`         | `Array<{ name }>` | Creator list                           |
| `date`             | `string`          | Publication date                       |
| `year`             | `string`          | Four-digit year extracted from date    |
| `libraryName`      | `string`          | Library display name                   |
| `publicationTitle` | `string`          | Journal / conference name              |
| `publisher`        | `string`          | Publisher                              |
| `tags`             | `Array<{ tag }>`  | Tags                                   |
| `itemPaths`        | `string[]`        | Collection paths                       |
| `*`                |                   | Other Zotero metadata fields available |

### Local Path Variables

| Variable    | Type     | Description                |
| ----------- | -------- | -------------------------- |
| `basename`  | `string` | Filename without extension |
| `name`      | `string` | Full filename              |
| `path`      | `string` | Vault-relative path        |
| `extension` | `string` | Extension (without dot)    |

### Default Path Templates

**Library:** `Source/{{libraryName}}/@{{citationKey | default: title | default: key}}`
Example output: `Source/My Library/@smith2024`

**Local:** `Source/Local/@{{basename}}`
Example output: `Source/Local/@myPaper`

### Path Template Tips

- `/` creates directory hierarchy: `References/{{year}}/{{citationKey}}`
- `@` prefix is a visual convention (distinguishes Source Notes from regular notes), not mandatory
- `| default:` chain fallback: `{{citationKey | default: title | default: key}}`
- Collection path: `{{itemPaths[0]}}` to use the first collection path

---


---

## Related Pages

- [Template Guide](template-guide.md)
- [Template Filters](template-filters.md)
