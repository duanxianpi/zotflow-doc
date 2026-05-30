---
sidebar_position: 7
---

# 引用与写作流

ZotFlow 让你在写作现场快速插入可控格式的引用：从 Tree View 拖拽、在编辑器中输入触发词、从阅读器复制——三种路径，五种格式，annotation 上下文可带入模板。

引用由 LiquidJS 模板渲染（模板变量参考见[模板系统](template-guide.md#3-citation-模板)）。

---

## 引用格式

四种引用格式，各自对应一个可自定义的 LiquidJS 模板：

| 格式         | 示例输出                              | 说明                                                                          |
| ------------ | ------------------------------------- | ----------------------------------------------------------------------------- |
| **Pandoc**   | `[@smith2024, pp. 3, 7]`              | Pandoc 风格 citation key + 方括号。annotation 页码自动附加                    |
| **Footnote** | `[^smith2024]` + 文档末尾的定义       | Markdown 脚注。行内插入引用标记，定义文本追加到文档末尾                       |
| **Wikilink** | `[[Source/@smith2024\|Smith (2024)]]` | Obsidian wikilink 指向 Source Note。有 annotation 时指向具体 annotation block |
| **Citekey**  | `@smith2024`                          | 裸 citation key——不经模板处理，直接输出                                       |

如果 citation key（如 Better BibTeX 生成）未设置，回退使用 Zotero item key。

---

## 四种插入方式

### 1. Tree View 拖拽

1. 打开 **Zotero Tree View** 侧边栏
2. 拖拽任意非 note 条目（article、book 等）到编辑器中
3. ZotFlow 在 drop 位置以你的默认格式插入引用

拖拽时按住修饰键可临时切换格式（见下方[修饰键](#修饰键覆盖默认格式)）。

> 拖拽**附件**（PDF/EPUB）时插入的是打开附件的链接而非引用。

### 2. Citation Suggest（触发词建议框）

1. 在编辑器中输入触发词（默认 `@@`）
2. 搜索弹窗出现——输入关键词过滤 Zotero 库
3. 选中条目，按 **Enter** 插入引用

触发词可在 **Settings → Citation → Trigger Character** 中配置。

### 3. 阅读器复制

在阅读器中选中 annotation 后：

| 快捷键                                     | 行为                             |
| ------------------------------------------ | -------------------------------- |
| **Ctrl+C**（macOS: **Cmd+C**）             | 以默认格式复制引用到剪贴板       |
| **Ctrl+Shift+C**（macOS: **Cmd+Shift+C**） | 复制 annotation 原始文本到剪贴板 |

粘贴到任意编辑器或外部应用。

### 4. 阅读器右键菜单

在阅读器中右键选中的 annotation 可看到引用选项：

- **Copy Embed** — `![[Source/@smith2024#^annotationId]]`（指向 Source Note 中 annotation 的 block embed）
- **Copy Annotation Text** — 原始高亮文本
- **Copy Default Citation** — 使用默认引用格式
- **Copy Pandoc Citation**
- **Copy Footnote Citation**
- **Copy Wikilink Citation**

---

## 修饰键覆盖默认格式

拖拽（或 drop）时按住修饰键可临时覆盖默认引用格式：

| 修饰键                         | 格式                        |
| ------------------------------ | --------------------------- |
| _(不按)_                       | 默认格式（Settings 中设定） |
| **Shift**                      | Wikilink                    |
| **Alt**                        | Pandoc                      |
| **Ctrl** / **Cmd**             | Footnote                    |
| **Ctrl+Shift** / **Cmd+Shift** | Citekey（裸 key）           |

---

## Annotation 上下文如何进入引用

当你从阅读器复制引用且选中了 annotation，模板 context 中会包含 `annotations` 数组。模板可以利用这些数据拼接页码、生成指向 annotation block 的链接、按格式输出多条 annotation 等。

### 多条 Annotation 的行为

选中多条 annotation 复制时，默认模板的处理：

- **Pandoc**：去重拼接页码 → `[@smith2024, pp. 3, 7, 12]`
- **Wikilink**：为每条 annotation 生成独立 `[[note#^id|Author (year), p. X]]`，逗号分隔
- **Footnote**：默认模板不使用 annotation 数据（但可自定义）

### Embed 格式

Embed 格式为每条 annotation 生成指向 Source Note 中对应 block ID 的 Obsidian block-embed：

```
![[Source/@smith2024#^annotationKey]]
```

多条 annotation 时每条单独一行。

> Embed 需要 Source Note 存在且包含对应的 annotation block ID（`^annotationKey`）。ZotFlow 的默认模板会自动包含这些 block ID。

---

## 本地文件与库条目在引用行为上的差异

| 操作                       | 库条目          | 本地文件                      |
| -------------------------- | --------------- | ----------------------------- |
| **Ctrl+C** 复制 annotation | 默认格式引用    | Embed link（`![[path#^id]]`） |
| **Ctrl+Shift+C**           | Annotation 文本 | Annotation 文本               |
| 右键菜单                   | 全部格式        | 仅 Embed + Text               |
| Tree View 拖拽             | 多种引用格式    | 不适用                        |

本地文件没有 Zotero 元数据（citation key、creator 等），依赖 item 数据的引用模板不可用。此时 Ctrl+C 复制的是指向 local Source Note 中 annotation 的 embed link。

---

## 引用设置

在 **Settings → Citation** 中配置：

| 设置项                           | 说明                                   | 默认值                |
| -------------------------------- | -------------------------------------- | --------------------- |
| **Default Citation Format**      | 无修饰键时的引用格式                   | `footnote`            |
| **Trigger Character**            | 打开 citation suggest 弹窗的触发字符串 | `@@`                  |
| **Pandoc Template**              | Pandoc 引用的 LiquidJS 模板            | _(built-in fallback)_ |
| **Footnote Reference Template**  | 行内 `[^key]` 的模板                   | _(built-in fallback)_ |
| **Footnote Definition Template** | 脚注定义文本的模板                     | _(built-in fallback)_ |
| **Wikilink Template**            | Wikilink 引用的模板                    | _(built-in fallback)_ |

模板字段留空则使用 built-in 默认。默认模板源码见[模板系统](template-guide.md#3-citation-模板)。

---

## 常见问题

### 插入后格式不对

- 检查 **Default Citation Format** 设置
- 检查是否无意中按了修饰键覆盖了默认格式
- 检查对应格式的模板是否被自定义覆盖

### 页码没有出现

- Pandoc/Wikilink 模板需要 `annotations` 数组中的 `pageLabel`。确认复制时选中了 annotation
- 自定义模板可能未消费 `annotations` 中的 page 信息

### Wikilink 跳不到目标

- 目标条目的 Source Note 可能尚未生成。先手动创建一次（Tree View 右键 → Open source note），或拖拽条目触发自动创建
- 确认 Source Note 路径模板与实际文件路径一致

### 触发词不弹窗

- 检查 **Trigger Character** 设置是否被改为其他值
- 确认当前编辑器类型支持 suggestion 弹窗

---

## 相关页面

- [模板系统](template-guide.md)
- [阅读器与批注](reading-and-annotating.md)
- [Source Note](source-notes.md)
