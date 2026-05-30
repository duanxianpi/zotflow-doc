---
sidebar_position: 8
---

# 模板系统总览与变量参考

ZotFlow 的几乎所有用户可见输出都由模板驱动。你不需要等 feature request——直接改模板即可控制 Source Note 内容、引用格式、文件路径、批注渲染方式。

模板引擎是 [LiquidJS](https://liquidjs.com)，语法兼容 Shopify Liquid。

## 模板系统的四个入口

| 模板类型               | 控制什么                                                  | 设置位置                                                           |
| ---------------------- | --------------------------------------------------------- | ------------------------------------------------------------------ |
| **Zotero Source Note** | 库条目的 Source Note 正文                                 | Settings → General → Template Path                                 |
| **Local Source Note**  | 本地文件的 Source Note 正文                               | Settings → General → Local Source Note Template                    |
| **Citation**           | Pandoc / Wikilink / Footnote / Citekey 五种引用格式的输出 | Settings → Citation                                                |
| **Path**               | Source Note 文件的落点路径                                | Settings → General → Note Path Template / Local Note Path Template |

所有模板类型共用同一个 LiquidJS 引擎，但各自暴露不同的 context 变量。留空任一模板路径则回退到 built-in 默认模板。

## LiquidJS 速查

模板由以下元素构成：

- **输出标签** `{{ variable }}` — 插入变量值
- **逻辑标签** `{% if condition %} ... {% endif %}` — 条件分支
- **循环** `{% for item in array %} ... {% endfor %}` — 遍历数组
- **过滤器** `{{ value | filter_name }}` — 值变换（如 `| json`、`| default: "fallback"`、`| slice: 0, 4`）
- **空白控制** `{%-` 和 `-%}` — 修剪前后空白，避免输出多余换行
- **变量捕获** `{% capture var %}...{% endcapture %}` — 将一段内容赋值给变量

全局可用变量：

| 变量      | 类型     | 说明                                                 |
| --------- | -------- | ---------------------------------------------------- |
| `newline` | `string` | 字面换行符 `"\n"`，用于 `replace` 过滤器处理多行文本 |

---

## 1. Zotero Source Note 模板

控制 Zotero 库条目的 Source Note 正文。context 为 `{ item, settings }`。

### `item` — Zotero 条目

| 变量                         | 类型                      | 说明                                                         |
| ---------------------------- | ------------------------- | ------------------------------------------------------------ |
| `item.key`                   | `string`                  | Zotero item key                                              |
| `item.version`               | `number`                  | 条目版本号，用于增量更新检测                                 |
| `item.libraryID`             | `number`                  | 库 ID                                                        |
| `item.citationKey`           | `string`                  | Citation key（如 Better BibTeX 生成），未设置则为空串        |
| `item.itemType`              | `string`                  | 条目类型（`"journalArticle"`、`"book"` 等）                  |
| `item.title`                 | `string`                  | 标题                                                         |
| `item.creators`              | `Array<{ name: string }>` | 作者列表，`name` 为组合后的全名                              |
| `item.date`                  | `string \| null`          | 出版日期字符串（Zotero 中填写的原始值）                      |
| `item.dateAdded`             | `string`                  | ISO 时间戳，条目添加到 Zotero 的时间                         |
| `item.dateModified`          | `string`                  | ISO 时间戳，最后修改时间                                     |
| `item.accessDate`            | `string \| null`          | 最后访问日期                                                 |
| `item.abstractNote`          | `string \| undefined`     | 摘要                                                         |
| `item.publicationTitle`      | `string \| undefined`     | 期刊/会议名                                                  |
| `item.publisher`             | `string \| undefined`     | 出版社                                                       |
| `item.place`                 | `string \| undefined`     | 出版地                                                       |
| `item.volume`                | `string \| undefined`     | 卷                                                           |
| `item.issue`                 | `string \| undefined`     | 期                                                           |
| `item.pages`                 | `string \| undefined`     | 页码范围                                                     |
| `item.series`                | `string \| undefined`     | 系列名                                                       |
| `item.seriesNumber`          | `string \| undefined`     | 系列编号                                                     |
| `item.edition`               | `string \| undefined`     | 版次                                                         |
| `item.url`                   | `string \| undefined`     | URL                                                          |
| `item.DOI`                   | `string \| undefined`     | DOI                                                          |
| `item.ISBN`                  | `string \| undefined`     | ISBN                                                         |
| `item.ISSN`                  | `string \| undefined`     | ISSN                                                         |
| `item.tags`                  | `Array<{ tag, type? }>`   | 标签列表                                                     |
| `item.itemPaths`             | `string[]`                | 条目所在的 collection 路径数组（如 `["Research/ML"]`）       |
| `item.attachments`           | `AttachmentContext[]`     | 子附件列表（PDF 等）                                         |
| `item.annotations`           | `AnnotationContext[]`     | 直接在条目上的 annotation（仅 standalone attachment 条目有） |
| `item.attachmentAnnotations` | `AnnotationContext[]`     | 所有 attachment 下 annotation 的扁平汇总                     |
| `item.notes`                 | `NoteContext[]`           | Zotero 子笔记列表                                            |
| `item.relatedItems`          | `RelatedItemContext[]`    | Zotero "Related" 关联条目列表                                |

### `item.attachments[]` — 附件子对象

| 变量                      | 类型                    | 说明                                |
| ------------------------- | ----------------------- | ----------------------------------- |
| `attachment.key`          | `string`                | Attachment item key                 |
| `attachment.libraryID`    | `number`                | 库 ID                               |
| `attachment.filename`     | `string`                | 文件名（如 `"paper.pdf"`）          |
| `attachment.contentType`  | `string`                | MIME 类型（如 `"application/pdf"`） |
| `attachment.tags`         | `Array<{ tag, type? }>` | 标签                                |
| `attachment.dateAdded`    | `string`                | ISO 时间戳                          |
| `attachment.dateModified` | `string`                | ISO 时间戳                          |
| `attachment.annotations`  | `AnnotationContext[]`   | 该附件上的 annotation 列表          |

### `item.notes[]` — 子笔记

| 变量                | 类型                    | 说明                                     |
| ------------------- | ----------------------- | ---------------------------------------- |
| `note.key`          | `string`                | Note item key                            |
| `note.libraryID`    | `number`                | 库 ID                                    |
| `note.title`        | `string`                | 笔记标题（首行或空）                     |
| `note.note`         | `string`                | 笔记完整 HTML（Zotero ProseMirror 格式） |
| `note.tags`         | `Array<{ tag, type? }>` | 标签                                     |
| `note.dateAdded`    | `string`                | ISO 时间戳                               |
| `note.dateModified` | `string`                | ISO 时间戳                               |

### `item.relatedItems[]` — 关联条目

来自 Zotero 的 Related 标签页（`dc:relation`）。每条记录对应一个关联 URI。`key` 和 `libraryID` 始终从 URI 解析得到；其余字段仅在关联条目已存在于本地数据库时才填充。

| 变量              | 类型                  | 说明                                                     |
| ----------------- | --------------------- | -------------------------------------------------------- |
| `rel.key`         | `string`              | 关联条目的 Zotero item key                               |
| `rel.libraryID`   | `number`              | 从 relation URI 解析的库 ID                              |
| `rel.resolved`    | `boolean`             | 条目是否在本地数据库中（`false` 表示跨库/未同步/已删除） |
| `rel.title`       | `string \| undefined` | 标题（仅 resolved 时）                                   |
| `rel.itemType`    | `string \| undefined` | 条目类型（仅 resolved 时）                               |
| `rel.citationKey` | `string \| undefined` | Citation key（仅 resolved 时）                           |
| `rel.notePath`    | `string \| undefined` | 该条目 Source Note 在 vault 中的路径（仅 resolved 时）   |

跨库或未同步的关联条目仍会出现在列表中（`resolved: false`），可用于占位提示。用 `{% if rel.resolved %}` 或 `{% if rel.title %}` 过滤。

### `item.annotations[]` / `attachment.annotations[]` — Annotation

| 变量                      | 类型                    | 说明                                                                               |
| ------------------------- | ----------------------- | ---------------------------------------------------------------------------------- |
| `annotation.key`          | `string`                | Annotation item key                                                                |
| `annotation.libraryID`    | `number`                | 库 ID                                                                              |
| `annotation.type`         | `string`                | 类型：`"highlight"`、`"note"`、`"image"`、`"ink"`                                  |
| `annotation.authorName`   | `string \| undefined`   | 批注作者                                                                           |
| `annotation.text`         | `string \| null`        | 高亮文本（`>` 和 `<` 已转义）                                                      |
| `annotation.comment`      | `string \| undefined`   | 批注评论（已转 Markdown：`<b>`→`**`、`<i>`→`*`、`<sub>`/`<sup>` 保留 inline HTML） |
| `annotation.color`        | `string \| undefined`   | 十六进制颜色（如 `"#ffd400"`）                                                     |
| `annotation.pageLabel`    | `string \| undefined`   | 页码标签                                                                           |
| `annotation.tags`         | `Array<{ tag, type? }>` | 标签                                                                               |
| `annotation.dateAdded`    | `string`                | ISO 时间戳                                                                         |
| `annotation.dateModified` | `string`                | ISO 时间戳                                                                         |
| `annotation.raw`          | `AnnotationJSON`        | 原始 annotation 对象，配合 `process_nav_info` filter 使用                          |

### `settings` — 插件配置

`ZotFlowSettings` 全量暴露，常用：

| 变量                             | 类型     | 说明                  |
| -------------------------------- | -------- | --------------------- |
| `settings.annotationImageFolder` | `string` | 批注图片输出目录      |
| `settings.sourceNoteFolder`      | `string` | 默认 Source Note 目录 |

### 默认模板

不配置自定义模板时使用以下 built-in 模板：

```liquid
---
citationKey: {{ item.citationKey | json }}
title: {{ item.title | json }}
itemType: {{ item.itemType | json }}
creators: [{% for c in item.creators %}"{{ c.name }}"{% unless forloop.last %}, {% endunless %}{% endfor %}]
publication: {{ item.publicationTitle | default: item.publisher | json }}
date: {{ item.date | json }}
year: {{ item.date | slice: 0, 4 }}
url: {{ item.url | json }}
doi: {{ item.DOI | json }}
---
{%- capture quote_string %}{{ newline }}> {% endcapture -%}
{%- capture quote_string_2 %}{{ newline }}> >{% endcapture -%}
# {{ item.title }}
{%- if item.abstractNote -%}
## Abstract
> {{ item.abstractNote | replace: newline, quote_string }}

{%- endif -%}
{%- if item.attachments.length > 0 -%}
## Attachments
{%- for attachment in item.attachments -%}
- [{{ attachment.filename }}](obsidian://zotflow?type=open-attachment&libraryID={{ attachment.libraryID }}&key={{ attachment.key }})
{%- endfor -%}

{%- endif -%}
{%- if item.notes.length > 0 -%}
## Notes
{%- for note in item.notes -%}
### {{ note.title | default: "Note" }}
{{ note.note }}
{%- endfor -%}

{%- endif -%}
{%- if item.attachments.length > 0 and item.attachmentAnnotations.length > 0 -%}
## Annotations
{%- for attachment in item.attachments -%}
{%- if attachment.annotations.length > 0 -%}
### {{ attachment.filename }}
{%- for annotation in attachment.annotations -%}
> [!zotflow-{{ annotation.type }}-{{ annotation.color }}] [{{ attachment.filename }}, p.{{ annotation.pageLabel }}](obsidian://zotflow?type=open-attachment&libraryID={{ attachment.libraryID }}&key={{ attachment.key }}&navigation={{ annotation.key | process_nav_info}})
{%- if annotation.type == "ink" or annotation.type == "image"-%}
> > ![[{{settings.annotationImageFolder}}/{{ annotation.key }}.png]]
{%- else -%}
> > {{ annotation.text | replace: newline, quote_string_2 }}
{%- endif -%}
{%- if annotation.comment != "" -%}
>
> {{ annotation.comment | replace: newline, quote_string }}
{%- endif -%}^{{ annotation.key }}

{%- endfor -%}
{%- endif -%}
{%- endfor -%}
{%- endif -%}
{%- if item.attachments.length == 0 and item.itemType == "attachment" and item.annotations.length > 0 -%}
## Annotations
{%- for annotation in item.annotations -%}
> [!zotflow-{{ annotation.type }}-{{ annotation.color }}] [{{ item.title }}, p.{{ annotation.pageLabel }}](obsidian://zotflow?type=open-attachment&libraryID={{ item.libraryID }}&key={{ item.key }}&navigation={{ annotation.key | process_nav_info}})
{%- if annotation.type == "ink" or annotation.type == "image"-%}
> > ![[{{settings.annotationImageFolder}}/{{ annotation.key }}.png]]
{%- else -%}
> > {{ annotation.text | replace: newline, quote_string_2 }}
{%- endif -%}
{%- if annotation.comment != "" -%}
>
> {{ annotation.comment | replace: newline, quote_string }}
{%- endif -%}^{{ annotation.key }}

{%- endfor -%}
{%- endif -%}
```

1. **frontmatter** — 输出 `citationKey`、`title`、`itemType`、`creators`、`publication`、`date`、`year`、`url`、`doi`
2. **标题** — `# 标题`
3. **摘要** — 以 blockquote 格式渲染
4. **附件** — Obsidian URI 链接列表
5. **子笔记** — 每个 note 渲染为一个 `### 标题` + `{{ note.note }}` 转 Markdown 的 section
6. **批注** — 按 attachment 分组，使用 `[!zotflow-<type>-<color>]` callout 渲染，annotation comment 包裹为 editable region

---

## 2. Local Source Note 模板

控制 vault 内本地文件（PDF/EPUB/HTML）的 Source Note。context 为 `{ item, settings, path }`。

### `item` — 本地文件

| 变量               | 类型                | 说明                                        |
| ------------------ | ------------------- | ------------------------------------------- |
| `item.name`        | `string`            | 完整文件名（如 `"paper.pdf"`）              |
| `item.path`        | `string`            | vault 相对路径（如 `"Articles/paper.pdf"`） |
| `item.extension`   | `string`            | 扩展名（如 `"pdf"`）                        |
| `item.basename`    | `string`            | 不含扩展名的文件名（如 `"paper"`）          |
| `item.annotations` | `LocalAnnotation[]` | 本地 reader 产生的 annotation 列表          |

### `item.annotations[]` — 本地 Annotation

| 变量                      | 类型                    | 说明                                          |
| ------------------------- | ----------------------- | --------------------------------------------- |
| `annotation.key`          | `string`                | Annotation ID                                 |
| `annotation.libraryID`    | `number`                | 始终为 `0`（本地文件）                        |
| `annotation.type`         | `string`                | `"highlight"`、`"note"`、`"image"`、`"ink"`   |
| `annotation.authorName`   | `string \| undefined`   | 批注作者                                      |
| `annotation.text`         | `string \| null`        | 高亮文本                                      |
| `annotation.comment`      | `string \| undefined`   | 用户评论                                      |
| `annotation.color`        | `string \| undefined`   | 颜色                                          |
| `annotation.pageLabel`    | `string \| undefined`   | 页码                                          |
| `annotation.tags`         | `Array<{ tag, type? }>` | 标签                                          |
| `annotation.dateAdded`    | `string \| undefined`   | ISO 时间戳                                    |
| `annotation.dateModified` | `string \| undefined`   | ISO 时间戳                                    |
| `annotation.raw`          | `AnnotationJSON`        | 原始对象，配合 `process_raw_anno_json` filter |

### `path` / `settings`

- `path` — 同 `item.path`
- `settings` — 与 Zotero 模板共享同一 `ZotFlowSettings` 对象

### 默认模板

输出逻辑与 Zotero 模板类似但更精简：无元数据字段（本地文件没有 Zotero 元数据），只输出标题与 annotation 列表。

```liquid
---
zotflow-locked: {{true}}
zotflow-local-attachment: [[{{ path }}]]
---
{%- capture quote_string %}{{ newline }}> {% endcapture -%}
{%- capture quote_string_2 %}{{ newline }}> >{% endcapture -%}
# {{ item.basename }}
{%- if item.annotations.length > 0 -%}
## Annotations
{%- for annotation in item.annotations -%}

> [!zotflow-{{ annotation.type }}-{{ annotation.color }}] [[{{item.path}}#page={{ annotation.pageLabel }}#annotation={{ annotation.key | process_nav_info }}|{{ item.name }}, p.{{ annotation.pageLabel }}]]
{%- if annotation.type == "ink" or annotation.type == "image"-%}
> > ![[{{settings.annotationImageFolder}}/{{ annotation.key }}.png]]
{%- else -%}
> > {{ annotation.text | replace: newline, quote_string_2 }}
{%- endif -%}
{%- if annotation.comment != "" -%}
>
> {{ annotation.comment | replace: newline, quote_string }}
{%- endif -%}
^{{ annotation.key }}

{%- endfor -%}
{%- endif -%}
```

---

## 3. Citation 模板

控制引用插入的渲染输出。共五个 slot：

| Slot                    | 输出物                         | 触发场景                      |
| ----------------------- | ------------------------------ | ----------------------------- |
| **Pandoc**              | `[@key]` 格式引用              | 拖拽/建议框/复制时选 Pandoc   |
| **Wikilink**            | `[[notePath\|label]]` 格式链接 | 拖拽/建议框/复制时选 Wikilink |
| **Footnote Reference**  | 行内 `[^key]` 标记             | Footnote 引用的行内部分       |
| **Footnote Definition** | 文档末尾的脚注定义             | Footnote 引用的定义部分       |
| **Citekey**             | 裸 `@key`                      | 不经过模板渲染，直接输出      |

### Citation Context 变量

| 变量                    | 类型                  | 说明                                           |
| ----------------------- | --------------------- | ---------------------------------------------- |
| `item.key`              | `string`              | Zotero item key                                |
| `item.citationKey`      | `string`              | Citation key（空串回退到 `item.key`）          |
| `item.title`            | `string`              | 标题                                           |
| `item.creators`         | `Array<{ name }>`     | 作者列表                                       |
| `item.date`             | `string`              | 出版日期                                       |
| `item.itemType`         | `string`              | 条目类型                                       |
| `item.url`              | `string \| undefined` | URL                                            |
| `item.DOI`              | `string \| undefined` | DOI                                            |
| `item.publicationTitle` | `string \| undefined` | 期刊/会议名                                    |
| `item.publisher`        | `string \| undefined` | 出版社                                         |
| `item.volume`           | `string \| undefined` | 卷                                             |
| `item.issue`            | `string \| undefined` | 期                                             |
| `item.pages`            | `string \| undefined` | 页码                                           |
| `item.tags`             | `Array<{ tag }>`      | 标签                                           |
| `item.*`                |                       | Zotero item 的其他字段同样可用                 |
| `notePath`              | `string`              | Source Note 在 vault 中的相对路径              |
| `annotations`           | `Array`               | 当前选中的 annotation 列表（无选中时为空数组） |

`annotations[]` 子字段：`annotation.key`、`annotation.type`、`annotation.text`、`annotation.comment`、`annotation.color`、`annotation.pageLabel`、`annotation.tags`、`annotation.dateAdded`、`annotation.dateModified`。

用 `annotations.size` 判断是否有选中 annotation，用 `annotations | map: 'pageLabel'` 提取页码。

### 默认 Citation 模板

**Pandoc：**

```liquid
[@{{ item.citationKey | default: item.key }}{% if annotations.size > 0 %}{% assign pages = annotations | map: 'pageLabel' | compact | uniq | join: ', ' %}{% if pages != empty %}, pp. {{ pages }}{% endif %}{% endif %}]
```

输出示例：`[@smith2024, pp. 3, 7]`

**Footnote Reference：**

```liquid
[^{{ item.citationKey | default: item.key }}]
```

输出示例：`[^smith2024]`

**Footnote Definition：**

```liquid
{%- if item.creators.length > 1 -%}
{{ item.creators[0].name }} et al.
{%- elsif item.creators.length == 1 -%}
{{ item.creators[0].name }}
{%- else -%}
Unknown Author
{%- endif -%}, *{{ item.title }}* ({{ item.date | slice: 0, 4 }}).
```

输出示例：`Smith et al., *Deep Learning for NLP* (2024).`

**Wikilink：**

```liquid
{%- if annotations.size > 0 -%}
{%- for annotation in annotations -%}
[[{{ notePath }}#^{{ annotation.key }}|{{ item.creators[0].name | default: "Unknown" }} ({{ item.date | slice: 0, 4 }}), p. {{ annotation.pageLabel }}]]
{%- if forloop.last == false %}, {% endif -%}
{%- endfor -%}
{%- else -%}
[[{{ notePath }}|{{ item.creators[0].name | default: "Unknown" }} ({{ item.date | slice: 0, 4 }})]]
{%- endif -%}
```

---

## 4. Path 模板

控制 Source Note 文件在 vault 中的落点路径。每段路径名会自动 sanitize（去除非法字符、处理保留名）。

### Library Path 变量

| 变量               | 类型              | 说明                           |
| ------------------ | ----------------- | ------------------------------ |
| `key`              | `string`          | Zotero item key                |
| `citationKey`      | `string`          | Citation key                   |
| `libraryID`        | `number`          | 库 ID                          |
| `itemType`         | `string`          | 条目类型                       |
| `title`            | `string`          | 标题                           |
| `creators`         | `Array<{ name }>` | 作者列表                       |
| `date`             | `string`          | 出版日期                       |
| `year`             | `string`          | 从 date 提取的四位年份         |
| `libraryName`      | `string`          | 库显示名称                     |
| `publicationTitle` | `string`          | 期刊/会议名                    |
| `publisher`        | `string`          | 出版社                         |
| `tags`             | `Array<{ tag }>`  | 标签                           |
| `itemPaths`        | `string[]`        | Collection 路径                |
| `*`                |                   | 其他 Zotero 元数据字段同样可用 |

### Local Path 变量

| 变量        | 类型     | 说明             |
| ----------- | -------- | ---------------- |
| `basename`  | `string` | 无扩展名的文件名 |
| `name`      | `string` | 完整文件名       |
| `path`      | `string` | vault 相对路径   |
| `extension` | `string` | 扩展名（不含点） |

### 默认 Path 模板

**Library：** `Source/{{libraryName}}/@{{citationKey | default: title | default: key}}`
输出示例：`Source/My Library/@smith2024`

**Local：** `Source/Local/@{{basename}}`
输出示例：`Source/Local/@myPaper`

### Path 模板建议

- `/` 创建目录层级：`References/{{year}}/{{citationKey}}`
- `@` 前缀是视觉约定（区分 Source Note 与普通笔记），非强制
- `| default:` 链式回退：`{{citationKey | default: title | default: key}}`
- Collection 路径：`{{itemPaths[0]}}` 取首个 collection 路径

---

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

### `html2md`

适用模板：**Zotero Source Note**

将 Zotero HTML（ProseMirror 格式）转换为 Markdown。处理数学公式、代码块、表格、图片、Zotero 的 wrapper div 属性。几乎总是与 `wrap_editable` 链式使用：

```liquid
{{ note.note | html2md | wrap_editable: "NOTE", note.key }}
```

> 此 filter 是 async 的，LiquidJS 自动以 Promise 求值。仅适用于 HTML 字符串。

### `wrap_editable`

适用模板：**Zotero Source Note**

将内容包裹在 ZotFlow editor extension 能识别的 hidden HTML comment marker 中，形成 editable region。

```liquid
{{ value | wrap_editable: "TYPE", key }}
```

| 参数     | 类型     | 说明                                                    |
| -------- | -------- | ------------------------------------------------------- |
| `"TYPE"` | `string` | `"NOTE"` — Zotero 子笔记；`"ANNO"` — annotation comment |
| `key`    | `string` | 对应的 Zotero note key 或 annotation key                |

输出：输入字符串首尾被 `<!-- ZF_TYPE_BEG_key -->` / `<!-- ZF_TYPE_END_key -->` 标记包裹。

- **Note region**：`{{ note.note | html2md | wrap_editable: "NOTE", note.key }}`
- **Annotation comment region**：`{{ annotation.comment | wrap_editable: "ANNO", annotation.key }}`

annotation comment 在进入 template context 前已经过 `annoHtml2md` 轻量转换（`<b>`→`**`、`<i>`→`*`、`<sub>`/`<sup>` 保留、stray `<`/`>` 转义），因此直接 `| wrap_editable` 即可，不需要再过 `| html2md`。

### `process_raw_anno_json`

适用模板：**Local Source Note**

将 raw annotation JSON 编码为 URL-encoded 字符串（已 strip 图片数据以压缩体积），用于 `%% ZOTFLOW_ANNO_..._BEG %%` comment marker 内部。

```liquid
{{ annotation.raw | process_raw_anno_json }}
```

---

## Frontmatter 渲染与合并策略

Frontmatter 有两个编辑来源：

1. **Template 中定义的字段**：你在模板 `---` 块中声明的 frontmatter
2. **用户在 note 中直接添加的字段**：打开生成的 `.md`，手动写入 frontmatter

### 用户在 note 中直接添加的字段

ZotFlow **永远不修改**——不覆盖、不删除、不添加。这些字段完全由用户手动管理。

### Template 中定义的字段

每次重渲染时，template 中的 frontmatter 字段按前缀规则与 note 的现有 frontmatter 合并：

| 前缀                           | 行为                                                                                                    |
| ------------------------------ | ------------------------------------------------------------------------------------------------------- |
| **`??` 前缀**（如 `??rating`） | note 中**不存在**该字段 → 用 template 值填充。note 中**已存在** → 保留 note 中的现有值，template 不覆盖 |
| **无 `??` 前缀**               | 总是用 template 的内容覆盖 note 中的值                                                                  |

强制字段（`zotflow-locked: true`、`zotero-key`、`item-version`、`library-id`、local note 的 `zotflow-local-attachment`）始终由系统注入，无需在 template 中声明。

### 渲染 Pipeline

1. **解析模板** — 分离 `---` 包裹的 frontmatter 块和 body
2. **渲染 frontmatter** — 先过 LiquidJS（所以可以在 frontmatter 中用 `{{ item.title }}` 等变量）
3. **解析 YAML** — 渲染后的 frontmatter 字符串被解析为 YAML
4. **合并** — 如果目标文件已存在：用户在 note 中直接添加的字段保留不变；template 中 `??` 前缀字段仅在 note 无此字段时填充；template 中无 `??` 前缀字段覆盖 note 中的对应值
5. **注入强制字段** — ZotFlow 自动写入系统必需字段
6. **序列化** — 最终 frontmatter 转回 YAML 字符串
7. **渲染 body** — body 部分过 LiquidJS
8. **组合** — frontmatter + body 拼接为最终 Markdown 文件

---

## Editable Region 机制

Source Note 默认整体只读，但通过 `wrap_editable` filter，你可以在模板中精确声明哪些区块可编辑：

- **Zotero 子笔记** → `{{ note.note | html2md | wrap_editable: "NOTE", note.key }}`
- **Annotation 评论** → `{{ annotation.comment | wrap_editable: "ANNO", annotation.key }}`

在 Source / Live Preview 模式下，每个 region 行首显示 🔒 锁图标。点击解锁后在区块内直接编辑。保存时：

- **Note region** → Markdown 转 Zotero HTML，写入 IndexedDB 中对应的 note 记录
- **Annotation comment region** → 去除 blockquote `> ` 前缀，Markdown 转 Zotero 注释 HTML，写入 IndexedDB 中对应的 annotation comment 字段

写入 debounce ~2s。下次 bidirectional sync 推送到 Zotero。

相关设置：

- **Default Editable Region Locked** — 控制 region 初始是否锁定
- **Hide Editable Region Markers** — 隐藏 `ZF_*_BEG` / `ZF_*_END` marker 行
- Read Only 库禁止解锁

---

## Template Preview

Activity Center 的 **Template** 标签页提供沙箱预览环境，无需实际创建文件即可看到渲染结果。

操作步骤：

1. 打开 Activity Center → Template 标签页
2. 从下拉菜单选择 context（Library Source Note / Local Source Note / Path / Citation × 4）
3. 点击 **Pick Zotero Item** 或 **Pick Local File** 选择渲染目标
4. 对于 citation context，会出现 annotation 多选下拉，选择要带入引用的 annotation
5. 左侧 CodeMirror 编辑器显示当前模板（可自由编辑，不影响已保存模板）
6. 点击 **Render**，右侧面板展示结果：
   - **Source** — 原始 Markdown（只读编辑器）
   - **Preview** — Obsidian `MarkdownRenderer` 渲染的样式预览
7. 模板面板 header 的 Copy 按钮可复制模板到剪贴板

> 切换 context 时会自动加载对应 built-in 默认模板。所有编辑仅存在于当前 session，不会修改设置中的模板文件。

---

## 常见写法与技巧

### 提取年份

```liquid
year: {{ item.date | slice: 0, 4 }}
```

### 作者列表（逗号分隔）

```liquid
authors: [{% for c in item.creators %}"{{ c.name }}"{% unless forloop.last %}, {% endunless %}{% endfor %}]
```

### 多行文本放进 Blockquote

```liquid
{%- capture quote_string %}{{ newline }}> {% endcapture -%}
> {{ item.abstractNote | replace: newline, quote_string }}
```

### 条件展示 DOI

```liquid
{%- if item.DOI -%}
DOI: [{{ item.DOI }}](https://doi.org/{{ item.DOI }})
{%- endif -%}
```

### 渲染标签

```liquid
{%- if item.tags.length > 0 -%}
tags:
{%- for tag in item.tags -%}
  - {{ tag.tag }}
{%- endfor -%}
{%- endif -%}
```

### 关联条目（Related Items）

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

三个分支分别处理：有 Source Note 路径的（wikilink）、本地存在但无路径的（标题+key）、未同步/跨库的（仅 key）。

### Deep Link 到附件

```liquid
[Open PDF](obsidian://zotflow?type=open-attachment&libraryID={{ attachment.libraryID }}&key={{ attachment.key }})
```

### 跳转到指定 Annotation

```liquid
[Jump to annotation](obsidian://zotflow?type=open-attachment&libraryID={{ attachment.libraryID }}&key={{ attachment.key }}&navigation={{ annotation.key | process_nav_info }})
```

### 按 Attachment 分组渲染 Annotation

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

### 使用扁平化的 `attachmentAnnotations`

```liquid
{%- for annotation in item.attachmentAnnotations -%}
- {{ annotation.text }} ({{ annotation.color }})
{%- endfor -%}
```

### Annotation Callout（带颜色信息）

```liquid
> [!zotflow-{{ annotation.type }}-{{ annotation.color }}] Title text
> > Quoted annotation text
```

可通过 CSS 自定义每种 callout 样式：`callout[data-callout="zotflow-highlight-#ffd400"]`。

### `| json` 安全输出 YAML 值

在 frontmatter 中始终对可能含特殊字符的字符串使用 `| json`：

```liquid
title: {{ item.title | json }}
```

### Path 模板使用 Collection 层级

```liquid
References/{{ itemPaths[0] | default: "Unsorted" }}/@{{ citationKey | default: key }}
```

输出：`References/Research/Machine Learning/@smith2024`

---

## 相关页面

- [Source Note](source-notes.md)
- [引用与写作流](citation-guide.md)
- [工作模型总览](concepts.md)
