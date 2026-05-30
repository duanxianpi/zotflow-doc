---
sidebar_position: 2
---

# 快速开始与连接

:::tip
跑完首次同步后，建议阅读读[工作模型总览](concepts.md)。
:::

---

## 第 1 步：安装

### 方式 A — Community Plugins（推荐）

1. Obsidian → **Settings (⚙️) → Community plugins**
2. 确认 **Restricted mode** 已关闭
3. 点击 **Browse**，搜索 **ZotFlow**，点击 **Install**，然后 **Enable**

直达链接：[https://community.obsidian.md/plugins/zotflow](https://community.obsidian.md/plugins/zotflow)

### 方式 B — 预发布版（BRAT）

适合想提前用新功能但尚未进入 stable release 的用户：

1. **安装 BRAT**
   - Obsidian → **Settings → Community plugins**
   - Browse 搜索 "BRAT"，安装并启用

2. **添加 ZotFlow Beta**
   - 在 Community plugins 中点击 BRAT 旁的 **Options**
   - 点击 **Add Beta plugin**
   - 输入仓库地址：`duanxianpi/obsidian-zotflow`
   - 点击 **Add Plugin**

3. **启用 ZotFlow**
   - 回到 **Settings → Community plugins**，找到 ZotFlow 并开启

---

## 第 2 步：连接 Zotero

### 前置条件：Zotero 数据同步

ZotFlow 通过 Zotero Web API 获取库数据，因此你的条目必须已经同步到 Zotero 云端：

1. 打开 **Zotero 桌面端** → **Edit → Settings → Sync**（macOS 上是 **Zotero → Preferences → Sync**）
2. 登录 Zotero 账号并确认 **Data Syncing** 已开启
3. 点击 **Sync**（绿色环形箭头）并等待完成

### 附件（PDF）存储方案

Zotero 免费同步条目元数据，但附件文件需要存储空间。如果附件库较大，有三个选择：

| 方案               | 详情                                                                                                                                                       |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Zotero Storage** | 内置，零配置。免费 300 MB。付费 $20/年起（2 GB）。[查看方案 →](https://www.zotero.org/storage)                                                             |
| **WebDAV**         | 自建或第三方（如 [Box](https://www.box.com)、[pCloud](https://www.pcloud.com)、[koofr](https://koofr.eu)）。有免费档位。配置在 Settings → ZotFlow → WebDAV |
| **Linked files**   | PDF 放本地任意目录（或第三方云盘），Zotero 以链接形式引用。在 Settings → ZotFlow → General → Linked Attachment Base Directory 设置基目录。仅桌面端可用     |

> 不使用附件同步也可以正常使用 ZotFlow 的 Source Note、引用和 Tree View——这些只需要元数据。附件存储只影响你是否能在 ZotFlow reader 中打开 PDF。

### 创建 API Key

1. 打开 [https://www.zotero.org/settings/keys/new](https://www.zotero.org/settings/keys/new)
2. 给 Key 起一个描述名（如 "ZotFlow"）
3. 在 **Personal Library** 下，勾选 **Allow library access** 和 **Allow write access**（后者是 bidirectional sync 的前提）
4. 如需编辑 Zotero Item Note，勾选 **Allow notes access**
5. 如果你使用 Group Library，按需授权目标 Group
6. 点击 **Save Key** 并复制生成的 Key

### 录入 Key 并验证

1. 打开 **Settings → ZotFlow → Sync**
2. 粘贴 API Key 到 **API Key** 字段
3. 点击 **Verify Key**
   - ZotFlow 会校验 Key、拉取用户信息并发现所有可访问的库
   - 成功后字段旁显示 **Verified** 标记
4. **Library Synchronization** 表格出现，列出所有可访问的库

### 为每个库选择同步模式

对表格中的每个库选择同步模式：

- **Bidirectional** — 拉取 + 回写（推荐用于个人主库）
- **Read Only** — 仅拉取（适合共享组库、审阅场景）
- **Ignored** — 同步时跳过

此配置随时可改。

---

## 第 3 步：首次同步

1. 点击左侧 ribbon 的 **ZotFlow 图标**，打开 **Activity Center**
2. 切换到 **Sync** 标签页
3. 点击 **Sync All** 同步所有非 Ignored 库，或点击单个库的 **Sync**
4. 在 **Tasks** 标签页中观察进度
5. 任务完成后，你的 Zotero 条目已在本地缓存，此时已可离线使用

---

## 第 4 步：浏览你的库

1. 打开 **Zotero Tree View**：
   - 命令面板 → `ZotFlow: Open Zotero Tree View`，或
   - 点击左侧 sidebar 的 Library 图标
2. 展开 Library → Collection → Item → Attachment 层级
3. 使用顶部搜索栏过滤条目
4. **双击**附件在阅读器中打开
5. **拖拽**一个普通条目到任意编辑器中插入引用

---

## 主要交互面板

ZotFlow 有三个主要交互面板，你已在上面步骤中用到了它们。这里做一个快速总览：

### Tree View

Library → Collection → Item → Attachment 层级浏览器（侧边栏）。搜索过滤、拖拽引用、右键批量操作、双击打开附件/笔记。

### Search Modal

`ZotFlow: Search Zotero Library` 或 ribbon 图标唤起。实时搜索已缓存条目，回车跳转附件。

### Activity Center

集中控制面板（ribbon 图标打开），五个标签页：

- **Sync** — 触发全量或单库同步，解决同步冲突
- **Tasks** — 监控 Active / Queued 任务进度
- **Template** — LiquidJS 模板沙箱，实时预览渲染结果
- **Repair** — 修复因重渲染产生的失效 Block Reference
- **Telemetry** — 按级别过滤的运行日志

---

## 第 5 步：可选配置

### WebDAV（自建附件存储）

如果附件存在 WebDAV 服务器而非 Zotero 云端：

1. **Settings → ZotFlow → WebDAV**
2. 开启 **WebDAV Sync**
3. 填入 **Server URL**、**Username**、**Password**
4. 点击 **Verify & Connect**

### 附件缓存

ZotFlow 会缓存已下载的附件以加速重复打开：

- **Settings → ZotFlow → Cache → Enable Cache**（默认开启）
- 设置 **Size Limit**（MB，默认 500 MB）。达到上限后按 LRU 逐出
- 点击 **Purge Cache** 清空所有缓存

### Linked Attachment Base Directory

如果你在 Zotero 中使用了 Linked Attachment Base Directory（Zotero → Preferences → Advanced → Files and Folders），需要告知 ZotFlow 文件的实际位置：

1. **Settings → ZotFlow → General → Linked Attachment Base Directory**
2. 填入与 Zotero 设置中**相同的绝对路径**（如 `D:\Papers` 或 `/Users/name/Papers`）
3. 存储为 `attachments:papers/foo.pdf` 的附件将解析到 `D:\Papers\papers\foo.pdf`

不使用 linked attachment 则可跳过。

### Local Reader（vault 内文件）

要让 vault 内的任意 PDF/EPUB/HTML 文件也用 ZotFlow reader 打开：

1. **Settings → ZotFlow → General → Overwrite PDF/EPUB/HTML Viewer** → 开启
2. **重启 Obsidian**
3. Vault 内的 PDF/EPUB/HTML 现在由 ZotFlow reader 打开，annotation 写入同目录的 `.zf.json` sidecar 文件

---

## 常见卡点

### Verify Key 失败

- 检查 Key 是否复制完整
- 检查 Zotero Key 权限是否覆盖目标库
- 检查网络是否可访问 Zotero API（`api.zotero.org`）

### 看不到任何库

- 通常是 Key 权限范围不包含这些库
- 重新创建 Key 并显式授权对应 Group Library

### 能读不能写

- 库模式可能被设为 Read Only
- Key 可能缺少 write 权限或 notes 权限
- 在 Sync 设置中确认库模式，必要时重新创建 Key

### Tree View 中无法展开 Library/Collection

- 可能是同步未完成
- 点击 Sync 标签页确认同步状态，等待完成后点击 Tree View 刷新按钮

---

## 下一步

现在你有了运行中的 ZotFlow，建议按以下顺序深入：

- **[工作模型总览](concepts.md)** — 理解设计哲学和同步边界，后续所有功能都会更清晰
- **[阅读器与批注](reading-and-annotating.md)** — 阅读器功能、批注类型、图片提取、拖拽行为
- **[Source Note](source-notes.md)** — Source Note 何时更新、frontmatter 合并、版本感知重渲染
- **[引用与写作流](citation-guide.md)** — 每种引用插入方式、annotation 上下文带入
- **[模板系统](template-guide.md)** — 完整 LiquidJS 变量与 filter 参考
