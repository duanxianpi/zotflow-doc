---
sidebar_position: 12
---

# 模板 Filter 参考

ZotFlow 在模板引擎上注册了一系列自定义 Liquid filter——链接构造、HTML ↔ Markdown 转换、可编辑区、CSL 引用。本页是完整参考。context 变量见[模板变量与默认模板](template-variables.md)。

## 自定义 Filter

ZotFlow 在 LiquidJS 内置 filter 之上注册了以下自定义 filter：

### `process_nav_info`

适用模板：**所有类型**

将 annotation key 转为 URL-encoded JSON navigation 参数，用于构造 `obsidian://zotflow` deep link。

```liquid
{{ annotation.key | process_nav_info }}
```

输入：`"ABC12345"`
输出：`%7B%22annotationID%22%3A%22ABC12345%22%7D`

### `attachment_link`

适用模板：**Zotero Source Note**

生成打开附件的可点击链接。默认生成 ZotFlow 协议 URI（`obsidian://zotflow?type=open-attachment&...`），在 ZotFlow 内置阅读器中打开附件。传入 `"zotero"` 参数可生成原生 Zotero URI。

```liquid
{{ attachment | attachment_link }}
{{ attachment | attachment_link: "zotero" }}
```

### `annotation_link`

适用模板：**Zotero Source Note**

生成导航到具体 annotation 的可点击链接。默认生成 ZotFlow 协议 URI（`obsidian://zotflow?type=open-annotation&...`），在 ZotFlow reader 中打开父附件并导航到该 annotation。传入 `"zotero"` 参数可生成原生 Zotero URI。

```liquid
{{ annotation | annotation_link }}
{{ annotation | annotation_link: "zotero" }}
```

### `item_link`

适用模板：**Zotero Source Note**

生成条目的可点击链接。默认生成 ZotFlow 协议 URI（`obsidian://zotflow?type=open-note&...`），打开该条目的 Source Note。传入 `"zotero"` 参数可生成原生 Zotero `zotero://select/...` URI。

```liquid
{{ item | item_link }}
{{ related | item_link: "zotero" }}
```

> **自动检测**：使用 `"zotero"` 参数时，Zotero URL 前缀自动区分 group 库（`groups/<id>`）与个人库（`library`）。

### `html2md`

适用模板：**Zotero Source Note**

将 Zotero HTML（ProseMirror 格式）转换为 Markdown。处理数学公式、代码块、表格、图片、Zotero 的 wrapper div 属性。几乎总是与 `wrap_editable` 链式使用：

```liquid
{{ note.note | html2md | wrap_editable: "NOTE", note.key }}
```

> 此 filter 是 async 的，LiquidJS 自动以 Promise 求值。仅适用于 HTML 字符串。

### `wrap_editable`

适用模板：**Zotero Source Note**、**Local Source Note**（本地仅支持 `"ANNO"` 与 `"PERSIST"`）

将内容包裹在 ZotFlow editor extension 能识别的 hidden HTML comment marker 中，形成 editable region。

```liquid
{{ value | wrap_editable: "TYPE", key }}
```

| 参数     | 类型     | 说明                                                                                  |
| -------- | -------- | ------------------------------------------------------------------------------------- |
| `"TYPE"` | `string` | `"NOTE"` — Zotero 子笔记；`"ANNO"` — annotation comment；`"PERSIST"` — 仅存本地的 persist region |
| `key`    | `string` | 对应的 Zotero note key 或 annotation key；`"PERSIST"` 时为你自选的稳定 id             |

输出：输入字符串首尾被 `<!-- ZF_TYPE_BEG_key -->` / `<!-- ZF_TYPE_END_key -->` 标记包裹，标记独占一行。标记必须独占一行：以 HTML 注释*开头*的行会成为 CommonMark HTML block，与其同行的 Markdown 在阅读视图中会按原样文本渲染。

- **Note region**：`{{ note.note | html2md | wrap_editable: "NOTE", note.key }}`
- **Annotation comment region**：`{{ annotation.comment | wrap_editable: "ANNO", annotation.key }}`
- **Persist region**：`{{ "在这里写阅读笔记…" | wrap_editable: "PERSIST", "summary" }}`

annotation comment 在进入 template context 前已经过 `annoHtml2md` 轻量转换（`<b>`→`**`、`<i>`→`*`、`<sub>`/`<sup>` 保留、stray `<`/`>` 转义），因此直接 `| wrap_editable` 即可，不需要再过 `| html2md`。

**Persist region** 仅存本地：内容在每次 note 更新中存活，永不同步到 Zotero（完整行为见 [Source Note → Persist Region](source-notes.md#persist-region仅存本地的内容)）。与另外两种类型不同，它也可以在模板里直接手写等价的注释对：

```markdown
## 我的总结
<!-- ZF_PERSIST_BEG_summary -->

<!-- ZF_PERSIST_END_summary -->
```

Persist region 的 id 规则：

- id 由你自选（`summary`、`reading-todo` 等）。允许字符：字母、数字、`_`、`-`（最长 64）。
- id 必须**单个 note 内唯一**且**跨渲染稳定**——ZotFlow 靠 id 在每次更新时找回内容的位置。不要用循环变量生成 id，除非它是稳定的 Zotero key。
- 建议在 BEG 和 END marker 之间保留一个空行（filter 写法会自动生成）——它给空 region 一个明显的点击位置。marker 紧邻也能工作，只是插入点较难点中。

### `citation`（CSL）

适用模板：**Zotero Source Note** 与全部 **Citation** 模板（共用 library-note 引擎；local 模板不可用）

用 [citeproc](https://citeproc-js.readthedocs.io/) 按真实 CSL style 渲染引用（簇）。可接单个条目、条目列表或 annotation：

```liquid
{{ item | citation }}                          →  (Doe, 2020)
{{ item | citation: "ieee" }}                  →  [1]           （位置参数 = style id）
{{ item | citation: style: "apa", locale: "de-DE", format: "text" }}
{{ items | citation }}                         →  (Doe, 2020; Roe, 2021)
```

列表渲染为**一个引用簇**——合并、排序、分隔符由 style 规则决定。想要各自独立的引用才用 `for` 循环。

**Annotation 糖——自动页码定位。**管道里放 annotation 时自动引用其标注的文献（annotation → attachment → 顶层条目），`pageLabel` 作为 page locator，"p."/"pp." 单复数由 citeproc 与 locale 决定：

```liquid
{{ annotation | citation }}                    →  (Doe, 2020, p. 5)
{{ annotations | citation }}                   →  (Doe, 2020, p. 5; Roe, 2021, p. 12)
```

列表中可混放条目和 annotation，locator 逐元素生效。

**数据来源与样式管理：**见 [CSL 引用](csl-citations.md)——CSL-JSON 随同步存储（`item.csljson`，模板中也可直接读取）、旧条目懒回填，样式在 Activity Center 的 CSL 标签页管理。

**参数**（全部可选）：

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| 位置参数 / `style:` | 设置中的默认 style | style id，如 `"ieee"`、`"apa"` |
| `locale:` | style 声明的 default-locale → `en-US` | BCP-47，如 `"zh-CN"` |
| `format:` | 设置中的默认 format | `text` / `html` / `markdown` / `markdown-pure` |

未知参数名或非法 format 会报错并列出支持项。style 依赖链未闭合（缺 parent style 或 locale）时报可操作错误而非静默降级——去 Activity Center 补装即可。

**已知局限：**每次 filter 调用独立渲染，作者消歧不跨调用生效（两个 "Doe" 不会自动变成 "J. Doe"/"M. Doe"），*ibid.* 类位置感知形式不适用；显式 `locator:` 参数未实现——页码目前只经 annotation 糖进入。

### `bibliography`（CSL）

适用模板：**Zotero Source Note** 与全部 **Citation** 模板

为条目列表渲染参考文献表（单条也可）：

```liquid
{{ items | bibliography }}
{{ items | bibliography: style: "apa", join: "

" }}
{{ item  | bibliography: "ieee" }}             →  [1] A. Author, …
```

**必须整批一次传入**：排序和编号是 citeproc 对整个列表计算的——`for` 循环会让每条都输出 `[1]` 且排序失效。参数与 `citation` 相同，另加 `join:`（条目分隔符，默认 `"

"`）。

**实用配方：**

Note 类 style（Chicago full note）的脚注工作流——`citation` 输出即完整脚注体：

```liquid
[^{{ item.citationKey }}]: {{ item | citation: "chicago-note-bibliography" }}
```

Numbered style（IEEE）：单条渲染编号恒为 `[1]`，可确定性裁掉、编号交给 Obsidian 脚注：

```liquid
[^{{ item.citationKey }}]: {{ item | bibliography: "ieee" | remove_first: "[1] " }}
```

（非 numbered style 没有 `[1]` 前缀，`remove_first` 匹配不到就原样输出。）

相关文献列表：

```liquid
{% assign cited = item.relatedItems | where: "resolved", true %}
{% if cited.size > 0 %}
## References
{{ cited | bibliography: style: "apa" }}
{% endif %}
```

### `process_raw_anno_json`

适用模板：**Local Source Note**

将 raw annotation JSON 编码为 URL-encoded 字符串（已 strip 图片数据以压缩体积），用于 `%% ZOTFLOW_ANNO_..._BEG %%` comment marker 内部。

```liquid
{{ annotation.raw | process_raw_anno_json }}
```

---


---

## 相关页面

- [模板指南](template-guide.md)
- [模板变量与默认模板](template-variables.md)
