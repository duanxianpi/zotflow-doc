// @ts-check
// Writes llms.txt (an index of the docs) and llms-full.txt (every doc as plain
// Markdown) into each locale's build, following https://llmstxt.org.
// Runs in Node at build time.

import fs from "node:fs/promises";
import path from "node:path";

const INTRO = {
  en: {
    summary:
      "ZotFlow is a free, open-source Obsidian plugin that integrates Zotero: it syncs your Zotero library into Obsidian (two-way), embeds Zotero's PDF/EPUB/HTML reader for annotating, renders a templated Markdown Source Note for every item, and inserts citations (Pandoc, footnote, wikilink, citekey, or any CSL style).",
    details:
      "Zotero stays the source of truth for the library; Obsidian is where reading, note-taking and writing happen. Annotations, Item Notes and edits sync back to Zotero. Local PDFs/EPUBs in the vault can be annotated too; their annotations stay in a `.zf.json` sidecar file. Install it from Obsidian → Settings → Community plugins → Browse → \"ZotFlow\".",
    docs: "Docs",
    releases: "Optional",
    source: "Source code: https://github.com/duanxianpi/zotflow (AGPL-3.0)",
  },
  zh: {
    summary:
      "ZotFlow 是免费开源的 Obsidian 插件，用于集成 Zotero：把 Zotero 文献库双向同步到 Obsidian，内嵌 Zotero 的 PDF/EPUB/HTML 阅读器用于批注，为每个条目按模板生成 Markdown 来源笔记，并插入引用（Pandoc、脚注、双链、citekey 或任意 CSL 格式）。",
    details:
      "Zotero 始终是文献库的权威来源，阅读、做笔记和写作在 Obsidian 中完成。批注、条目笔记和编辑会同步回 Zotero。库中的本地 PDF/EPUB 也能批注，批注保存在同目录的 `.zf.json` 文件中。安装方式：Obsidian → 设置 → 第三方插件 → 浏览 → 搜索 \"ZotFlow\"。",
    docs: "文档",
    releases: "Optional",
    source: "源代码：https://github.com/duanxianpi/zotflow（AGPL-3.0）",
  },
};

function parseFrontMatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return { data: {}, body: raw };
  const data = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) data[kv[1]] = kv[2].replace(/^"(.*)"$/, "$1").replace(/\\"/g, '"');
  }
  return { data, body: raw.slice(m[0].length) };
}

/** Drops MDX-only lines (imports, <head>, JSX components) from a doc body. */
function toPlainMarkdown(body) {
  return body
    .replace(/^import .*$/gm, "")
    .replace(/<head>[\s\S]*?<\/head>/g, "")
    .replace(/^<[A-Z]\w*[\s\S]*?\/>\s*$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Rewrites relative doc links such as `(concepts.md#loop)` to absolute URLs. */
function absolutizeLinks(body, abs) {
  return body.replace(
    /\]\((?!https?:|#)([\w./-]+?)\.mdx?(#[^)]*)?\)/g,
    (_, file, hash = "") => `](${abs(`/${file.replace(/^\.\//, "")}`)}${hash})`,
  );
}

async function readDocs(dir, routePrefix) {
  const out = [];
  for (const name of await fs.readdir(dir)) {
    if (!/\.mdx?$/.test(name)) continue;
    const raw = await fs.readFile(path.join(dir, name), "utf8");
    const { data, body } = parseFrontMatter(raw);
    const h1 = body.match(/^# (.+)$/m)?.[1];
    const id = name.replace(/\.mdx?$/, "");
    out.push({
      title: data.title ?? h1 ?? id,
      description: data.description ?? "",
      position: Number(data.sidebar_position ?? 999),
      route: data.slug ?? `${routePrefix}${id}`,
      body: toPlainMarkdown(body),
    });
  }
  return out.sort((a, b) => a.position - b.position);
}

/** @type {import('@docusaurus/types').PluginModule} */
export default function llmsTxtPlugin(context) {
  return {
    name: "llms-txt",
    async postBuild({ outDir }) {
      const { siteDir, siteConfig, baseUrl, i18n } = context;
      const locale = i18n.currentLocale;
      const text = INTRO[locale] ?? INTRO.en;
      const docsDir =
        locale === i18n.defaultLocale
          ? path.join(siteDir, "docs")
          : path.join(siteDir, "i18n", locale, "docusaurus-plugin-content-docs", "current");

      const origin = siteConfig.url.replace(/\/$/, "");
      const abs = (route) => {
        const p = `${baseUrl}${route.replace(/^\//, "")}`;
        return `${origin}${p === "/" ? "/" : p}`;
      };

      const docs = await readDocs(docsDir, "/");
      const releases = (await readDocs(path.join(docsDir, "releases"), "/releases/")).sort(
        (a, b) => b.route.localeCompare(a.route, undefined, { numeric: true }),
      );

      const link = (d) => `- [${d.title}](${abs(d.route)})${d.description ? `: ${d.description}` : ""}`;
      const index = [
        `# ${siteConfig.title}`,
        "",
        `> ${text.summary}`,
        "",
        text.details,
        "",
        text.source,
        "",
        `## ${text.docs}`,
        "",
        ...docs.map(link),
        "",
        `## ${text.releases}`,
        "",
        ...releases.map(link),
        "",
      ].join("\n");

      const full = [
        `# ${siteConfig.title}`,
        "",
        `> ${text.summary}`,
        "",
        text.details,
        "",
        ...docs.flatMap((d) => ["---", "", `Source: ${abs(d.route)}`, "", absolutizeLinks(d.body, abs), ""]),
      ].join("\n");

      await fs.writeFile(path.join(outDir, "llms.txt"), index);
      await fs.writeFile(path.join(outDir, "llms-full.txt"), full);
    },
  };
}
