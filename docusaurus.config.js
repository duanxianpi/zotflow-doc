// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from "prism-react-renderer";
import llmsTxtPlugin from "./src/plugins/llms-txt.js";

const SITE_URL = "https://zotflow.peterduan.dev";

// Structured data for search engines and AI answer engines.
const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#software`,
      name: "ZotFlow",
      description:
        "Obsidian plugin that integrates Zotero: two-way library sync, a built-in PDF/EPUB reader for annotating, templated literature notes, and citations in any CSL style.",
      applicationCategory: "ProductivityApplication",
      applicationSubCategory: "Obsidian plugin",
      operatingSystem: "Windows, macOS, Linux, iOS, Android",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      license: "https://www.gnu.org/licenses/agpl-3.0.html",
      url: `${SITE_URL}/`,
      downloadUrl: "https://community.obsidian.md/plugins/zotflow",
      softwareHelp: `${SITE_URL}/`,
      sameAs: ["https://github.com/duanxianpi/zotflow"],
      author: { "@type": "Person", name: "Xianpi Duan", url: "https://github.com/duanxianpi" },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "ZotFlow Documentation",
      url: `${SITE_URL}/`,
      inLanguage: ["en", "zh-CN"],
      about: { "@id": `${SITE_URL}/#software` },
    },
  ],
};

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "ZotFlow",
  tagline: "Keep your research in flow",
  favicon: "img/favicon.ico",

  headTags: [
    {
      tagName: "script",
      attributes: { type: "application/ld+json" },
      innerHTML: JSON.stringify(STRUCTURED_DATA),
    },
    {
      tagName: "link",
      attributes: { rel: "icon", type: "image/svg+xml", href: "/img/favicon.svg" },
    },
    {
      tagName: "link",
      attributes: { rel: "apple-touch-icon", href: "/img/apple-touch-icon.png" },
    },
  ],

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  markdown: {
    mermaid: true,
  },
  themes: ["@docusaurus/theme-mermaid"],
  plugins: [llmsTxtPlugin],

  // Set the production url of your site here
  url: SITE_URL,
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",
  // Cloudflare serves getting-started.html at /getting-started, so URLs,
  // canonicals and the sitemap all match without a redirect.
  trailingSlash: false,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "duanxianpi", // Usually your GitHub org/user name.
  projectName: "zotflow", // Usually your repo name.

  onBrokenLinks: "throw",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh".
  i18n: {
    defaultLocale: "en",
    locales: ["en", "zh"],
    localeConfigs: {
      en: { label: "English" },
      zh: { label: "简体中文", htmlLang: "zh-CN" },
    },
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: "/",
          sidebarPath: "./sidebars.js",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          // "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
        sitemap: {
          lastmod: "date",
          changefreq: "weekly",
          priority: 0.5,
          ignorePatterns: ["/tags/**"],
          filename: "sitemap.xml",
          createSitemapItems: async (params) => {
            const { defaultCreateSitemapItems, ...rest } = params;
            const items = await defaultCreateSitemapItems(rest);
            return items.filter((item) => !item.url.includes("/page/"));
          },
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: "img/social-card.png",
      metadata: [
        {
          name: "keywords",
          content:
            "Zotero, Obsidian, Obsidian plugin, Zotero Obsidian integration, literature notes, PDF annotation, citation manager, CSL, research workflow, ZotFlow",
        },
        { name: "author", content: "Xianpi Duan" },
      ],
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        logo: {
          alt: "ZotFlow",
          src: "img/zotflow-light.svg",
          srcDark: "img/zotflow-dark.svg",
          width: 107,
          height: 32,
        },
        items: [
          // {
          //   type: "docSidebar",
          //   sidebarId: "tutorialSidebar",
          //   position: "left",
          //   label: "Documentation",
          // },
          // { to: "/blog", label: "Blog", position: "left" },
          { type: "localeDropdown", position: "right" },
          {
            href: "https://github.com/duanxianpi/zotflow",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        logo: {
          alt: "ZotFlow",
          src: "img/zotflow-dark.svg",
          width: 120,
          height: 36,
        },
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Documentation",
                to: "/",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Discord",
                href: "https://discord.gg/7vNrR6qhVr",
              },
              {
                label: "Obsidian Community",
                href: "https://community.obsidian.md/plugins/zotflow",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "GitHub",
                href: "https://github.com/duanxianpi/zotflow",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Xianpi Duan. Built with Docusaurus.`,
      },
      prism: {
        // Token colours from GitHub / One Dark; backgrounds from the site's
        // warm surface and Obsidian's neutral dark.
        theme: {
          ...prismThemes.github,
          plain: { ...prismThemes.github.plain, backgroundColor: "#f4f1ec" },
        },
        darkTheme: {
          ...prismThemes.oneDark,
          plain: { ...prismThemes.oneDark.plain, backgroundColor: "#262626" },
        },
      },
      mermaid: {
        theme: { light: "neutral", dark: "dark" },
      },
    }),
};

export default config;
