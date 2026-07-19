---
sidebar_position: 9
---

# Template Guide

Almost all user-visible output in ZotFlow is template-driven. You don't need to wait for feature requests — edit the templates directly to control Source Note content, citation formats, file paths, and annotation rendering.

The template engine is [LiquidJS](https://liquidjs.com), syntax-compatible with Shopify Liquid.

## Four Template Entry Points

| Template Type          | What it controls                                          | Setting Location                                                   |
| ---------------------- | --------------------------------------------------------- | ------------------------------------------------------------------ |
| **Zotero Source Note** | Body of library item Source Notes                         | Settings → General → Template Path                                 |
| **Local Source Note**  | Body of local file Source Notes                           | Settings → General → Local Source Note Template                    |
| **Citation**           | Output for Pandoc / Wikilink / Footnote / Citekey formats | Settings → Citation                                                |
| **Path**               | File placement for Source Notes                           | Settings → General → Note Path Template / Local Note Path Template |

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

| Variable  | Type     | Description                                                              |
| --------- | -------- | ------------------------------------------------------------------------ |
| `newline` | `string` | Literal newline character `"\n"`, for `replace` filter on multiline text |

---

## Context Variables & Default Templates

Each template type exposes its own context variables (`item`, `annotations`, `path`, …). The complete tables — together with the four built-in default templates — live in **[Template Variables & Defaults](template-variables.md)**.

## Custom Filters

ZotFlow adds Liquid filters for link building, HTML ↔ Markdown conversion, editable regions, and CSL citations (`citation` / `bibliography`). The complete reference lives in **[Template Filters](template-filters.md)**.

## Frontmatter Rendering & Merge Strategy

Frontmatter has two editing sources:

1. **Fields defined in the template**: Frontmatter declared in the template's `---` block
2. **Fields added directly by the user in the note**: Manually written into the generated `.md` file's frontmatter

### User-Added Fields in the Note

ZotFlow **never modifies them** — no overwrite, no delete, no addition. These fields are fully user-managed.

### Template-Defined Fields

On each re-render, template frontmatter fields are merged with the note's existing frontmatter according to prefix rules:

| Prefix                             | Behavior                                                                                                     |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| **`??` prefix** (e.g., `??rating`) | Field **absent** from note → fill with template value. Field **already present** in note → keep note's value |
| **No `??` prefix**                 | Always overwrite the note's value with template content                                                      |

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

## Editable Regions

Editable regions — Item Note regions, annotation comment regions, and persist regions — are a Source Note concept and documented there: see [Editable Regions](source-notes.md#editable-regions-three-kinds) and the [ownership model](concepts.md#-distill--content-ownership-inside-a-source-note). The `wrap_editable` filter that creates them is covered in [Template Filters](template-filters.md#wrap_editable).

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

### Render Tags (YAML Frontmatter)

```liquid
tags: [{% for t in item.tags %}"#{{ t.tag | replace: " ", "_" }}"{% unless forloop.last %}, {% endunless %}{% endfor %}]
```

### Render Tags (Inline in Annotation Callout)

```liquid
{% if annotation.tags and annotation.tags.length > 0 -%}
> {% for t in annotation.tags %}#{{ t.tag | replace: " ", "_" }}{% unless forloop.last %} {% endunless %}{% endfor %}
{%- endif %}
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

### Attachment Link

```liquid
- [{{ attachment.filename }}]({{ attachment | attachment_link }})
```

To open in Zotero's native reader instead:

```liquid
- [{{ attachment.filename }}]({{ attachment | attachment_link: "zotero" }})
```

### Annotation Link (Jump to Specific Annotation)

```liquid
> [!zotflow-{{ annotation.type }}-{{ annotation.color }}] [{{ attachment.filename }}, p.{{ annotation.pageLabel }}]({{ annotation | annotation_link }})
```

With Zotero native reader:

```liquid
[{{ attachment.filename }}, p.{{ annotation.pageLabel }}]({{ annotation | annotation_link: "zotero" }})
```

### Item Link

```liquid
Related: [{{ related.title }}]({{ related | item_link }})
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
