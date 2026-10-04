---
sidebar_position: 9
description: "用 citeproc 在 Obsidian 中渲染 APA、IEEE、Chicago 等数千种 CSL 引文格式和参考文献列表。"
---

# CSL 引用

ZotFlow 在模板内直接渲染真实的引用样式——APA、IEEE、Chicago 以及 [CSL](https://citationstyles.org/) 生态里的数千种样式——由文字处理器同款的 [citeproc](https://citeproc-js.readthedocs.io/) 引擎驱动。无需外部工具、无需导出步骤：模板里一个 `citation` filter 调用产出格式正确的引用，`bibliography` 产出排序正确的参考文献表。

```liquid
{{ item | citation }}                     →  (Doe, 2020)
{{ annotation | citation }}               →  (Doe, 2020, p. 5)
{{ items | bibliography: style: "apa" }}  →  完整且正确排序的参考文献表
```

本页讲清三个组成部分——样式、数据、设置。完整的 filter 参考（参数、脚注配方、局限）见[模板 Filter 参考](template-filters.md#citationcsl)。

## 快速开始

1. 打开 **Settings → ZotFlow → CSL**，选择 **Default Style** 与 **Default Output Format**——所有未显式传参的 `citation` / `bibliography` 调用都使用它们。
2. 在任意 Zotero Source Note 或 Citation 模板中使用 filter：

```liquid
{{ item | citation }}
{{ item | citation: "ieee" }}          {%- comment %} 单次调用覆盖 style {% endcomment %}
```

3. 就这样——annotation 自动引用其父条目，页码作为规范的 CSL locator。

## 管理样式

样式在 **Activity Center → CSL** 标签页管理：

- **按 id 添加**——输入[官方仓库](https://github.com/citation-style-language/styles)中任意样式的 id（如 `ieee`、`chicago-note-bibliography`），添加前有实时预览。每个样式的来源都有记录。
- **依赖样式自动解析**——许多期刊样式只是某个 parent 样式的薄别名；ZotFlow 自动获取 parent 与所需 locale，并在最后一个依赖它的样式被删除时一并移除（引用计数）。
- **自定义样式**——把 `.csl` 文件放进 **Settings → CSL → Custom styles folder** 配置的文件夹，它们会与仓库样式并列出现。
- **一键全量更新**——重新获取所有仓库样式；内置的 `en-US` locale 也可更新。

依赖链未闭合的样式（缺 parent 或 locale）在渲染时报可操作错误而非静默降级——在同一标签页补装即可。

## 引用数据

渲染需要每个条目的 CSL-JSON，ZotFlow 透明维护：

- **已同步条目**在每次同步时自动存储服务端转换的 CSL-JSON。
- **此功能之前同步的条目**在 filter 首次引用时懒回填（每条一个小请求；离线时报「run a sync」错误而不是瞎猜）。
- **批量刷新**——命令 **"Update CSL citation data for all items"** 以后台任务全量重取，Activity Center 的 Tasks 页可见进度、可取消。
- 模板也能直接读原始数据：`{{ item.csljson.title }}`。

## 设置

| 设置项 | 用途 |
| --- | --- |
| **Default Style** | filter 未指定 style 时使用 |
| **Default Output Format** | `text` / `html` / `markdown` / `markdown-pure` |
| **Custom styles folder** | 扫描你自己 `.csl` 文件的 vault 文件夹 |
| **Clear cache** | 清空样式/locale 下载缓存（用到时重新获取） |

## 相关页面

- [模板 Filter 参考——`citation` / `bibliography`](template-filters.md#citationcsl)
- [引用与写作流](citation-guide.md)
- [模板指南](template-guide.md)
