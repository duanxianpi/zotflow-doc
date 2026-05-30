---
sidebar_position: 6
---

# Item Note：Zotero 子笔记

Item Note 是 Zotero 条目下的 child note item——Zotero 原生的笔记对象。ZotFlow 将它视为 first-class 可编辑对象：你可以**创建、编辑、删除**，完全在 Obsidian 内完成，变更在下一次 bidirectional sync 时回写到 Zotero。

## 与 Source Note 的区别（避免混淆）

需要明确的区分："note"这个词在 ZotFlow 中指代两个完全不同的概念：

| 概念                                    | 是什么                                               | 存储位置                                     |
| --------------------------------------- | ---------------------------------------------------- | -------------------------------------------- |
| **Source Note**（Obsidian）             | 由模板自动生成的 Markdown 文件，每个 Zotero 条目一份 | Vault 中的 `.md` 文件                        |
| **Item Note**（Zotero，本页讨论的对象） | Zotero 原生 child note item，挂在父条目下            | IndexedDB → bidirectional sync 推送到 Zotero |

本页只讨论 **Item Note**。Source Note 参见 [Source Note](source-notes.md)。

---

## Item Note 在哪里出现

在 **Zotero Tree View** 中，child note 显示为父条目下的 `📝` 叶子节点：

```
📚 My Library
└── 📄 Smith et al. (2024) — Distributed Tracing
    ├── 📎 smith2024.pdf
    ├── 📝 Open questions
    └── 📝 Summary
```

在 **Source Note** 正文内，每个 child note 默认被渲染进自己的 editable region，由 `<!-- ZF_NOTE_BEG_<key> -->` / `<!-- ZF_NOTE_END_<key> -->` 标记包裹（详见 [Editable Regions](source-notes.md#zotero-note-editable-regions--annotation-comment-editable-regions)）。

---

## 创建 Item Note

在 **Zotero Tree View** 中：

1. **右键**一个父条目（非 standalone attachment 的任何条目）
2. 选择 **Create child note**
3. ZotFlow 会：
   - 在 IndexedDB 中创建空 note，`syncStatus: "created"`
   - 刷新 Tree View，新 `📝` 节点出现
   - 在**新标签页**中打开 Note Editor，可直接输入

> 此时 note 的 key 是临时的。下一次 bidirectional sync 时 Zotero 分配真实 key，ZotFlow 自动更新本地记录。在这之前 note 完全可在本地正常使用。

**入口隐藏条件：**

- 目标是 standalone attachment（没有父条目的附件不能有 child）
- 库模式为 Read Only
- API Key 缺少 notes write 权限

---

## 编辑 Item Note

有两种等价编辑入口。两者写入同一份 IndexedDB 记录，产生同样的 outgoing sync——按场景选择即可。

### 方式 1：Note Editor（独立标签页编辑器）

打开方式：

- **双击** Tree View 中的 `📝` 节点，或
- 右键选择 **Open note**（在适用场景下出现），或
- 使用 URI：`obsidian://zotflow?type=open-note&libraryID=<id>&key=<key>`

编辑器是 Obsidian 标准的 embeddable Markdown 编辑器——你的快捷键、snippets、CSS、其他插件行为都正常工作。ZotFlow 在此基础上：

- **加载** note 的 Zotero HTML，转为 Markdown 后渲染
- **剥离**内部的 `<!-- ZF_NOTE_META … -->` round-trip 注释，你永远不会看到或编辑它
- **自动保存**（~2s debounce），没有"保存"按钮
- **标签页标题**从 note 首行自动更新
- **刷新父条目 Source Note**（debounced），使内嵌 region 反映你的编辑
- **Read Only 库时**标签页标题显示 `(READ ONLY)`，编辑器加载但禁止输入

### 方式 2：Source Note 内联编辑

打开**父条目的 Source Note**（Source 或 Live Preview 模式），滚动到对应 child note 的 region，点击 `ZF_NOTE_BEG_…` fence 前的 🔒 锁图标。Region 解锁后可直接原地编辑。~2s debounce 后 ZotFlow 将 Markdown 转回 Zotero HTML 并更新 IndexedDB。Note Editor（如果打开）会同步刷新；Source Note 本身不重渲染以避免覆盖你刚输入的内容。

> ⚠️ **同时从两个入口编辑同一条 note 存在覆盖风险。** 两者写入同一 IDB 记录。如果 Note Editor 和 Source Note 同时打开且在 debounce 窗口内双端输入，后写入者会覆盖先写入者。

---

## 删除 Item Note

在 **Zotero Tree View** 中：

1. **右键** `📝` note 节点
2. 选择 **Delete note**

ZotFlow 在 IndexedDB 中标记该 note 为删除，刷新 Tree View，弹出 `Note deleted.` 通知。删除操作在下一次 bidirectional sync 时推送到 Zotero。如果该 note 从未同步过（`syncStatus: "created"`），则直接从本地移除。

> 没有 undo。如果误删，在下一次 sync 前重建同内容 note，或从 Zotero 端恢复。

---

## 同步行为

Item Note 的创建/编辑/删除先在本地捕获，在下次 bidirectional sync 时与 Zotero 协调：

| 本地操作 | `syncStatus` | 下次 bidirectional sync 的行为           |
| -------- | ------------ | ---------------------------------------- |
| 创建     | `"created"`  | 向 Zotero 推送新 note item，获取真实 key |
| 编辑     | `"updated"`  | 向 Zotero 推送新的 HTML 内容             |
| 删除     | `"deleted"`  | 从 Zotero 删除该 note item               |

Item Note 遵循与普通条目相同的 **field-level conflict resolution**：如果同一条 note 在 Zotero 和 ZotFlow 两端都被编辑（两次 sync 之间），diff viewer 让你选择哪端胜出。

---

## Markdown ↔ Zotero HTML 转换

Zotero 以 ProseMirror HTML 格式存储 note。ZotFlow 在读写时各做一次转换：

- **打开/显示** — IDB HTML → Markdown（`html2md` pipeline）
- **保存** — Markdown → HTML（`md2html` pipeline）

转换对 Zotero 支持的特性是** round-trip safe** 的：富文本、标题、列表、表格、图片、数学公式、代码块、blockquote、链接、引用。

内部保留一个 `<!-- ZF_NOTE_META … -->` 注释用于维持 Zotero wrapper div 属性（schema version 等）跨 round-trip 的一致。Note Editor 会在显示时剥离它，保存时重新注入——你永远不需要关心它。

---

## 权限速查

| 条件                                             | 行为                                                       |
| ------------------------------------------------ | ---------------------------------------------------------- |
| 库模式 = **Bidirectional**，Key 具备 notes write | 创建/编辑/删除全开。变更在下一次 sync 推送                 |
| 库模式 = **Read Only**                           | Tree 中创建和删除入口隐藏，编辑器以只读模式加载            |
| API Key 无 notes write                           | 该库的条目中的 notes 不会被同步，Tree View 中也看不到 note |
| 库模式 = **Ignored**                             | 该库的条目不会被同步，Tree View 中也看不到 note            |

---

## 相关页面

- [Source Note](source-notes.md)
- [阅读器与批注](reading-and-annotating.md)
- [引用与写作流](citation-guide.md)
- [工作模型总览](concepts.md)
