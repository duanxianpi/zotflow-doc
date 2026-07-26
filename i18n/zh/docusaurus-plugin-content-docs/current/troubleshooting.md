---
sidebar_position: 14
---

# 故障排查（按症状）

这页按“你遇到的现象”给出最快排查路径。

## 症状 1：API Key 验证失败

检查顺序：

1. Key 是否复制完整。
2. Zotero 账号是否已登录并可访问。
3. Key 是否包含对应库权限。
4. 网络是否可访问 Zotero API。

若是组库问题，重新创建 Key 并显式授权该 Group。

## 症状 2：能同步但不能编辑

常见根因：

1. 库模式是 Read Only。
2. API Key 无写权限。
3. 无 notes 权限导致子笔记操作被禁用。

处理：

1. 在 Sync 设置中确认库模式。
2. 重新创建具备 write/notes 的 Key。
3. 再执行一次 Verify + Sync。

## 症状 3：批注没有回写 Zotero

检查顺序：

1. 该附件是否来自 Library Reader（不是 Local Reader）。
2. 所在库是否 Bidirectional。
3. 是否已执行同步任务。

提示：Local Reader 批注写入 `.zf.json`，不会回写 Zotero。

## 症状 4：Source Note 内容被“改回去”

根因：

- 你编辑了模板所有的区域，重渲染时被重新生成。

建议：

1. 关于这篇文献的自由笔记 → 写进 **persist region**（模板声明、仅存本地、每次重渲染都存活）。
2. 想让 Zotero 看到的想法 → 写进 **Item Note** 区域（同步回流）。
3. 结构化字段（评分、状态）→ frontmatter 自定义键（永不被碰）。
4. 跨文献综合 → 独立笔记，链接回各 Source Note。

详见[所有权模型](concepts.md#-沉淀--source-note-内的内容所有权)。

## 症状 5：引用插入异常

### 情况 A：触发词不弹窗

1. 检查触发字符设置。
2. 检查当前编辑器是否支持建议弹窗。

### 情况 B：输出格式不是预期

1. 检查默认引用格式。
2. 检查是否按下修饰键覆盖默认。
3. 检查模板自定义是否覆盖内置行为。

### 情况 C：Wikilink 跳转失败

1. 目标 Source Note 可能不存在。
2. 先触发该条目的 Source Note 创建。

## 症状 6：本地附件打不开或缺图

1. 若用 WebDAV，检查服务器地址和凭据。
2. 若用 Linked Attachment，检查基目录路径。
3. 若用缓存，确认缓存未被清理且容量足够。

## 自检清单（提交问题前）

1. ZotFlow 版本。
2. Obsidian 版本与平台。
3. 同步模式与权限配置截图。
4. 可复现步骤（最小步骤）。
5. 相关日志片段。

## 相关页面

- [快速开始与连接](getting-started.md)
- [工作模型总览](concepts.md)
- [设置参考](settings-reference.md)
