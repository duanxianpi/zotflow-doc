---
sidebar_position: 5
---

# Source Notes

Source Note 是 ZotFlow 的核心机制：每个 Zotero 条目自动生成一份结构化 Markdown，作为知识图谱中稳定、可寻址的"来源事实层"。

---

## 快速理解

1. Source Note 是条目的**汇总页**——元数据、annotation 摘录、子笔记由模板驱动，随条目变化自动刷新
2. 页面内的内容有三种所有者：**模板**在每次更新时重生成骨架；**Zotero 同步区域**（Item Note、注释评论）可编辑并随同步回流；**persist region** 与自加 frontmatter 字段**完全属于你**——仅存本地、原样保留。完整图景见[所有权模型](concepts.md#-沉淀--source-note-内的内容所有权)
3. 页面以锁定状态打开（`zotflow-locked: true`），防止误改模板所有的内容——凡属于你的始终可编辑，且不会因重渲染丢失

---

## 渲染流程

### Library Source Note（Zotero 条目）

创建或更新 Source Note 时的完整 pipeline：

1. **路径模板**渲染，决定文件落点
2. ZotFlow 读取你的内容模板（或使用 built-in 默认模板）
3. 从本地 IndexedDB 收集条目的元数据、子笔记、附件、annotation
4. LiquidJS 渲染模板，产出 Markdown 正文
5. **Frontmatter 合并**：如果目标文件已存在，执行注记合并策略：用户直接在 note 中添加的字段不受影响，template 中的 `??` 前缀字段仅在 note 中无此字段时填充，template 中无 `??` 前缀的字段始终覆盖
6. **注入强制字段**（这些总是覆盖模板）：
   - `zotflow-locked: true`
   - `library-id` — Zotero 库标识
   - `zotero-key` — 链接到 Zotero 条目
   - `item-version` — 用于更新检测，仅在版本变化时触发重渲染
7. 文件写入磁盘

### Local Source Note（vault 本地文件）

相同 pipeline，但 context 变量和强制字段有所不同：

- `zotflow-locked: true`
- `zotflow-local-attachment: [[path/to/file.pdf]]`

本地文件的 annotation 数据存储在 co-located `.zf.json` sidecar 中（如 `Papers/paper.pdf` → `Papers/paper.zf.json`），不在 Source Note 内部。

本地 Source Note 同样支持可编辑区：**annotation 评论区**（编辑回写到 `.zf.json` sidecar，已打开的本地 reader 会自动刷新）和 **persist region**（仅存本地、每次重渲染都存活，见下文）。Zotero note region 不适用——本地文件没有 Zotero 子笔记。

---

## 用户可编辑的范围

模板拥有页面的骨架——除此之外的内容都归你编辑：frontmatter（始终自由）、Zotero 同步区域（Item Note 与注释评论）、以及仅存本地的 persist region。

### Frontmatter（始终可编辑）

Frontmatter 有两种编辑来源：

- **Template 中定义的字段**：在模板的 `---` 块中声明
- **你在 note 里直接添加的字段**：打开 `.md` 文件后手动写入 frontmatter

#### 你在 note 里直接添加的字段

ZotFlow **永不修改**。重渲染时原样保留，不参与任何合并逻辑。

#### Template 中定义的字段

重渲染时按前缀规则合并：

| 前缀                           | 行为                                                                               |
| ------------------------------ | ---------------------------------------------------------------------------------- |
| **`??` 前缀**（如 `??rating`） | note 中**不存在** → 用 template 的值填充；note 中**已存在** → 保留 note 中的现有值 |
| **无 `??` 前缀**               | 总是用 template 内容覆盖 note                                                      |

强制字段（`zotflow-locked`、`library-id`、`zotero-key`、`item-version`、local note 的 `zotflow-local-attachment`）始终重新注入，不受上述规则影响。

#### 典型用法

- 在 template 中写 `??rating: 0` → 首次生成时 note 获得 `rating: 0`，之后你在 note 中改为 5 → 重渲染保留你的 5
- 在 template 中写 `tags:` → 每次重渲染都覆盖，确保 tags 与 Zotero 同步
- 在 note 里直接写 `myNotes: "..."` → ZotFlow 永远不碰

### 可编辑区：三种类型

正文中，三种 region 被隐藏 HTML comment marker 包裹，视为可编辑区：

| Region 类型            | Marker                                                            | 默认承载内容                           |
| ---------------------- | ----------------------------------------------------------------- | -------------------------------------- |
| **Zotero child note**  | `<!-- ZF_NOTE_BEG_<key> -->` … `<!-- ZF_NOTE_END_<key> -->`       | 一个 Zotero note item 的 Markdown 渲染 |
| **Annotation comment** | `<!-- ZF_ANNO_BEG_<key> -->` … `<!-- ZF_ANNO_END_<key> -->`       | 你附加在某条 annotation 上的评论文本   |
| **Persist region**     | `<!-- ZF_PERSIST_BEG_<id> -->` … `<!-- ZF_PERSIST_END_<id> -->`   | 模板给的默认内容——之后完全归你，仅存本地 |

在 **Source / Live Preview** 模式下，每个 region 在 BEG marker 行首显示 🔒 锁图标。点击解锁后，region 内的内容变为可编辑。

保存时（debounce ~2s）：

- **Note region** → Markdown 转回 Zotero HTML，更新 IndexedDB 中对应的 note 记录。如果 region 包含 `<!-- ZF_NOTE_META … -->` 行，wrapper 属性会在回写时重建
- **Annotation comment region** → 去除 leading `> ` 前缀，Markdown 转 Zotero 注释 HTML（仅支持 `<b>`、`<i>`、`<sub>`、`<sup>`），更新 IndexedDB 中对应的 annotation comment

下一次 bidirectional sync 将修改推到 Zotero。

### Persist Region（仅存本地的内容）

**Persist region** 属于*你*而不属于 Zotero：写在里面的内容在每次 source note 更新中都会存活，且**永远不会同步到 Zotero**。典型用法是不创建 item note、直接在 source note 里写个人总结或阅读笔记。

在模板中用一个你自选的稳定 id 声明——原生注释对或 `wrap_editable: "PERSIST", "your-id"` 均可（语法与 id 规则详见[模板 Filter 参考](template-filters.md#wrap_editable)）：

```markdown
## 我的总结
<!-- ZF_PERSIST_BEG_summary -->

<!-- ZF_PERSIST_END_summary -->
```

每次 note 更新时，ZotFlow 会在重渲染前提取 persist 内容，渲染后按 id 拼回原位。Marker 有问题（缺 id、id 重复、未闭合、嵌套）时该 note 会**拒绝更新**并报错指向出错行——解析失败时绝不覆写任何内容。

**孤儿内容：** 如果模板中某个 region id 后来被删除或改名，其内容*不会*被删除——它会被移动到 note 底部一段有明确边界的 **"Orphaned persist regions"** 区域（`<!-- ZF_PERSIST_ORPHAN_BEG -->` … `<!-- ZF_PERSIST_ORPHAN_END -->`），并弹出一次性警告通知。清理由你自己完成：

- **删除单个 region 的内容** — 解锁后清空文字；空 region 会在下次更新时自动消失。
- **编辑或移除孤儿内容** — 在 frontmatter 中把 `zotflow-locked` 改为 `false`（完成后改回），或使用任何外部工具：哨兵 marker 让这段区域很容易被脚本定位，而编辑器锁定在 Obsidian 之外不存在。

编辑器中，persist region 以**低饱和橙色边框**显示，与主题色边框的同步类 region 相区分。

> ⚠️ Persist 内容存在 note 文件里。如果启用了**自动清理已回收 source note**，Zotero item 被移入回收站时整个文件（连同 persist 内容）会一起进入系统回收站。

> ⚠️ **Marker 之外的结构、annotation excerpt、标题、生成的骨架——仍然是 locked 的。只有 Marker 内部（和 frontmatter）属于你可编辑的范围。** Note 和 annotation region 由模板中的 `wrap_editable` filter 生成（详见[模板 Filter 参考](template-filters.md#wrap_editable)）；persist region 也可以直接手写注释对。

### Editable Region 相关设置

- **Default Editable Region Locked**（Settings → ZotFlow → General） — 新 region 初始是否锁定。单 region 的 toggle 会覆盖此默认值（当前 session 内有效）
- **Hide Editable Region Markers** — 隐藏 `ZF_*_BEG` / `ZF_*_END` marker 行
- Read Only 库 → note 和 annotation region 的解锁图标不可用；**persist region 仍可编辑**（其内容从不离开你的 vault）
- Editable region 仅在 **Source** 和 **Live Preview** 模式下可用。Reading View 下整页只读

---

## 自动更新行为

### Library Source Note

#### 同步触发更新

1. 同步从 Zotero 拉取变更条目
2. 对每个已有 Source Note 且发生变更的条目，调度一次 debounced（~2s）重渲染
3. 更新是**版本感知的**：如果文件的 `item-version` frontmatter 与当前条目版本一致，不触发重渲染

#### Annotation 变更触发更新

当你在 reader 中添加、编辑或删除 annotation，Source Note 自动更新——同样是 ~2s debounce。此类更新**强制触发**，不受 version 检查约束。仅修改标签（通过标签编辑弹窗）同样触发重渲染，因为 annotation 变更检测现在会比较标签签名。

#### 手动触发更新

除了自动更新，也可以随时手动强制重渲染：

- **Tree View**：右键条目 → **Open source note**（会强制更新该条目的 Source Note）
- **命令面板**：`ZotFlow: Sync Source Notes` 批量同步所有 Source Note

### Local Source Note

本地文件的 Source Note 随 reader annotation 的增删改自动更新，debounce ~2s。

---

## 推荐用法

写在哪，问两个问题——*是不是关于这一篇？* 和 *要不要让 Zotero 看到？*

| | 要同步到 Zotero | 只留在 vault |
| --- | --- | --- |
| **关于这一篇** | **Item Note**——注释延伸、复述、想在 Zotero 所达设备上都看到的总结 | **Persist region**——私人阅读笔记、评价、工作草稿，就写在来源页面里 |
| **跨多篇** | — | **独立 Obsidian 笔记**——综述、比较、论证；wikilink 连回各 Source Note |

配套习惯：

1. 让模板所有的部分承载**来源事实**——题录、摘要、注释摘录。别在那里写正文：重渲染会重新生成。
2. 结构化的单条目元数据（评分、阅读状态）用**自定义 frontmatter 字段**——直接在 note 里添加（永不被碰），或用 `??` 前缀在模板中预设可覆盖的默认值（如 `??rating: 0`、`??status: unread`）。
3. 在模板里为你常用的个人段落声明 persist region（比如一个 `## 我的总结` 区块）——改一次模板，每张 source note 都有了你的文字的持久归处。

---

## 常见问题

### 我改过的正文又变回去了

你写在了模板所有的区域——那里每次重渲染都会重新生成。为你的内容设计了三个持久归处：

- **Persist region**——模板中声明的仅本地区块，最适合在来源页面里写自由笔记（[详情](#persist-region仅存本地的内容)）
- **同步区域**——Item Note / 注释评论的编辑写入 IndexedDB 并回流 Zotero
- **自定义 frontmatter 字段**——ZotFlow 永不修改

完整决策指南见[所有权模型](concepts.md#-沉淀--source-note-内的内容所有权)。

### 锁图标不可点

多见于 Read Only 库或 API Key 权限不足。

### 没有自动更新

- 确认同步是否成功执行
- 确认条目的 `item-version` 是否真的变了（annotation 更新不受此限制，始终强制触发）
- 检查 Source Note 文件是否被外部修改导致 frontmatter 异常

---

## 相关页面

- [Item Note](item-notes.md)
- [模板指南](template-guide.md)
- [阅读器与批注](reading-and-annotating.md)
- [工作模型总览](concepts.md)
