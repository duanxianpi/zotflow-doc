<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="static/img/zotflow-dark.svg">
    <img src="static/img/zotflow-light.svg" alt="ZotFlow" width="280">
  </picture>
</p>

# ZotFlow Documentation

Source of [zotflow.peterduan.dev](https://zotflow.peterduan.dev), the documentation site for the [ZotFlow](https://github.com/duanxianpi/zotflow) Obsidian plugin. Built with [Docusaurus](https://docusaurus.io/) and hosted on Cloudflare Workers (static assets).

## Development

```bash
npm install
npm start                  # dev server, English
npm start -- --locale zh   # dev server, Chinese
```

The dev server serves one locale at a time. To check both locales and the language switcher, build and serve:

```bash
npm run build
npm run serve
```

## Deployment

```bash
npm run preview   # build, then run the Cloudflare Worker locally (wrangler dev)
npm run deploy    # build, then wrangler deploy
```

## Layout

| Path | Contents |
| --- | --- |
| `docs/` | English docs. The sidebar is generated from `sidebar_position`. |
| `docs/releases/` | Release notes, one file per version. |
| `i18n/zh/docusaurus-plugin-content-docs/current/` | Chinese translations, same file names as `docs/`. |
| `i18n/zh/docusaurus-theme-classic/` | Chinese navbar and footer strings. |
| `src/css/custom.css` | Theme: colours from the wordmark (Zotero red, Obsidian violet, ink). |
| `src/components/DocHero.js` | Logo hero on the home page. |
| `src/plugins/llms-txt.js` | Writes `llms.txt` / `llms-full.txt` per locale at build time. |
| `static/img/` | Wordmark, favicon, social card. |

## Writing docs

- Give every page a `description` in its front matter (one sentence, about 150 characters). It becomes the search snippet, the link preview and the line in `llms.txt`.
- Add the Chinese translation of a new page under `i18n/zh/.../current/` with the same file name.
- Link between docs with relative `.md` paths (`[Source Notes](source-notes.md)`). The build fails on broken links.

## SEO and AI search

- `trailingSlash: false` matches how Cloudflare serves `page.html` at `/page`, so canonical URLs, the sitemap and internal links have no redirects.
- `static/robots.txt` points to both locales' sitemaps.
- `docusaurus.config.js` adds keywords and schema.org structured data (`SoftwareApplication` + `WebSite`).
- `/llms.txt` and `/zh/llms.txt` index the docs for LLM-based search; `llms-full.txt` has every doc as plain Markdown.
