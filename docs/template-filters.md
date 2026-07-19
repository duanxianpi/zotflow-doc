---
sidebar_position: 11
---

# Template Filters

ZotFlow registers custom Liquid filters on its template engines — link builders, HTML ↔ Markdown conversion, editable regions, and CSL citations. This page is the full reference. For context variables, see [Template Variables & Defaults](template-variables.md).

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

### `attachment_link`

Applies to: **Zotero Source Note**

Generates a clickable link to open an attachment. By default, produces a ZotFlow protocol URI (`obsidian://zotflow?type=open-attachment&...`) that opens the attachment in ZotFlow's built-in reader. Pass `"zotero"` as the argument to generate a native Zotero URI instead.

```liquid
{{ attachment | attachment_link }}
{{ attachment | attachment_link: "zotero" }}
```

### `annotation_link`

Applies to: **Zotero Source Note**

Generates a clickable link that navigates to a specific annotation. By default, produces a ZotFlow protocol URI (`obsidian://zotflow?type=open-annotation&...`) that opens the parent attachment in ZotFlow's reader and navigates to the annotation. Pass `"zotero"` as the argument to generate a native Zotero URI instead.

```liquid
{{ annotation | annotation_link }}
{{ annotation | annotation_link: "zotero" }}
```

### `item_link`

Applies to: **Zotero Source Note**

Generates a clickable link to an item. By default, produces a ZotFlow protocol URI (`obsidian://zotflow?type=open-note&...`) that opens the item's Source Note. Pass `"zotero"` as the argument to generate a native Zotero `zotero://select/...` URI instead.

```liquid
{{ item | item_link }}
{{ related | item_link: "zotero" }}
```

> **Auto-detection**: When using the `"zotero"` argument, the Zotero URL prefix automatically uses `groups/<id>` for group libraries and `library` for personal libraries.

### `html2md`

Applies to: **Zotero Source Note**

Converts Zotero HTML (ProseMirror format) to Markdown. Handles math formulas, code blocks, tables, images, and Zotero wrapper div attributes. Almost always chained with `wrap_editable`:

```liquid
{{ note.note | html2md | wrap_editable: "NOTE", note.key }}
```

> This filter is async; LiquidJS automatically evaluates it as a Promise. Only applicable to HTML strings.

### `wrap_editable`

Applies to: **Zotero Source Note**, **Local Source Note** (local: `"ANNO"` and `"PERSIST"` only)

Wraps content in hidden HTML comment markers recognized by ZotFlow's editor extension, forming an editable region.

```liquid
{{ value | wrap_editable: "TYPE", key }}
```

| Parameter | Type     | Description                                                                                       |
| --------- | -------- | ------------------------------------------------------------------------------------------------- |
| `"TYPE"`  | `string` | `"NOTE"` — Zotero child note; `"ANNO"` — annotation comment; `"PERSIST"` — local-only persist region |
| `key`     | `string` | Corresponding Zotero note key or annotation key — or, for `"PERSIST"`, a stable id you choose      |

Output: Input string wrapped with `<!-- ZF_TYPE_BEG_key -->` / `<!-- ZF_TYPE_END_key -->` markers on their own lines. Markers must keep their own lines: a line that *starts* with an HTML comment becomes a CommonMark HTML block, and any markdown sharing that line renders as raw text in Reading view.

- **Note region**: `{{ note.note | html2md | wrap_editable: "NOTE", note.key }}`
- **Annotation comment region**: `{{ annotation.comment | wrap_editable: "ANNO", annotation.key }}`
- **Persist region**: `{{ "Write your thoughts here…" | wrap_editable: "PERSIST", "summary" }}`

Annotation comments undergo a lightweight `annoHtml2md` conversion before entering the template context (`<b>`→`**`, `<i>`→`*`, `<sub>`/`<sup>` preserved, stray `<`/`>` escaped), so you can pipe directly to `| wrap_editable` without going through `| html2md`.

**Persist regions** are local-only: their content survives every note update and is never synced to Zotero (see [Source Notes → Persist Regions](source-notes.md#persist-regions-local-only-content) for the full behavior). Unlike the other two types, you may equivalently write the marker pair by hand in the template:

```markdown
## My Summary
<!-- ZF_PERSIST_BEG_summary -->

<!-- ZF_PERSIST_END_summary -->
```

Id rules for persist regions:

- You pick the id (`summary`, `reading-todo`, …). Allowed characters: letters, digits, `_`, `-` (max 64).
- Ids must be **unique within a note** and **stable across renders** — the id is how ZotFlow finds the region's new home on each update. Don't generate ids from loop variables unless they're stable Zotero keys.
- A blank line between the BEG and END markers is recommended (the filter form emits one) — it gives the empty region an obvious place to click. Directly adjacent markers still work, but the insertion point is harder to hit.

### `citation` (CSL)

Applies to: **Zotero Source Note** and all **Citation** templates (they share the library-note engine; not available in local templates)

Renders a citation (cluster) with [citeproc](https://citeproc-js.readthedocs.io/) using real CSL styles. Takes a single item, a list of items, or annotations:

```liquid
{{ item | citation }}                          →  (Doe, 2020)
{{ item | citation: "ieee" }}                  →  [1]           (positional arg = style id)
{{ item | citation: style: "apa", locale: "de-DE", format: "text" }}
{{ items | citation }}                         →  (Doe, 2020; Roe, 2021)
```

A list renders as **one citation cluster** — merging, ordering, and separators follow the style's rules. Use a `for` loop only when you want independent citations.

**Annotation sugar — automatic page locators.** Piping annotations cites the annotated item (annotation → attachment → top-level item) with `pageLabel` as the page locator; "p."/"pp." pluralization comes from citeproc and the locale:

```liquid
{{ annotation | citation }}                    →  (Doe, 2020, p. 5)
{{ annotations | citation }}                   →  (Doe, 2020, p. 5; Roe, 2021, p. 12)
```

Items and annotations can be mixed in one list; locators apply per element.

**Data source & style management:** see [CSL Citations](csl-citations.md) — CSL-JSON is stored on sync (`item.csljson`, also readable directly in templates) with lazy backfill for older items, and styles are managed from the Activity Center's CSL tab.

**Parameters** (all optional):

| Parameter | Default | Description |
| --- | --- | --- |
| positional / `style:` | the default style from settings | style id, e.g. `"ieee"`, `"apa"` |
| `locale:` | style's default-locale → `en-US` | BCP-47, e.g. `"zh-CN"` |
| `format:` | the default format from settings | `text` / `html` / `markdown` / `markdown-pure` |

Unknown parameter names or invalid formats raise errors listing what's supported. A style with an unresolved dependency chain (missing parent style or locale) raises an actionable error instead of degrading silently — install the missing piece from the Activity Center.

**Known limitations:** each filter call renders independently, so author disambiguation does not work across calls (two "Doe"s won't become "J. Doe"/"M. Doe"), and position-aware forms like *ibid.* don't apply. An explicit `locator:` argument is not implemented — page locators currently come from the annotation sugar only.

### `bibliography` (CSL)

Applies to: **Zotero Source Note** and all **Citation** templates

Renders a bibliography for a list of items (a single item works too):

```liquid
{{ items | bibliography }}
{{ items | bibliography: style: "apa", join: "\n\n" }}
{{ item  | bibliography: "ieee" }}             →  [1] A. Author, …
```

**Pass the whole list in one call**: sorting and numbering are computed by citeproc over the entire list — a `for` loop would give every entry `[1]` and break ordering. Takes the same parameters as `citation`, plus `join:` (entry separator, default `"\n\n"`).

**Recipes:**

Footnote workflow with note-class styles (Chicago full note): `citation` output *is* the footnote body:

```liquid
[^{{ item.citationKey }}]: {{ item | citation: "chicago-note-bibliography" }}
```

Numbered styles (IEEE): a single-item render always numbers `[1]`, so strip it deterministically and let Obsidian number the footnotes:

```liquid
[^{{ item.citationKey }}]: {{ item | bibliography: "ieee" | remove_first: "[1] " }}
```

(Non-numbered styles have no `[1]` prefix — `remove_first` simply matches nothing.)

Related-works list:

```liquid
{% assign cited = item.relatedItems | where: "resolved", true %}
{% if cited.size > 0 %}
## References
{{ cited | bibliography: style: "apa" }}
{% endif %}
```

### `process_raw_anno_json`

Applies to: **Local Source Note**

Encodes raw annotation JSON as a URL-encoded string (with image data stripped to reduce size), for use inside `%% ZOTFLOW_ANNO_..._BEG %%` comment markers.

```liquid
{{ annotation.raw | process_raw_anno_json }}
```

---


---

## Related Pages

- [Template Guide](template-guide.md)
- [Template Variables & Defaults](template-variables.md)
