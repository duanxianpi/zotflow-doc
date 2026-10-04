---
sidebar_position: 2
description: "在 Obsidian 中安装 ZotFlow 插件，用 API 密钥连接 Zotero 账户，并完成第一次文献库同步。"
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

### 选择 ZotFlow 打开附件的方式

:::important[ZotFlow 需要 Data Sync，但不要求同步附件文件]
ZotFlow 需要 Zotero **Data Sync**，以便通过 Web API 获取条目、笔记、标签、Collection
和附件元数据。Zotero 中独立的 **File Syncing** 选项（`Sync attachment files in My
Library using`）不是必需项。即使关闭附件文件同步，仍可正常使用 ZotFlow 的 Tree View、
Source Note、引用、同步和其他只依赖元数据的功能。Zotero 官方也明确说明
[Data Sync 可以脱离 File Syncing 单独使用](https://www.zotero.org/support/sync#data_syncing)。
:::

如果希望在移动端、未安装 Zotero 的电脑，或 Zotero 尚未下载附件的另一台电脑上直接
用 ZotFlow 打开附件，才需要远程附件同步方案。请根据实际使用场景选择：

- **只在一台安装了 Zotero 的桌面电脑上使用，且不需要跨设备访问附件：**
  优先选择 **Zotero 本地存储**。ZotFlow 会直接读取 Zotero 已有的本地副本。如果你
  已开启 File Syncing，且它只是为了 ZotFlow，但你只在一台电脑上使用，那么在确保
  所有附件都已保存在本机后，可以将该选项关闭；保留开启也没有问题。
- **需要在移动端或未安装 Zotero 的其他电脑上使用：** 选择 **Zotero Cloud Storage**
  或 **WebDAV**，让 ZotFlow 可以从远程服务下载附件。对于其他桌面电脑，也可以用
  第三方云盘同步 linked-file 目录，并在每台电脑上设置 **Linked Attachment Base
  Directory**；linked files 不支持移动端。参见 [Zotero 官方 linked files 说明](https://www.zotero.org/support/attaching_files#linked_files)
  和[下方配置教程](#linked-attachment-base-directory)。
- **已经在使用 Zotero Cloud Storage、WebDAV 或 linked files：** 保留现有方案，并在
  ZotFlow 中配置对应选项即可。

| 方式 | 适用场景 | 说明 |
| ---- | -------- | ---- |
| **Zotero 本地存储** | 安装了 Zotero 的单台桌面电脑；不需要跨设备访问附件 | 直接读取 Zotero 已下载到本机 `storage` 目录的副本，避免再次下载和创建 ZotFlow 缓存副本。仅桌面端可用 |
| **Zotero Cloud Storage** | 移动端、多台电脑、Group Library，或未安装 Zotero 的电脑 | Zotero 内置文件同步，提供 300 MB 免费空间。[查看方案 →](https://www.zotero.org/storage) |
| **WebDAV** | 在移动端或多台电脑使用 Personal Library，并已有 WebDAV 服务 | 在 **Settings → ZotFlow → WebDAV** 中配置；Zotero 的 WebDAV 文件同步不支持 Group Library |
| **Linked files** | 已有 linked-file 工作流，或使用外部工具同步附件目录 | 在 **General → Source Notes → Library Source Note** 中配置 **Linked Attachment Base Directory**。仅桌面端可用 |

### 从 Zotero 本地存储目录读取

如果 Zotero 与 Obsidian 运行在同一台桌面电脑上，ZotFlow 可以直接读取 Zotero 本地
数据目录中的存储型附件：

1. 确认 Zotero 已在这台电脑上下载该附件。
2. 打开 **Settings → ZotFlow → General → Source Notes → Library Source Note**。
3. 开启 **Use Zotero Storage Directory**。
4. 将 **Zotero Storage Path** 设为 Zotero `storage` 目录的完整绝对路径，例如
   `C:\Users\name\Zotero\storage`、`/Users/name/Zotero/storage` 或
   `/home/name/Zotero/storage`。

直接读取适用于存储型附件（`imported_file` 和 `imported_url`）。ZotFlow 每次都会先
从磁盘读取，不经过附件缓存或已配置的同步服务，也不会把结果写入缓存。Linked file
仍使用自身路径或 **Linked Attachment Base Directory**；移动端继续使用 Zotero Cloud
Storage 或 WebDAV。

:::note
这是本机读取方式，不是附件同步服务。Zotero 必须已经在这台电脑上保存该文件，但
不需要开启 Zotero File Syncing。请指向 `storage` 目录本身，而不是它的上一级 Zotero
数据目录，并且不要使用 `~`。如果本地文件缺失，ZotFlow 会报告错误而不会静默下载；
关闭该选项即可恢复通常的同步服务读取路径。
:::

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
6. **右键**任意条目 → **Edit tags…** 直接在 Obsidian 中管理标签

---

## 主要交互面板

ZotFlow 有三个主要交互面板，你已在上面步骤中用到了它们。这里做一个快速总览：

### Tree View

Library → Collection → Item → Attachment 层级浏览器（侧边栏）。搜索过滤、拖拽引用、右键批量操作、双击打开附件/笔记。

### Search Modal

`ZotFlow: Search Zotero Library` 或 ribbon 图标唤起。实时搜索已缓存条目，回车跳转附件。

### Activity Center

集中控制面板（ribbon 图标打开），六个标签页：

- **Sync** — 触发全量或单库同步，解决同步冲突
- **Tasks** — 监控 Active / Queued 任务进度
- **Template** — LiquidJS 模板沙箱，实时预览渲染结果
- **CSL** — 管理 `citation` / `bibliography` filter 使用的引用样式：按 id 添加（带实时预览）、自定义 `.csl` 文件夹、一键更新。详见 [CSL 引用](csl-citations.md)
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

> **注意：**Server URL **必须包含 `/zotero`**，直接指向 Zotero 存放附件的那个 `zotero` 文件夹。这与 Zotero 客户端里的填法不同：Zotero 会自动在你填的地址后面补上 `zotero/`，而 ZotFlow 不会，所以要自己带上。例如：Zotero 里配置的是 `https://dav.example.com/dav`，这里就填 `https://dav.example.com/dav/zotero`。

### 附件缓存

ZotFlow 会缓存已下载的附件以加速重复打开：

- **Settings → ZotFlow → Cache → Enable Cache**（默认开启）
- 设置 **Size Limit**（MB，默认 500 MB）。达到上限后按 LRU 逐出
- 点击 **Purge Cache** 清空所有缓存

### Linked Attachment Base Directory

如果你在 Zotero 中使用了 Linked Attachment Base Directory（Zotero → Preferences → Advanced → Files and Folders），需要告知 ZotFlow 文件的实际位置：

1. **Settings → ZotFlow → General → Source Notes → Library Source Note → Linked Attachment Base Directory**
2. 填入与 Zotero 设置中**相同的绝对路径**（如 `D:\Papers` 或 `/Users/name/Papers`）
3. 存储为 `attachments:papers/foo.pdf` 的附件将解析到 `D:\Papers\papers\foo.pdf`

不使用 linked attachment 则可跳过。

### Local Reader（vault 内文件）

要让 vault 内的任意 PDF/EPUB/HTML 文件也用 ZotFlow reader 打开：

1. **Settings → ZotFlow → General → Reader → Overwrite PDF/EPUB/HTML Viewer** → 开启
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
- **[模板指南](template-guide.md)** — 完整 LiquidJS 变量与 filter 参考
