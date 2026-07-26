---
sidebar_position: 9
---

# CSL Citations

ZotFlow renders real citation styles — APA, IEEE, Chicago, and the thousands of others in the [CSL](https://citationstyles.org/) ecosystem — directly inside your templates, powered by the same [citeproc](https://citeproc-js.readthedocs.io/) engine word processors use. No external tools, no export step: a `citation` filter call in a template produces a correctly formatted citation, and `bibliography` produces a correctly sorted reference list.

```liquid
{{ item | citation }}                     →  (Doe, 2020)
{{ annotation | citation }}               →  (Doe, 2020, p. 5)
{{ items | bibliography: style: "apa" }}  →  a full, correctly sorted bibliography
```

This page covers the moving parts — styles, data, and settings. The full filter reference (parameters, footnote recipes, limitations) lives in [Template Filters](template-filters.md#citation-csl).

## Quick Start

1. Open **Settings → ZotFlow → CSL** and pick a **Default Style** and **Default Output Format** — every `citation` / `bibliography` call without explicit arguments uses them.
2. Use the filters in any Zotero Source Note or Citation template:

```liquid
{{ item | citation }}
{{ item | citation: "ieee" }}          {%- comment %} per-call style override {% endcomment %}
```

3. That's it — annotations cite their parent item automatically, with the page label as a proper CSL locator.

## Managing Styles

Styles are managed from the **Activity Center → CSL** tab:

- **Add by id** — type any style id from the [official repository](https://github.com/citation-style-language/styles) (e.g. `ieee`, `chicago-note-bibliography`) and get a live preview before adding. ZotFlow records where each style came from.
- **Dependent styles resolve themselves** — many journal styles are thin aliases of a parent style; ZotFlow fetches parents and required locales automatically, and removes them again when the last dependent style is deleted (reference-counted).
- **Custom styles** — drop `.csl` files into the folder configured under **Settings → CSL → Custom styles folder**; they appear in the list alongside repository styles.
- **Update everything** — one click re-fetches all repository styles; the bundled `en-US` locale is updatable too.

Styles with an unresolved dependency chain (missing parent or locale) produce an actionable error at render time instead of silently degrading — install the missing piece from the same tab.

## Citation Data

Rendering needs CSL-JSON for each item. ZotFlow keeps it transparently:

- **Synced items** store server-converted CSL-JSON automatically during every sync.
- **Items synced before this feature** are backfilled lazily the first time a filter references them (one small request per item; offline use raises a "run a sync" error instead of guessing).
- **Bulk refresh** — the command **"Update CSL citation data for all items"** re-fetches everything as a background task, visible and cancellable in the Activity Center's Tasks tab.
- Templates can also read the raw data directly: `{{ item.csljson.title }}`.

## Settings

| Setting | Purpose |
| --- | --- |
| **Default Style** | Style used when a filter call doesn't specify one |
| **Default Output Format** | `text` / `html` / `markdown` / `markdown-pure` |
| **Custom styles folder** | Vault folder scanned for your own `.csl` files |
| **Clear cache** | Drop cached style/locale downloads (they re-fetch on demand) |

## Related Pages

- [Template Filters — `citation` / `bibliography` reference](template-filters.md#citation-csl)
- [Citation & Writing Flow](citation-guide.md)
- [Template Guide](template-guide.md)
