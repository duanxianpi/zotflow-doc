---
sidebar_position: 10
---

# 模板变量与默认模板

每种模板类型暴露自己的 context 变量。本页是完整参考——四种模板类型的全部变量表，以及可作为起点的内置默认模板。语法与工作流见[模板指南](template-guide.md)；filter 见[模板 Filter 参考](template-filters.md)。

## 1. Zotero Source Note 模板

控制 Zotero 库条目的 Source Note 正文。context 为 `{ item, settings }`。

### `item` — Zotero 条目

| 变量                         | 类型                      | 说明                                                                                                            |
| ---------------------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `item.key`                   | `string`                  | Zotero item key                                                                                                 |
| `item.version`               | `number`                  | 条目版本号，用于增量更新检测                                                                                    |
| `item.libraryID`             | `number`                  | 库 ID                                                                                                           |
| `item.citationKey`           | `string`                  | Citation key（如 Better BibTeX 生成），未设置则为空串                                                           |
| `item.itemType`              | `string`                  | 条目类型（`"journalArticle"`、`"book"` 等）                                                                     |
| `item.title`                 | `string`                  | 标题                                                                                                            |
| `item.parentItem`            | `string`                  | 父条目 key；顶层条目为空串                                                                                      |
| `item.creators`              | `Array<{ name: string }>` | 作者列表，`name` 为组合后的全名                                                                                 |
| `item.date`                  | `string \| null`          | 出版日期字符串（Zotero 中填写的原始值）                                                                         |
| `item.year`                  | `string \| null`          | 从 date 提取的四位年份（如 date 为 `"2024-05-01"` 则 year 为 `"2024"`，date 为空或格式不规范则 year 也为 null） |
| `item.dateAdded`             | `string`                  | ISO 时间戳，条目添加到 Zotero 的时间                                                                            |
| `item.dateModified`          | `string`                  | ISO 时间戳，最后修改时间                                                                                        |
| `item.accessDate`            | `string \| null`          | 最后访问日期                                                                                                    |
| `item.abstractNote`          | `string \| undefined`     | 摘要                                                                                                            |
| `item.publicationTitle`      | `string \| undefined`     | 期刊/会议名                                                                                                     |
| `item.publisher`             | `string \| undefined`     | 出版社                                                                                                          |
| `item.place`                 | `string \| undefined`     | 出版地                                                                                                          |
| `item.volume`                | `string \| undefined`     | 卷                                                                                                              |
| `item.issue`                 | `string \| undefined`     | 期                                                                                                              |
| `item.pages`                 | `string \| undefined`     | 页码范围                                                                                                        |
| `item.series`                | `string \| undefined`     | 系列名                                                                                                          |
| `item.seriesNumber`          | `string \| undefined`     | 系列编号                                                                                                        |
| `item.edition`               | `string \| undefined`     | 版次                                                                                                            |
| `item.url`                   | `string \| undefined`     | URL                                                                                                             |
| `item.DOI`                   | `string \| undefined`     | DOI                                                                                                             |
| `item.ISBN`                  | `string \| undefined`     | ISBN                                                                                                            |
| `item.ISSN`                  | `string \| undefined`     | ISSN                                                                                                            |
| `item.tags`                  | `Array<{ tag, type? }>`   | 标签列表                                                                                                        |
| `item.itemPaths`             | `string[]`                | 条目所在的 collection 路径数组（如 `["Research/ML"]`）                                                          |
| `item.attachments`           | `AttachmentContext[]`     | 子附件列表（PDF 等）                                                                                            |
| `item.annotations`           | `AnnotationContext[]`     | 直接在条目上的 annotation（仅 standalone attachment 条目有）                                                    |
| `item.attachmentAnnotations` | `AnnotationContext[]`     | 所有 attachment 下 annotation 的扁平汇总                                                                        |
| `item.notes`                 | `NoteContext[]`           | Zotero 子笔记列表                                                                                               |
| `item.relatedItems`          | `RelatedItemContext[]`    | Zotero "Related" 关联条目列表                                                                                   |

### `item.attachments[]` — 附件子对象

| 变量                      | 类型                    | 说明                                |
| ------------------------- | ----------------------- | ----------------------------------- |
| `attachment.key`          | `string`                | Attachment item key                 |
| `attachment.libraryID`    | `number`                | 库 ID                               |
| `attachment.parentItem`   | `string`                | 所属顶层条目的 key                  |
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
| `note.parentItem`   | `string`                | 父条目 key                               |
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
| `annotation.parentItem`   | `string \| undefined`   | 所属附件的 key                                                                     |
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
year: {{ item.year }}
url: {{ item.url | json }}
doi: {{ item.DOI | json }}
tags: [{% for t in item.tags %}"#{{ t.tag | replace: " ", "_" }}"{% unless forloop.last %}, {% endunless %}{% endfor %}]
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
- [{{ attachment.filename }}]({{ attachment | attachment_link }})
{%- endfor -%}

{%- endif -%}
## Notes
{%- if item.notes.length > 0 -%}
{%- for note in item.notes -%}
{{ note.note | html2md | wrap_editable: "NOTE", note.key }}

{%- endfor -%}
{%- endif -%}
{%- if item.attachments.length > 0 and item.attachmentAnnotations.length > 0 -%}
## Annotations
{%- for attachment in item.attachments -%}
{%- if attachment.annotations.length > 0 -%}
### {{ attachment.filename }}
{%- for annotation in attachment.annotations -%}
> [!zotflow-{{ annotation.type }}-{{ annotation.color }}] [{{ attachment.filename }}, p.{{ annotation.pageLabel }}]({{ annotation | annotation_link }})
{%- if annotation.type == "ink" or annotation.type == "image"-%}
> > ![[{{settings.annotationImageFolder}}/{{ annotation.key }}.png]]
{%- else -%}
> > {{ annotation.text | replace: newline, quote_string_2 }}
{%- endif -%}
>
> {{ annotation.comment | wrap_editable: "ANNO", annotation.key | replace: newline, quote_string }}
> {% if annotation.tags and annotation.tags.length > 0 -%} {% for t in annotation.tags %}#{{ t.tag | replace: " ", "_" }}{% unless forloop.last %} {% endunless %}{% endfor %} {%- endif %}
^{{ annotation.key }}

{%- endfor -%}
{%- endif -%}
{%- endfor -%}
{%- endif -%}
{%- if item.attachments.length == 0 and item.itemType == "attachment" and item.annotations.length > 0 -%}
## Annotations
{%- for annotation in item.annotations -%}
> [!zotflow-{{ annotation.type }}-{{ annotation.color }}] [{{ item.title }}, p.{{ annotation.pageLabel }}]({{ annotation | annotation_link }})
{%- if annotation.type == "ink" or annotation.type == "image"-%}
> > ![[{{settings.annotationImageFolder}}/{{ annotation.key }}.png]]
{%- else -%}
> > {{ annotation.text | replace: newline, quote_string_2 }}
{%- endif -%}
>
> {{ annotation.comment | wrap_editable: "ANNO", annotation.key | replace: newline, quote_string }}
> {% if annotation.tags and annotation.tags.length > 0 -%} {% for t in annotation.tags %}#{{ t.tag | replace: " ", "_" }}{% unless forloop.last %} {% endunless %}{% endfor %} {%- endif %}
^{{ annotation.key }}

{%- endfor -%}
{%- endif -%}
```

1. **frontmatter** — 输出 `citationKey`、`title`、`itemType`、`creators`、`publication`、`date`、`year`、`url`、`doi`、`tags`
2. **标题** — `# 标题`
3. **摘要** — 以 blockquote 格式渲染
4. **附件** — 可点击链接列表（通过 `attachment_link` filter，默认在 ZotFlow reader 中打开）
5. **子笔记** — 每个 note 通过 `html2md | wrap_editable` 渲染为 editable region
6. **批注** — 按 attachment 分组，使用 `[!zotflow-<type>-<color>]` callout 渲染，annotation comment 包裹为 editable region，标签在评论下方独立行显示

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

输出逻辑与 Zotero 模板类似但更精简：无元数据字段（本地文件没有 Zotero 元数据），只输出标题与 annotation 列表。annotation 评论以**可编辑区**形式包裹——在 note 中的编辑会回写到 `.zf.json` sidecar。`wrap_editable`（包括 `"PERSIST"` 区域）同样适用于本地模板；只读/外部 annotation 会自动渲染为普通锁定文本。

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
>
> {{ annotation.comment | wrap_editable: "ANNO", annotation.key | replace: newline, quote_string }}
{%- if annotation.tags and annotation.tags.length > 0 -%}
>
> {% for t in annotation.tags %}#{{ t.tag | replace: " ", "_" }}{% unless forloop.last %} {% endunless %}{% endfor %}
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
[^{{ item.citationKey | default: item.key }}]: {%- if item.creators.length > 1 -%}
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


---

## 相关页面

- [模板指南](template-guide.md)
- [模板 Filter 参考](template-filters.md)
