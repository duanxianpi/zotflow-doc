---
sidebar_position: 4
---

# 阅读器与批注

ZotFlow 内置了一个阅读器——使用与 Zotero 相同的 PDF/EPUB/HTML 渲染引擎，且主题匹配 Obsidian。你可以在不离开 Obsidian 的情况下完成文献阅读与批注。

---

## 打开附件

### 方式 1：Tree View

1. 打开 **Zotero Tree View**（命令面板 → `ZotFlow: Open Zotero Tree View`）
2. 展开 Library → Collection → Item
3. **双击**附件（PDF、EPUB 或 HTML）在阅读器中打开

如果附件已在另一标签页打开，ZotFlow 会激活已有标签页而非重复打开。

### 方式 2：Search Modal

1. 点击左侧 ribbon 图标，或命令面板运行 `ZotFlow: Search Zotero Library`
2. 输入关键词搜索库内条目
3. 方向键导航，在附件结果上按 **Enter** 打开

### 方式 3：Protocol URI

可从外部或笔记内通过 URI 跳转到附件或 Source Note：

```
obsidian://zotflow?type=open-attachment&libraryID=<id>&key=<key>
obsidian://zotflow?type=open-note&libraryID=<id>&key=<key>
```

附加 `&navigation=<json>` 可跳转到指定页面或 annotation。

---

## 批注类型

阅读器支持以下 annotation 类型：

| 类型          | 说明                           |
| ------------- | ------------------------------ |
| **Highlight** | 选中文本，应用彩色高亮         |
| **Underline** | 选中文本，应用彩色下划线       |
| **Note**      | 在页面任意位置放置 sticky note |
| **Image**     | 矩形框选截取页面区域为图片     |
| **Ink**       | 自由手写/手绘                  |
| **Eraser**    | 擦除 ink annotation 的局部     |

每条 annotation 可附带：

- **颜色**（阅读器调色板）
- **评论**（对高亮段落的批注文字）
- **标签**（从 Zotero 继承）

---

## Library Reader vs Local Reader

### Library Reader（Zotero 附件）

- 打开从 Zotero 库同步的附件
- Annotation 在 bidirectional sync 时回写到 Zotero

### Local Reader（vault 本地文件）

- 打开 vault 内的 PDF/EPUB/HTML 文件（非 Zotero 来源）
- Annotation 存入 co-located `.zf.json` sidecar 文件——不发送到 Zotero
- 启用方式：**Settings → ZotFlow → General → Overwrite PDF/EPUB/HTML Viewer** → 开启 → **重启 Obsidian**
- 启用后，vault 内所有 PDF/EPUB/HTML 自动用 ZotFlow reader 打开

| 操作                            | Library File                                                 | Local File                          |
| ------------------------------- | ------------------------------------------------------------ | ----------------------------------- |
| 选中 annotation 按 Ctrl+C       | 默认格式的引用                                               | Embed link (`![[path#^id]]`)        |
| 选中 annotation 按 Ctrl+Shift+C | Annotation 原始文本                                          | Annotation 原始文本                 |
| 右键菜单                        | 全部格式（embed、text、pandoc、footnote、wikilink、default） | 仅 embed + text                     |
| Tree View 拖拽                  | 支持各种引用格式                                             | 不适用（本地文件不在 Tree View 中） |

---

## Annotation 图片提取

针对 **image** 和 **ink** 类型 annotation，ZotFlow 可自动提取视觉内容并保存为 PNG。

### 配置

1. **Settings → ZotFlow → General**
2. 开启 **Auto Import Annotation Images**
3. 设置 **Annotation Image Folder**（如 `Attachments/ZotFlow`）

### 行为

- 当 Source Note 被创建或更新时，image/ink annotation 从 PDF 中提取，保存为 `<annotation-key>.png` 到指定目录
- Source Note 中嵌入：
  ```markdown
  > > ![[Attachments/ZotFlow/ANNOTATION_KEY.png]]
  ```
- 也可在 Tree View 中手动触发：右键条目 → **Extract annotation images**

---

## Tree View 拖拽行为

从 Tree View 拖拽到编辑器：

| 拖拽对象                  | 插入内容                                                                 |
| ------------------------- | ------------------------------------------------------------------------ |
| **附件**（PDF/EPUB/HTML） | Markdown link：`[filename](obsidian://zotflow?type=open-attachment&...)` |
| **普通条目**              | 引用（格式取决于引用设置和修饰键）                                       |

拖拽普通条目同时会触发 Source Note 的创建/更新，确保引用目标存在且是最新。

---

## Tree View 右键菜单

| 右键目标                  | 操作                                    | 说明                                   |
| ------------------------- | --------------------------------------- | -------------------------------------- |
| **Collection 或 Library** | Create source note for all child items  | 批量为该节点下所有条目创建 Source Note |
| **Collection 或 Library** | Extract anno images for all child items | 批量提取 annotation 图片               |
| **顶层条目**（非附件）    | Open source note                        | 打开（并强制更新）该条目的 Source Note |
| **顶层条目**（非附件）    | Extract annotation images               | 提取该条目的 annotation 图片           |

---

## 常见边界

### 附件打不开

- 检查附件是否已缓存或可下载（网络 + 附件存储方案）
- 检查 WebDAV / Zotero Storage 配置
- 确认 attachment 文件在 Zotero 中确实存在

### Annotation 改动了但 Zotero 没更新

- 库必须为 Bidirectional 模式
- API Key 必须有 write 权限
- 手动触发一次 sync

### 本地文件 annotation 不同步到 Zotero

- 这是设计行为：Local Reader 的 annotation 本来就不回写 Zotero，它们只存 `.zf.json`

### 重复打开同一附件

- ZotFlow 会检测是否已在其他标签页打开，自动 focus 已有标签页

---

## 相关页面

- [Source Note](source-notes.md)
- [引用与写作流](citation-guide.md)
- [工作模型总览](concepts.md)
