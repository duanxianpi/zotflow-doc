---
sidebar_position: 9
---

# 模板指南

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

## Context 变量与默认模板

每种模板类型有自己的 context 变量（`item`、`annotations`、`path`……）。完整变量表与四份内置默认模板见 **[模板变量与默认模板](template-variables.md)**。

## 自定义 Filter

ZotFlow 提供链接构造、HTML ↔ Markdown 转换、可编辑区、CSL 引用（`citation` / `bibliography`）等 Liquid filter。完整参考见 **[模板 Filter 参考](template-filters.md)**。

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

## 可编辑区

可编辑区——Item Note 区域、注释评论区域、persist region——是 Source Note 的概念，文档在彼处：见[可编辑区](source-notes.md#可编辑区三种类型)与[所有权模型](concepts.md#-沉淀--source-note-内的内容所有权)。创建它们的 `wrap_editable` filter 见[模板 Filter 参考](template-filters.md#wrap_editable)。

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

### 渲染标签（YAML Frontmatter）

```liquid
tags: [{% for t in item.tags %}"#{{ t.tag | replace: " ", "_" }}"{% unless forloop.last %}, {% endunless %}{% endfor %}]
```

### 渲染标签（Annotation Callout 内联）

```liquid
{% if annotation.tags and annotation.tags.length > 0 -%}
> {% for t in annotation.tags %}#{{ t.tag | replace: " ", "_" }}{% unless forloop.last %} {% endunless %}{% endfor %}
{%- endif %}
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

### 附件链接

```liquid
- [{{ attachment.filename }}]({{ attachment | attachment_link }})
```

如需在 Zotero 原生阅读器中打开：

```liquid
- [{{ attachment.filename }}]({{ attachment | attachment_link: "zotero" }})
```

### Annotation 链接（跳转到指定批注）

```liquid
> [!zotflow-{{ annotation.type }}-{{ annotation.color }}] [{{ attachment.filename }}, p.{{ annotation.pageLabel }}]({{ annotation | annotation_link }})
```

使用 Zotero 原生阅读器：

```liquid
[{{ attachment.filename }}, p.{{ annotation.pageLabel }}]({{ annotation | annotation_link: "zotero" }})
```

### 条目链接

```liquid
Related: [{{ related.title }}]({{ related | item_link }})
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
