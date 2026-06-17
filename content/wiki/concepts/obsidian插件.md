---
type: concept
created: 2026-06-17
updated: 2026-06-17
sources: ["[[sources/wiki架构设计]]"]
tags: [other]
aliases:
  - "Obsidian Plugins"
  - "Obsidian 插件集"
---


# Obsidian插件

## 定义
Obsidian插件是指为 Obsidian 笔记软件开发的扩展功能模块，用于增强其核心能力。在本维基架构中，Obsidian 被用作集成开发环境（IDE），通过一系列精选插件实现动态查询、幻灯片生成、图表绘制、版本控制和程序化访问等功能，使维基从静态知识库转变为可动态生成多种形式输出的内容平台。

## 关键特征
- **IDE 化集成**：将 Obsidian 作为维基的主要编辑和操作环境，插件作为功能扩展层
- **动态数据查询**：通过 Dataview 插件利用页面前言（frontmatter）生成动态表格和列表
- **多格式输出**：支持生成幻灯片（Marp）、图表（Excalidraw）等多种内容形式
- **版本控制**：通过 Obsidian Git 插件实现基于 Git 的版本管理和协作
- **程序化访问**：利用 Local REST API 插件允许外部程序对维基内容进行读写操作
- **可扩展性**：插件体系支持按需组合，灵活适配不同工作流需求

## 应用
- **知识管理**：使用 Dataview 动态展示笔记索引、标签统计和关系图谱
- **演示制作**：通过 Marp 插件将 Markdown 笔记快速转换为幻灯片演示
- **可视化设计**：利用 Excalidraw 创建流程图、架构图等可视化内容
- **版本控制与备份**：使用 Obsidian Git 自动提交和同步维基内容变更
- **自动化集成**：通过 Local REST API 将维基与其他工具（如自动化脚本、AI 助手）连接

## 相关概念
- [[concepts/LLM Wiki模式|LLM Wiki模式]]
- [[concepts/输出层|输出层]]

## 相关实体
- [[entities/dataview|dataview]]
- [[entities/marp|marp]]

## 来源提及
- "### Obsidian 插件 — [[raw/Wiki架构设计|Wiki架构设计]]"
- "- **Dataview**: 查询页面前言，生成动态表格和列表 — [[raw/Wiki架构设计|Wiki架构设计]]"
- "- **Marp**: 生成幻灯片演示 — [[raw/Wiki架构设计|Wiki架构设计]]"
- "- **Excalidraw**: 创建图表和可视化 — [[raw/Wiki架构设计|Wiki架构设计]]"