---
sidebar_position: 5
---

# Source Notes

Source Note 是 ZotFlow 的核心机制：每个 Zotero 条目自动生成一份结构化 Markdown，作为知识图谱中稳定、可寻址的"来源事实层"。

---

## 快速理解

1. Source Note 是由系统自动维护的**参考页**——元数据、annotation 摘录、子笔记由模板驱动，随条目变化自动刷新
2. 你可以在 Source Note 内编辑 Item Note 和 annotation 评论（通过 editable region）。Source Note 的定位偏向**参考与索引**：对单篇文献的批注、摘录放在 Source Note 及其 Item Note 中，跨文献的综合分析则适合放在独立笔记里，链接回各 Source Note
3. 默认 `zotflow-locked: true`，在 Reading View 下整页只读——但 frontmatter 和 editable region 例外，初次之外任何非法修改会在下一次重渲染时被覆盖

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

---

## 用户可编辑的范围

Source Note 默认整页只读，但两种内嵌内容被显式设计为可在 Obsidian 内编辑，frontmatter 则始终自由。

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

### Zotero Note Editable Regions & Annotation Comment Editable Regions

正文中，两种 region 被隐藏 HTML comment marker 包裹，视为可编辑区：

| Region 类型            | Marker                                                      | 默认承载内容                           |
| ---------------------- | ----------------------------------------------------------- | -------------------------------------- |
| **Zotero child note**  | `<!-- ZF_NOTE_BEG_<key> -->` … `<!-- ZF_NOTE_END_<key> -->` | 一个 Zotero note item 的 Markdown 渲染 |
| **Annotation comment** | `<!-- ZF_ANNO_BEG_<key> -->` … `<!-- ZF_ANNO_END_<key> -->` | 你附加在某条 annotation 上的评论文本   |

在 **Source / Live Preview** 模式下，每个 region 在 BEG marker 行首显示 🔒 锁图标。点击解锁后，region 内的内容变为可编辑。

保存时（debounce ~2s）：

- **Note region** → Markdown 转回 Zotero HTML，更新 IndexedDB 中对应的 note 记录。如果 region 包含 `<!-- ZF_NOTE_META … -->` 行，wrapper 属性会在回写时重建
- **Annotation comment region** → 去除 leading `> ` 前缀，Markdown 转 Zotero 注释 HTML（仅支持 `<b>`、`<i>`、`<sub>`、`<sup>`），更新 IndexedDB 中对应的 annotation comment

下一次 bidirectional sync 将修改推到 Zotero。

> ⚠️ **Marker 之间的结构、annotation excerpt、标题、生成的骨架——仍然是 locked 的。只有 Marker 内部（和 frontmatter）属于你可编辑的范围。** Editable region 由模板中的 `wrap_editable` filter 生成（详见[模板系统](template-guide.md#wrap_editable)），目前仅支持 Note Region 和 Annotation Comment Region 两种类型。用户无法手动创建其他类型的 editable region。

### Editable Region 相关设置

- **Default Editable Region Locked**（Settings → ZotFlow → General） — 新 region 初始是否锁定。单 region 的 toggle 会覆盖此默认值（当前 session 内有效）
- **Hide Editable Region Markers** — 隐藏 `ZF_*_BEG` / `ZF_*_END` marker 行
- Read Only 库 → 解锁图标不可用，region 不可编辑
- Editable region 仅在 **Source** 和 **Live Preview** 模式下可用。Reading View 下整页只读

---

## 自动更新行为

### Library Source Note

#### 同步触发更新

1. 同步从 Zotero 拉取变更条目
2. 对每个已有 Source Note 且发生变更的条目，调度一次 debounced（~2s）重渲染
3. 更新是**版本感知的**：如果文件的 `item-version` frontmatter 与当前条目版本一致，不触发重渲染

#### Annotation 变更触发更新

当你在 reader 中添加、编辑或删除 annotation，Source Note 自动更新——同样是 ~2s debounce。此类更新**强制触发**，不受 version 检查约束。

#### 手动触发更新

除了自动更新，也可以随时手动强制重渲染：

- **Tree View**：右键条目 → **Open source note**（会强制更新该条目的 Source Note）
- **命令面板**：`ZotFlow: Sync Source Notes` 批量同步所有 Source Note

### Local Source Note

本地文件的 Source Note 随 reader annotation 的增删改自动更新，debounce ~2s。

---

## 推荐用法

1. 让它承载**来源事实**：题录、摘要、annotation 摘录、子笔记
2. 对**这篇文献本身**的理解、批注延伸、复述总结——写在 **Item Note** 里（可编辑、会同步回 Zotero，内嵌在 Source Note 中）。对**多篇文献之间的关系**、主题综述、跨文献论证——写在**独立 Obsidian 笔记**里，通过 wikilink 指向各 Source Note。这样做的好处是：Source Note 重渲染不会影响你的笔记；单篇思考跟随文献走，跨篇综合独立组织
3. 不要在模板渲染区（非 editable region 部分）放长篇内容——重渲染会丢弃它们。长期维护的内容建议放在 editable region 内，或直接在 note 的 frontmatter 中添加自定义字段（ZotFlow 永不修改）
4. 想在 template 中预设可被用户覆盖的默认值时，用 `??` 前缀（如 `??rating: 0`、`??status: unread`）——首次生成时写入，之后用户可在 note 中自行修改

---

## 常见问题

### 我改过的正文又变回去了

你编辑的是模板驱动的区域。重渲染时这些区域会被模板输出覆盖。把长期维护的内容放在 note 的 frontmatter 中直接添加（ZotFlow 不修改），或确保在 editable region 内修改（note region 和 annotation comment region 的修改会写回 IndexedDB 并在重渲染时保留）。

### 锁图标不可点

多见于 Read Only 库或 API Key 权限不足。

### 没有自动更新

- 确认同步是否成功执行
- 确认条目的 `item-version` 是否真的变了（annotation 更新不受此限制，始终强制触发）
- 检查 Source Note 文件是否被外部修改导致 frontmatter 异常

---

## 相关页面

- [Item Note](item-notes.md)
- [模板系统](template-guide.md)
- [阅读器与批注](reading-and-annotating.md)
- [工作模型总览](concepts.md)
