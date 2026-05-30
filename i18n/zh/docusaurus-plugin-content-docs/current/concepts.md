---
sidebar_position: 3
---

# 工作模型总览

## 核心设计原则

### 1. Stay in the Flow

ZotFlow 的根本目标是消灭工具切换。阅读、批注、引用、笔记——这些动作天然适合发生在同一个工具里、同一套快捷键下、同一个主题中。ZotFlow 的每一个功能都是为了减少你离开 Obsidian 的理由。

### 2. Zotero 是 Source of Truth（大部分情况）

你的 Zotero 库是参考文献元数据的 canonical store。ZotFlow 的角色是：

- **Pull**：从 Zotero Web API 拉取元数据、条目、collection、annotation 到本地 IndexedDB 缓存
- **Push**：将你在 Obsidian 中的修改回写到 Zotero

> **哪些数据会被回写？** 目前回写到 Zotero 的仅限 **annotation**（增删改）和 **Item Note**（子笔记的创建/编辑/删除）。标签（tags）、frontmatter、条目元数据（title、creator 等）的改变**不会**被 push 回 Zotero。Source Note 的 frontmatter 自定义字段仅供本地使用，Zotero 侧不可见

每个可访问的 Zotero 库独立配置同步模式：

| 模式              | 行为                                                  |
| ----------------- | ----------------------------------------------------- |
| **Bidirectional** | 拉取 + 回写。需要 API Key 具备 write 权限             |
| **Read Only**     | 仅拉取。本地 annotation 保留在本地，决不会到达 Zotero |
| **Ignored**       | 同步时完全跳过                                        |

当同一字段在两次同步之间被两端各自修改，ZotFlow 提供 **field-level diff viewer** 让你逐字段选择哪一侧胜出，而不是粗暴地整条覆盖。

### 3. Source Note：一个条目一份，自动生成，默认锁定

每个 Zotero 条目在你 vault 里对应一份由模板自动渲染的 Markdown 文件——这就是 ZotFlow 记事模型的核心：

- **一个来源一份笔记**。知识图谱中稳定、可寻址的原子节点
- **由模板自动生成**。你定义 LiquidJS 模板，ZotFlow 填入元数据、子笔记、附件、annotation
- **默认锁定**。在 Reading View 下整页只读，frontmatter 和 editable region 例外。任何非法修改会在下一次重渲染时被覆盖

Source Note 在以下时机生成或更新：

| 触发场景             | 行为                                                                                                     |
| -------------------- | -------------------------------------------------------------------------------------------------------- |
| **首次同步后**       | 同步完成后，自动创建 Source Note（可在设置里关闭）                                                       |
| **同步发现条目变更** | Source Note 自动重渲染（可在设置里关闭）                                                                 |
| **Annotation 变更**  | 在 reader 中添加/编辑/删除 annotation 后，Source Note 自动重渲染（debounced ~2s，不受 version 检查约束） |
| **Item Note 变更**   | 编辑 Item Note 后，父条目的 Source Note 刷新以反映内嵌 note region 的更新                                |
| **手动触发**         | Tree View 右键条目 → Open source note（强制更新），或批量创建命令                                        |

#### 子笔记与 annotation 评论：规则的例外

Zotero **child note**（附着在文献条目下的原生笔记）是"锁定规则"下最重要的例外。ZotFlow 将 child note 视为 **first-class 可编辑对象**，提供两个等价的编辑入口：

- **Source Note 内的 editable region** — 每个 child note 被渲染到 Source Note 中时，由 `<!-- ZF_NOTE_BEG_<key> -->` / `<!-- ZF_NOTE_END_<key> -->` 隐藏注释标记包裹。在 Source / Live Preview 模式下，region 行首显示 🔒 锁图标，点击解锁即可原地编辑。Annotation comment 同理（标记为 `ZF_ANNO_*`）
- **独立 Note Editor** — 在 Tree View 中双击 `📝` 节点（或右键 Open note），在独立标签页中打开完整的嵌入式 Markdown 编辑器

两个入口写的是同一份 IndexedDB 记录。详见 [Item Note](item-notes.md)。

#### Frontmatter：另一个例外

Source Note 的 YAML frontmatter 有两处可编辑：

- **Template 里**：你可以在模板的 `---` 块中定义 frontmatter 字段
- **Note 里**：生成后你也可以直接在 `.md` 文件的 frontmatter 中添加字段

对于**你在 note 里直接添加的字段**（不在 template 中定义的），ZotFlow 永远不做任何修改，始终保留。

对于**template 中定义的 frontmatter 字段**，重渲染时按以下规则合并：

| 字段前缀                                   | 行为                                                                                                      |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| **`??` 前缀**（如 `??rating`、`??status`） | note 中**不存在**该字段 → 用 template 的值填充。note 中**已存在** → 保留 note 中的现有值，template 不覆盖 |
| **无 `??` 前缀**                           | 总是用 template 的内容覆盖 note 中的值                                                                    |

强制字段（`zotflow-locked`、`library-id`、`zotero-key`、`item-version`）始终重新注入，不受以上规则影响

详见 [Source Note 的 Frontmatter 合并策略](source-notes.md#frontmatter始终可编辑)

#### 推荐的笔记分工

理解上面的模型后，一个自然的用法是：

- **Item Note** — 承载对**这篇文献本身**的理解：批注延伸、段落复述、关键公式推导、读后疑问。Item Note 可编辑、跟随文献同步回 Zotero，内嵌在 Source Note 中天然与来源绑定
- **独立 Obsidian 笔记** — 承载**跨文献**的综合思考：主题综述、多篇对比、方法论讨论、研究脉络梳理。通过 wikilink 指向各 Source Note，一篇笔记可以连接多条文献

这种分工的好处：单篇思考不因 Source Note 重渲染而丢失（Item Note 写入 IndexedDB，同步回 Zotero），跨篇综合不受单一文献结构约束（独立笔记自由组织）。

### 4. 两种 Reader 模式

ZotFlow 的内置阅读器（与 Zotero 使用相同的 PDF/EPUB/HTML 渲染引擎，但主题匹配 Obsidian）工作在两种模式下：

| 模式               | 读取什么                     | Annotation 存哪里                    |
| ------------------ | ---------------------------- | ------------------------------------ |
| **Library Reader** | 从 Zotero 同步的附件         | Zotero（经 bidirectional sync 回写） |
| **Local Reader**   | Vault 内的本地 PDF/EPUB/HTML | Co-located `.zf.json` sidecar 文件   |

Local Reader 需手动开启：Settings → ZotFlow → General → Overwrite PDF/EPUB/HTML Viewer。启用后所有 vault 内的 PDF/EPUB/HTML 都会用 ZotFlow reader 打开。Local annotation 永不接触 Zotero。

### 5. 模板驱动一切

ZotFlow 是 **template-first** 的。几乎所有用户可见的输出都由 LiquidJS 模板渲染：

- Source Note 的文件路径
- Library Source Note 的正文
- Local Source Note 的正文
- 每种引用格式的输出（Pandoc、Wikilink、Footnote、Citekey）

如果你不满意默认输出，不需要提 feature request——改模板即可。详见[模板系统](template-guide.md)。

### 6. Offline-First

每个同步过的 Zotero item、collection、library 都缓存在本地 IndexedDB 中。首次同步完成后，你可以**在无网络连接的情况下**浏览、搜索、阅读、编辑 annotation。网络仅用于：

- 与 Zotero Web API 同步
- 下载附件（从 Zotero cloud storage 或你的 WebDAV 服务器）

缓存的附件文件按 LRU 策略管理，size limit 可在设置中控制。

### 7. 两个主要交互面板

你与 ZotFlow 的大部分交互集中在这两个面板上：

- **Zotero Tree View**（侧边栏） — 导航面板。浏览 Library → Collection → Item → Attachment 层级；搜索过滤；拖拽条目到编辑器插入引用；双击附件打开阅读器
- **Activity Center**（ribbon 图标打开） — 控制面板。触发同步、监控任务进度、查看日志、测试模板

### 8. 隐私与安全默认

- 无 telemetry、analytics 或第三方追踪
- 网络请求仅发往 Zotero API 和你配置的 WebDAV 服务器
- API Key 和 WebDAV 密码存储在 Obsidian 平台原生的 `SecretStorage` 中——**不会**出现在你同步的 `data.json` 里

---

## 数据流总览

```
Zotero Cloud ──pull──→ IndexedDB (本地缓存) ──模板渲染──→ Source Notes (.md) ←── 内含 Item Notes
     ↑                      ↑                                │
     │                      │                                │
     └──push── 编辑/批注变更 ─┘                                │
                                                            │
                                   跨文献综合分析 ←──wikilink──┘
```

1. ZotFlow 从 Zotero Web API 拉取条目、collection、附件、annotation 到本地 IndexedDB
2. 你在 Obsidian 中阅读附件、做 annotation、编辑 Item Note
3. 下次 bidirectional sync 时，变更回写到 Zotero
4. Source Note 根据条目与 annotation 状态变化自动重渲染（debounced ~2s）
5. 你的独立思考笔记通过 wikilink 指向 Source Note

## 冲突处理原则

当同一字段在两端都被修改，ZotFlow 的 field-level diff viewer 让你逐项选择保留哪一侧——不是整条覆盖，而是字段级决策。

降低冲突概率的实践：

1. 主编辑端尽量固定在 Obsidian 或 Zotero 其中一侧
2. 多端编辑前先做一次同步

## 为什么选择这套设计

1. **闭环**：阅读、批注、写作在同一工具内完成，零上下文切换
2. **稳定引用**：Source Note 确保每条来源都有一个永不丢失的"事实层"节点
3. **用户可控**：模板系统把输出格式交给用户，不硬编码任何工作流
4. **离线可用**：本地缓存 + LRU 附件管理，不依赖持续网络连接

---

## 相关功能入口

- [快速开始与连接](getting-started.md)
- [阅读器与批注](reading-and-annotating.md)
- [Source Note](source-notes.md)
- [Item Note](item-notes.md)
- [引用与写作流](citation-guide.md)
- [模板系统](template-guide.md)
