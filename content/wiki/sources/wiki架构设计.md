---
type: source
created: 2026-06-17
updated: 2026-06-17
source_file: "[[raw/Wiki架构设计.md]]"
tags: [LLM Wiki模式, 三层架构, 摄入流程, 查询流程, 维护流程, index.md, log.md, 知识复合增长, LLM作为知识维护者, Obsidian插件, 输入层, 维基层, 输出层, 源摘要, 实体页面, 概念页面, 资源策展人, 探索指导者, 零维护成本]
aliases: ["Wiki Architecture Design Document", "LLM Wiki Architecture Spec"]
---

# Wiki 架构设计文档 - Summary

## 来源
- Original file: [[raw/Wiki架构设计.md]]
- Ingested: 2026-06-17

## 核心内容

本文档介绍了基于 [[concepts/llm-wiki模式|LLM Wiki模式]] 构建的知识库架构设计，由 [[entities/andrej-karpathy|Andrej Karpathy]] 提出。核心思想是将 LLM 作为知识维护者，自动构建和维护持久化知识库，实现知识的复合增长。文档详细描述了 [[concepts/三层架构|三层架构]]：[[concepts/输入层|输入层]]（原始源文件）、[[concepts/维基层|维基层]]（LLM 生成的 Markdown 页面）和 [[concepts/输出层|输出层]]（衍生内容）。定义了核心文件 [[concepts/index-md|index.md]]（内容索引）和 [[concepts/log-md|log.md]]（操作日志），并规定了 [[concepts/摄入流程|摄入流程]]、[[concepts/查询流程|查询流程]]、[[concepts/维护流程|维护流程]]三种工作流程。此外，推荐使用 Obsidian 作为 IDE，并集成 [[concepts/obsidian插件|Obsidian插件]]（如 [[entities/dataview|Dataview]]、[[entities/marp|Marp]]）来增强功能。该设计旨在实现 [[concepts/零维护成本|零维护成本]]、版本控制和高灵活性，适用于个人或团队的知识管理。

## 关键实体

- [[entities/andrej-karpathy|Andrej Karpathy]] — LLM Wiki 模式的提出者
- [[entities/dataview|Dataview]] — Obsidian 插件，用于查询页面前言生成动态表格
- [[entities/marp|Marp]] — Obsidian 插件，用于生成幻灯片演示
- [[entities/qmd|qmd]] — 本地 Markdown 搜索引擎，支持混合搜索
- [[entities/obsidian-web-clipper|Obsidian Web Clipper]] — 浏览器扩展，用于快速抓取网页内容

## 关键概念

- [[concepts/llm-wiki模式|LLM Wiki模式]] — 核心方法论，LLM 作为知识维护者自动构建知识库
- [[concepts/三层架构|三层架构]] — 输入层、维基层、输出层的分层结构
- [[concepts/摄入流程|摄入流程]] — 添加新源文件的标准步骤
- [[concepts/查询流程|查询流程]] — 用户通过 LLM 从维基获取答案的方式
- [[concepts/维护流程|维护流程]] — 定期检查维基健康状态的流程
- [[concepts/index-md|index.md]] — 内容索引，列出所有页面的链接和摘要
- [[concepts/log-md|log.md]] — 操作日志，按时间记录所有操作
- [[concepts/知识复合增长|知识复合增长]] — 每次添加源文件或查询都让知识库更丰富
- [[concepts/llm作为知识维护者|LLM作为知识维护者]] — LLM 负责所有维基页面的创建、更新和维护
- [[concepts/obsidian插件|Obsidian插件]] — 推荐集成的插件列表
- [[concepts/输入层|输入层]] — 存放原始源文件的只读层
- [[concepts/维基层|维基层]] — LLM 生成的 Markdown 页面核心层
- [[concepts/输出层|输出层]] — 衍生内容层，如幻灯片、报告
- [[concepts/源摘要|源摘要]] — 原始源文件的提炼页面
- [[concepts/实体页面|实体页面]] — 描述具体人物、组织、技术的页面
- [[concepts/概念页面|概念页面]] — 描述抽象概念、理论、方法论的页面
- [[concepts/资源策展人|资源策展人]] — 用户角色，负责资源收集和策展
- [[concepts/探索指导者|探索指导者]] — 用户角色，负责提出好问题引导探索
- [[concepts/零维护成本|零维护成本]] — LLM 自动维护，无需人工干预

## 要点

- 采用 Andrej Karpathy 提出的 LLM Wiki 模式，LLM 作为知识维护者自动构建知识库
- 三层架构：输入层（原始源文件）、维基层（LLM 生成的页面）、输出层（衍生内容）
- 核心文件 index.md（内容索引）和 log.md（操作日志）确保知识库的可导航性和可追溯性
- 三种工作流程：摄入（添加新源）、查询（获取答案）、维护（检查一致性）
- 推荐使用 Obsidian 作为 IDE，集成 Dataview、Marp、Excalidraw 等插件
- 实现零维护成本、知识复合增长和版本控制