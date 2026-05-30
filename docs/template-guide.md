---
sidebar_position: 8
---

# Template System Overview & Variable Reference

Almost all user-visible output in ZotFlow is template-driven. You don't need to wait for feature requests — edit the templates directly to control Source Note content, citation formats, file paths, and annotation rendering.

The template engine is [LiquidJS](https://liquidjs.com), syntax-compatible with Shopify Liquid.

## Four Template Entry Points

| Template Type           | What it controls                                         | Setting Location                                                     |
| ----------------------- | -------------------------------------------------------- | -------------------------------------------------------------------- |
| **Zotero Source Note**  | Body of library item Source Notes                        | Settings → General → Template Path                                   |
| **Local Source Note**   | Body of local file Source Notes                          | Settings → General → Local Source Note Template                      |
| **Citation**            | Output for Pandoc / Wikilink / Footnote / Citekey formats | Settings → Citation                                                  |
| **Path**                | File placement for Source Notes                          | Settings → General → Note Path Template / Local Note Path Template   |

All template types share the same LiquidJS engine but expose different context variables. Leave any template path empty to fall back to the built-in default.

## LiquidJS Quick Reference

Templates are composed of:

- **Output tags** `{{ variable }}` — Insert a variable value
- **Logic tags** `{% if condition %} ... {% endif %}` — Conditional branching
- **Loops** `{% for item in array %} ... {% endfor %}` — Iterate over arrays
- **Filters** `{{ value | filter_name }}` — Transform values (e.g., `| json`, `| default: "fallback"`, `| slice: 0, 4`)
- **Whitespace control** `{%-` and `-%}` — Trim surrounding whitespace to avoid excess blank lines
- **Variable capture** `{% capture var %}...{% endcapture %}` — Assign a block of content to a variable

Globally available variables:

| Variable   | Type     | Description                                                    |
| ---------- | -------- | -------------------------------------------------------------- |
| `newline`  | `string` | Literal newline character `"\n"`, for `replace` filter on multiline text |

---

## 1. Zotero Source Note Template

Controls the body of Source Notes for Zotero library items. Context is `{ item, settings }`.

### `item` — Zotero Item

| Variable                      | Type                      | Description                                                                  |
| ----------------------------- | ------------------------- | ---------------------------------------------------------------------------- |
| `item.key`                    | `string`                  | Zotero item key                                                              |
| `item.version`                | `number`                  | Item version number, used for incremental update detection                   |
| `item.libraryID`              | `number`                  | Library ID                                                                   |
| `item.citationKey`            | `string`                  | Citation key (e.g., from Better BibTeX); empty string if not set             |
| `item.itemType`               | `string`                  | Item type (`"journalArticle"`, `"book"`, etc.)                               |
| `item.title`                  | `string`                  | Title                                                                        |
| `item.creators`               | `Array<{ name: string }>` | Creator list, `name` is the combined full name                                |
| `item.date`                   | `string \| null`          | Publication date string (raw value from Zotero)                               |
| `item.dateAdded`              | `string`                  | ISO timestamp when the item was added to Zotero                               |
| `item.dateModified`           | `string`                  | ISO timestamp of last modification                                            |
| `item.accessDate`             | `string \| null`          | Last access date                                                             |
| `item.abstractNote`           | `string \| undefined`     | Abstract                                                                     |
| `item.publicationTitle`       | `string \| undefined`     | Journal / conference name                                                    |
| `item.publisher`              | `string \| undefined`     | Publisher                                                                    |
| `item.place`                  | `string \| undefined`     | Place of publication                                                         |
| `item.volume`                 | `string \| undefined`     | Volume                                                                       |
| `item.issue`                  | `string \| undefined`     | Issue                                                                        |
| `item.pages`                  | `string \| undefined`     | Page range                                                                   |
| `item.series`                 | `string \| undefined`     | Series name                                                                  |
| `item.seriesNumber`           | `string \| undefined`     | Series number                                                                |
| `item.edition`                | `string \| undefined`     | Edition                                                                      |
| `item.url`                    | `string \| undefined`     | URL                                                                          |
| `item.DOI`                    | `string \| undefined`     | DOI                                                                          |
| `item.ISBN`                   | `string \| undefined`     | ISBN                                                                         |
| `item.ISSN`                   | `string \| undefined`     | ISSN                                                                         |
| `item.tags`                   | `Array<{ tag, type? }>`   | Tag list                                                                     |
| `item.itemPaths`              | `string[]`                | Collection path array for the item (e.g., `["Research/ML"]`)                 |
| `item.attachments`            | `AttachmentContext[]`     | Child attachment list (PDFs, etc.)                                           |
| `item.annotations`            | `AnnotationContext[]`     | Annotations directly on the item (only for standalone attachment items)      |
| `item.attachmentAnnotations`  | `AnnotationContext[]`     | Flattened summary of all annotations across all attachments                  |
| `item.notes`                  | `NoteContext[]`           | Zotero child note list                                                       |
| `item.relatedItems`           | `RelatedItemContext[]`    | Zotero "Related" item list                                                   |

### `item.attachments[]` — Attachment Sub-Objects

| Variable                   | Type                    | Description                                  |
| -------------------------- | ----------------------- | -------------------------------------------- |
| `attachment.key`           | `string`                | Attachment item key                          |
| `attachment.libraryID`     | `number`                | Library ID                                   |
| `attachment.filename`      | `string`                | Filename (e.g., `"paper.pdf"`)               |
| `attachment.contentType`   | `string`                | MIME type (e.g., `"application/pdf"`)        |
| `attachment.tags`          | `Array<{ tag, type? }>` | Tags                                         |
| `attachment.dateAdded`     | `string`                | ISO timestamp                                |
| `attachment.dateModified`  | `string`                | ISO timestamp                                |
| `attachment.annotations`   | `AnnotationContext[]`   | Annotation list on this attachment           |

### `item.notes[]` — Child Notes

| Variable             | Type                    | Description                                                    |
| -------------------- | ----------------------- | -------------------------------------------------------------- |
| `note.key`           | `string`                | Note item key                                                  |
| `note.libraryID`     | `number`                | Library ID                                                     |
| `note.title`         | `string`                | Note title (first line, or empty)                              |
| `note.note`          | `string`                | Full note HTML (Zotero ProseMirror format)                     |
| `note.tags`          | `Array<{ tag, type? }>` | Tags                                                           |
| `note.dateAdded`     | `string`                | ISO timestamp                                                  |
| `note.dateModified`  | `string`                | ISO timestamp                                                  |

### `item.relatedItems[]` — Related Items

From Zotero's Related tab (`dc:relation`). Each entry corresponds to a relation URI. `key` and `libraryID` are always parsed from the URI; other fields are populated only when the related item exists in the local database.

| Variable           | Type                  | Description                                                                    |
| ------------------ | --------------------- | ------------------------------------------------------------------------------ |
| `rel.key`          | `string`              | Zotero item key of the related item                                            |
| `rel.libraryID`    | `number`              | Library ID parsed from the relation URI                                        |
| `rel.resolved`     | `boolean`             | Whether the item is in the local database (`false` = cross-library / unsynced / deleted) |
| `rel.title`        | `string \| undefined` | Title (only when resolved)                                                     |
| `rel.itemType`     | `string \| undefined` | Item type (only when resolved)                                                 |
| `rel.citationKey`  | `string \| undefined` | Citation key (only when resolved)                                              |
| `rel.notePath`     | `string \| undefined` | Path to the item's Source Note in the vault (only when resolved)               |

Cross-library or unsynced related items still appear in the list (`resolved: false`), useful for placeholder display. Filter with `{% if rel.resolved %}` or `{% if rel.title %}`.

### `item.annotations[]` / `attachment.annotations[]` — Annotations

| Variable                   | Type                    | Description                                                                                  |
| -------------------------- | ----------------------- | -------------------------------------------------------------------------------------------- |
| `annotation.key`           | `string`                | Annotation item key                                                                          |
| `annotation.libraryID`     | `number`                | Library ID                                                                                   |
| `annotation.type`          | `string`                | Type: `"highlight"`, `"note"`, `"image"`, `"ink"`                                            |
| `annotation.authorName`    | `string \| undefined`   | Annotation author                                                                            |
| `annotation.text`          | `string \| null`        | Highlighted text (`>` and `<` already escaped)                                                |
| `annotation.comment`       | `string \| undefined`   | Annotation comment (already Markdown-converted: `<b>`→`**`, `<i>`→`*`, `<sub>`/`<sup>` stay inline HTML) |
| `annotation.color`         | `string \| undefined`   | Hex color (e.g., `"#ffd400"`)                                                                |
| `annotation.pageLabel`     | `string \| undefined`   | Page label                                                                                   |
| `annotation.tags`          | `Array<{ tag, type? }>` | Tags                                                                                         |
| `annotation.dateAdded`     | `string`                | ISO timestamp                                                                                |
| `annotation.dateModified`  | `string`                | ISO timestamp                                                                                |
| `annotation.raw`           | `AnnotationJSON`        | Raw annotation object, for use with the `process_nav_info` filter                            |

### `settings` — Plugin Configuration

`ZotFlowSettings` exposed in full. Commonly used:

| Variable                          | Type     | Description                   |
| --------------------------------- | -------- | ----------------------------- |
| `settings.annotationImageFolder`  | `string` | Annotation image output dir   |
| `settings.sourceNoteFolder`       | `string` | Default Source Note directory |

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
year: {{ item.date | slice: 0, 4 }}
url: {{ item.url | json }}
doi: {{ item.DOI | json }}
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
- [{{ attachment.filename }}](obsidian://zotflow?type=open-attachment&libraryID={{ attachment.libraryID }}&key={{ attachment.key }})
{%- endfor -%}

{%- endif -%}
{%- if item.notes.length > 0 -%}
## Notes
{%- for note in item.notes -%}
### {{ note.title | default: "Note" }}
{{ note.note }}
{%- endfor -%}

{%- endif -%}
{%- if item.attachments.length > 0 and item.attachmentAnnotations.length > 0 -%}
## Annotations
{%- for attachment in item.attachments -%}
{%- if attachment.annotations.length > 0 -%}
### {{ attachment.filename }}
{%- for annotation in attachment.annotations -%}
> [!zotflow-{{ annotation.type }}-{{ annotation.color }}] [{{ attachment.filename }}, p.{{ annotation.pageLabel }}](obsidian://zotflow?type=open-attachment&libraryID={{ attachment.libraryID }}&key={{ attachment.key }}&navigation={{ annotation.key | process_nav_info}})
{%- if annotation.type == "ink" or annotation.type == "image"-%}
> > ![[{{settings.annotationImageFolder}}/{{ annotation.key }}.png]]
{%- else -%}
> > {{ annotation.text | replace: newline, quote_string_2 }}
{%- endif -%}
{%- if annotation.comment != "" -%}
>
> {{ annotation.comment | replace: newline, quote_string }}
{%- endif -%}^{{ annotation.key }}

{%- endfor -%}
{%- endif -%}
{%- endfor -%}
{%- endif -%}
{%- if item.attachments.length == 0 and item.itemType == "attachment" and item.annotations.length > 0 -%}
## Annotations
{%- for annotation in item.annotations -%}
> [!zotflow-{{ annotation.type }}-{{ annotation.color }}] [{{ item.title }}, p.{{ annotation.pageLabel }}](obsidian://zotflow?type=open-attachment&libraryID={{ item.libraryID }}&key={{ item.key }}&navigation={{ annotation.key | process_nav_info}})
{%- if annotation.type == "ink" or annotation.type == "image"-%}
> > ![[{{settings.annotationImageFolder}}/{{ annotation.key }}.png]]
{%- else -%}
> > {{ annotation.text | replace: newline, quote_string_2 }}
{%- endif -%}
{%- if annotation.comment != "" -%}
>
> {{ annotation.comment | replace: newline, quote_string }}
{%- endif -%}^{{ annotation.key }}

{%- endfor -%}
{%- endif -%}
```

1. **Frontmatter** — Outputs `citationKey`, `title`, `itemType`, `creators`, `publication`, `date`, `year`, `url`, `doi`
2. **Title** — `# Title`
3. **Abstract** — Rendered in blockquote format
4. **Attachments** — List of Obsidian URI links
5. **Child notes** — Each note rendered as a `### heading` + `{{ note.note }}` (Markdown-converted) section
6. **Annotations** — Grouped by attachment, rendered with `[!zotflow-<type>-<color>]` callouts, annotation comments wrapped as editable regions

---

## 2. Local Source Note Template

Controls Source Notes for vault-local files (PDF/EPUB/HTML). Context is `{ item, settings, path }`.

### `item` — Local File

| Variable            | Type                | Description                                               |
| ------------------- | ------------------- | --------------------------------------------------------- |
| `item.name`         | `string`            | Full filename (e.g., `"paper.pdf"`)                        |
| `item.path`         | `string`            | Vault-relative path (e.g., `"Articles/paper.pdf"`)         |
| `item.extension`    | `string`            | Extension (e.g., `"pdf"`)                                  |
| `item.basename`     | `string`            | Filename without extension (e.g., `"paper"`)              |
| `item.annotations`  | `LocalAnnotation[]` | Annotation list from the local reader                     |

### `item.annotations[]` — Local Annotations

| Variable                   | Type                    | Description                                         |
| -------------------------- | ----------------------- | --------------------------------------------------- |
| `annotation.key`           | `string`                | Annotation ID                                       |
| `annotation.libraryID`     | `number`                | Always `0` (local file)                             |
| `annotation.type`          | `string`                | `"highlight"`, `"note"`, `"image"`, `"ink"`         |
| `annotation.authorName`    | `string \| undefined`   | Annotation author                                   |
| `annotation.text`          | `string \| null`        | Highlighted text                                    |
| `annotation.comment`       | `string \| undefined`   | User comment                                        |
| `annotation.color`         | `string \| undefined`   | Color                                               |
| `annotation.pageLabel`     | `string \| undefined`   | Page label                                          |
| `annotation.tags`          | `Array<{ tag, type? }>` | Tags                                                |
| `annotation.dateAdded`     | `string \| undefined`   | ISO timestamp                                       |
| `annotation.dateModified`  | `string \| undefined`   | ISO timestamp                                       |
| `annotation.raw`           | `AnnotationJSON`        | Raw object, for use with the `process_raw_anno_json` filter |

### `path` / `settings`

- `path` — Same as `item.path`
- `settings` — Shares the same `ZotFlowSettings` object as the Zotero template

### Default Template

Output logic is similar to the Zotero template but simpler: no metadata fields (local files lack Zotero metadata), only title and annotation list.

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
{%- if annotation.comment != "" -%}
>
> {{ annotation.comment | replace: newline, quote_string }}
{%- endif -%}
^{{ annotation.key }}

{%- endfor -%}
{%- endif -%}
```

---

## 3. Citation Templates

Control the rendered output for citation insertion. Five slots:

| Slot                    | Output                              | Trigger scenario                              |
| ----------------------- | ----------------------------------- | --------------------------------------------- |
| **Pandoc**              | `[@key]` format citation           | Drag / suggest / copy with Pandoc selected     |
| **Wikilink**            | `[[notePath\|label]]` format link   | Drag / suggest / copy with Wikilink selected   |
| **Footnote Reference**  | Inline `[^key]` marker             | Inline part of a Footnote citation             |
| **Footnote Definition** | Footnote definition at doc end     | Definition part of a Footnote citation         |
| **Citekey**             | Bare `@key`                        | Direct output, no template rendering           |

### Citation Context Variables

| Variable             | Type                  | Description                                                    |
| -------------------- | --------------------- | -------------------------------------------------------------- |
| `item.key`           | `string`              | Zotero item key                                                |
| `item.citationKey`   | `string`              | Citation key (falls back to `item.key` if empty)               |
| `item.title`         | `string`              | Title                                                          |
| `item.creators`      | `Array<{ name }>`     | Creator list                                                   |
| `item.date`          | `string`              | Publication date                                               |
| `item.itemType`      | `string`              | Item type                                                      |
| `item.url`           | `string \| undefined` | URL                                                            |
| `item.DOI`           | `string \| undefined` | DOI                                                            |
| `item.publicationTitle` | `string \| undefined` | Journal / conference name                                   |
| `item.publisher`     | `string \| undefined` | Publisher                                                      |
| `item.volume`        | `string \| undefined` | Volume                                                         |
| `item.issue`         | `string \| undefined` | Issue                                                          |
| `item.pages`         | `string \| undefined` | Page range                                                     |
| `item.tags`          | `Array<{ tag }>`      | Tags                                                           |
| `item.*`             |                       | Other Zotero item fields are also available                    |
| `notePath`           | `string`              | Vault-relative path to the Source Note                         |
| `annotations`        | `Array`               | Currently selected annotations (empty array when none selected) |

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

| Variable          | Type              | Description                            |
| ----------------- | ----------------- | -------------------------------------- |
| `key`             | `string`          | Zotero item key                        |
| `citationKey`     | `string`          | Citation key                           |
| `libraryID`       | `number`          | Library ID                             |
| `itemType`        | `string`          | Item type                              |
| `title`           | `string`          | Title                                  |
| `creators`        | `Array<{ name }>` | Creator list                           |
| `date`            | `string`          | Publication date                       |
| `year`            | `string`          | Four-digit year extracted from date    |
| `libraryName`     | `string`          | Library display name                   |
| `publicationTitle`| `string`          | Journal / conference name              |
| `publisher`       | `string`          | Publisher                              |
| `tags`            | `Array<{ tag }>`  | Tags                                   |
| `itemPaths`       | `string[]`        | Collection paths                       |
| `*`               |                   | Other Zotero metadata fields available |

### Local Path Variables

| Variable     | Type     | Description                         |
| ------------ | -------- | ----------------------------------- |
| `basename`   | `string` | Filename without extension          |
| `name`       | `string` | Full filename                       |
| `path`       | `string` | Vault-relative path                 |
| `extension`  | `string` | Extension (without dot)             |

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

## Custom Filters

ZotFlow registers the following custom filters on top of LiquidJS built-in filters:

### `process_nav_info`

Applies to: **All template types**

Converts an annotation key into a URL-encoded JSON navigation parameter for constructing `obsidian://zotflow` deep links.

```liquid
{{ annotation.key | process_nav_info }}
```

Input: `"ABC12345"`
Output: `%7B%22annotationID%22%3A%22ABC12345%22%7D`

### `html2md`

Applies to: **Zotero Source Note**

Converts Zotero HTML (ProseMirror format) to Markdown. Handles math formulas, code blocks, tables, images, and Zotero wrapper div attributes. Almost always chained with `wrap_editable`:

```liquid
{{ note.note | html2md | wrap_editable: "NOTE", note.key }}
```

> This filter is async; LiquidJS automatically evaluates it as a Promise. Only applicable to HTML strings.

### `wrap_editable`

Applies to: **Zotero Source Note**

Wraps content in hidden HTML comment markers recognized by ZotFlow's editor extension, forming an editable region.

```liquid
{{ value | wrap_editable: "TYPE", key }}
```

| Parameter | Type     | Description                                                    |
| --------- | -------- | -------------------------------------------------------------- |
| `"TYPE"`  | `string` | `"NOTE"` — Zotero child note; `"ANNO"` — annotation comment    |
| `key`     | `string` | Corresponding Zotero note key or annotation key                |

Output: Input string wrapped with `<!-- ZF_TYPE_BEG_key -->` / `<!-- ZF_TYPE_END_key -->` markers.

- **Note region**: `{{ note.note | html2md | wrap_editable: "NOTE", note.key }}`
- **Annotation comment region**: `{{ annotation.comment | wrap_editable: "ANNO", annotation.key }}`

Annotation comments undergo a lightweight `annoHtml2md` conversion before entering the template context (`<b>`→`**`, `<i>`→`*`, `<sub>`/`<sup>` preserved, stray `<`/`>` escaped), so you can pipe directly to `| wrap_editable` without going through `| html2md`.

### `process_raw_anno_json`

Applies to: **Local Source Note**

Encodes raw annotation JSON as a URL-encoded string (with image data stripped to reduce size), for use inside `%% ZOTFLOW_ANNO_..._BEG %%` comment markers.

```liquid
{{ annotation.raw | process_raw_anno_json }}
```

---

## Frontmatter Rendering & Merge Strategy

Frontmatter has two editing sources:

1. **Fields defined in the template**: Frontmatter declared in the template's `---` block
2. **Fields added directly by the user in the note**: Manually written into the generated `.md` file's frontmatter

### User-Added Fields in the Note

ZotFlow **never modifies them** — no overwrite, no delete, no addition. These fields are fully user-managed.

### Template-Defined Fields

On each re-render, template frontmatter fields are merged with the note's existing frontmatter according to prefix rules:

| Prefix                                | Behavior                                                                                                      |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **`??` prefix** (e.g., `??rating`)    | Field **absent** from note → fill with template value. Field **already present** in note → keep note's value   |
| **No `??` prefix**                    | Always overwrite the note's value with template content                                                       |

Mandatory fields (`zotflow-locked: true`, `zotero-key`, `item-version`, `library-id`, and `zotflow-local-attachment` for local notes) are always injected by the system — no need to declare them in templates.

### Rendering Pipeline

1. **Parse template** — Separate the `---`-wrapped frontmatter block from the body
2. **Render frontmatter** — LiquidJS renders the frontmatter block first (so you can use `{{ item.title }}` etc. in frontmatter)
3. **Parse YAML** — The rendered frontmatter string is parsed as YAML
4. **Merge** — If the target file already exists: user-added fields are preserved; template `??`-prefixed fields only fill when absent; template non-`??` fields overwrite the note's values
5. **Inject mandatory fields** — ZotFlow writes the system-required fields
6. **Serialize** — Final frontmatter is serialized back to a YAML string
7. **Render body** — The body section goes through LiquidJS
8. **Combine** — Frontmatter + body joined into the final Markdown file

---

## Editable Region Mechanism

The Source Note is read-only by default, but through the `wrap_editable` filter, you can precisely declare which blocks are editable in your template:

- **Zotero child notes** → `{{ note.note | html2md | wrap_editable: "NOTE", note.key }}`
- **Annotation comments** → `{{ annotation.comment | wrap_editable: "ANNO", annotation.key }}`

In Source / Live Preview mode, each region shows a 🔒 lock icon at the start of the line. Click to unlock and edit directly within the block. On save:

- **Note region** → Markdown converted to Zotero HTML, written to the corresponding note record in IndexedDB
- **Annotation comment region** → Blockquote `> ` prefix stripped, Markdown converted to Zotero comment HTML, written to the corresponding annotation comment field in IndexedDB

Writes are debounced ~2s. Pushed to Zotero on the next bidirectional sync.

Related settings:

- **Default Editable Region Locked** — Controls whether regions start locked
- **Hide Editable Region Markers** — Hides `ZF_*_BEG` / `ZF_*_END` marker lines
- Read Only libraries prevent unlocking

---

## Template Preview

The Activity Center's **Template** tab provides a sandboxed preview environment to see rendered output without actually creating files.

Steps:

1. Open Activity Center → Template tab
2. Select a context from the dropdown (Library Source Note / Local Source Note / Path / Citation × 4)
3. Click **Pick Zotero Item** or **Pick Local File** to choose a render target
4. For citation contexts, a multi-select annotation dropdown appears — choose which annotations to include
5. The left CodeMirror editor shows the current template (freely editable; does not affect saved templates)
6. Click **Render**, and the right panel shows results:
   - **Source** — Raw Markdown (read-only editor)
   - **Preview** — Styled preview rendered by Obsidian's `MarkdownRenderer`
7. The Copy button in the template panel header copies the template to clipboard

> Switching contexts auto-loads the corresponding built-in default template. All edits exist only in the current session and do not modify templates in settings.

---

## Common Patterns & Tips

### Extract Year

```liquid
year: {{ item.date | slice: 0, 4 }}
```

### Comma-Separated Creator List

```liquid
authors: [{% for c in item.creators %}"{{ c.name }}"{% unless forloop.last %}, {% endunless %}{% endfor %}]
```

### Multiline Text in Blockquote

```liquid
{%- capture quote_string %}{{ newline }}> {% endcapture -%}
> {{ item.abstractNote | replace: newline, quote_string }}
```

### Conditional DOI Display

```liquid
{%- if item.DOI -%}
DOI: [{{ item.DOI }}](https://doi.org/{{ item.DOI }})
{%- endif -%}
```

### Render Tags

```liquid
{%- if item.tags.length > 0 -%}
tags:
{%- for tag in item.tags -%}
  - {{ tag.tag }}
{%- endfor -%}
{%- endif -%}
```

### Related Items

```liquid
{%- if item.relatedItems.size > 0 -%}
## Related
{% for rel in item.relatedItems -%}
{% if rel.notePath -%}
- [[{{ rel.notePath }}|{{ rel.title }}]]
{%- elsif rel.title -%}
- {{ rel.title }} (`{{ rel.key }}`)
{%- else -%}
- `{{ rel.key }}` *(not synced)*
{%- endif %}
{% endfor -%}
{%- endif -%}
```

Three branches cover: items with a Source Note path (wikilink), items that exist locally but have no path (title + key), and unsynced / cross-library items (key only).

### Deep Link to Attachment

```liquid
[Open PDF](obsidian://zotflow?type=open-attachment&libraryID={{ attachment.libraryID }}&key={{ attachment.key }})
```

### Jump to Specific Annotation

```liquid
[Jump to annotation](obsidian://zotflow?type=open-attachment&libraryID={{ attachment.libraryID }}&key={{ attachment.key }}&navigation={{ annotation.key | process_nav_info }})
```

### Group Annotations by Attachment

```liquid
{%- for attachment in item.attachments -%}
{%- if attachment.annotations.length > 0 -%}
### {{ attachment.filename }}
{%- for annotation in attachment.annotations -%}
- p.{{ annotation.pageLabel }}: {{ annotation.text }}
{%- endfor -%}
{%- endif -%}
{%- endfor -%}
```

### Use Flattened `attachmentAnnotations`

```liquid
{%- for annotation in item.attachmentAnnotations -%}
- {{ annotation.text }} ({{ annotation.color }})
{%- endfor -%}
```

### Annotation Callout (with Color Info)

```liquid
> [!zotflow-{{ annotation.type }}-{{ annotation.color }}] Title text
> > Quoted annotation text
```

Customize each callout style via CSS: `callout[data-callout="zotflow-highlight-#ffd400"]`.

### `| json` for Safe YAML Values

In frontmatter, always use `| json` on strings that may contain special characters:

```liquid
title: {{ item.title | json }}
```

### Path Template Using Collection Hierarchy

```liquid
References/{{ itemPaths[0] | default: "Unsorted" }}/@{{ citationKey | default: key }}
```

Output: `References/Research/Machine Learning/@smith2024`

---

## Related Pages

- [Source Note](source-notes.md)
- [Citation & Writing Flow](citation-guide.md)
- [Working Model Overview](concepts.md)
