  ---
type: concept
created: 2026-06-17
updated: 2026-06-17
sources:
  - "[[sources/wiki架构设计]]"
tags:
  - "wiki"
  - "concept"
aliases:
  - "LLM Wiki模式"
  - "三层架构"
  - "LLM Wiki模式"
  - "LLM作为知识维护者"
  - "LLM Wiki模式"
  - "三层架构"
  - "LLM Wiki模式"
  - "输出层"
  - "LLM Wiki模式"
  - "三层架构"
  - "LLM Wiki模式"
  - "LLM作为知识维护者"
  - "LLM Wiki模式"
  - "三层架构"
  - "LLM Wiki模式"
  - "维基层"
  - "LLM Wiki模式"
  - "三层架构"
  - "LLM Wiki模式"
  - "LLM作为知识维护者"
  - "LLM Wiki模式"
  - "三层架构"
  - "LLM Wiki模式"
  - "输出层"
  - "LLM Wiki模式"
  - "三层架构"
  - "LLM Wiki模式"
  - "LLM作为知识维护者"
  - "LLM Wiki模式"
  - "三层架构"
  - "LLM Wiki模式"
---

## Description

LLM Wiki 模式由 Andrej Karpathy 提出，核心思想是将 LLM 定位为知识维护者，负责所有维护工作，而用户则扮演资源策展人和探索指导者的角色。该模式通过三层架构实现：输入层存放原始源文件（不可变、只读），维基层由 LLM 生成和维护的 Markdown 页面组成（包括实体、概念、摘要、比较分析、综合页面），输出层则从维基生成衍生内容（如幻灯片、报告、图表）。这种分层设计实现了源文件、知识库和产出物的清晰分离，便于管理和版本控制。LLM 作为知识维护者不会感到厌倦或忘记更新，因此实现了零维护成本——用户只需提供源文件和提出问题，LLM 会自动处理知识库的日常管理工作。维基层作为三层架构中的核心层，位于 wiki/ 目录，包含实体页面、概念页面、源摘要、比较分析、综合页面、索引页面和日志页面等多种页面类型。该层完全由 LLM 生成和更新，保持内部一致性，并自动进行交叉引用。与传统 RAG 不同，LLM Wiki 的知识是编译一次后保持更新的，交叉引用已经存在，矛盾已经标记，合成内容反映所有阅读内容，显著降低了知识库的维护成本，并支持知识的复合增长。

## Related Concepts

- [[concepts/三层架构|三层架构]]
- [[concepts/输入层|输入层]]
- [[concepts/输出层|输出层]]
- [[concepts/摄入流程|摄入流程]]
- [[concepts/查询流程|查询流程]]
- [[concepts/维护流程|维护流程]]
- [[concepts/知识复合增长|知识复合增长]]
- [[concepts/LLM作为知识维护者|LLM作为知识维护者]]
- [[concepts/维基索引|维基索引]]
- [[concepts/SCHEMA|SCHEMA]]
- [[concepts/index-md|index-md]]
- [[concepts/log-md|log-md]]

## Related Entities

- [[entities/Andrej Karpathy|Andrej Karpathy]]

## Mentions in Source

> **Source: [[raw/Wiki架构设计|Wiki架构设计]]**
> - 采用 Andrej Karpathy 提出的 LLM Wiki 模式，通过 LLM 作为知识维护者，自动构建和维护持久化知识库，实现知识的复合增长。
> - LLM 角色: 知识维护者，负责所有维护工作
> - 用户角色: 资源策展人，探索指导者，提出好问题的人
> - ### 1. 输入层 (Input Layer / Raw Sources)
> - ### 2. 维基层 (Wiki Layer)
> - ### 3. 输出层 (Output Layer)
> - **零维护成本**: LLM 不会感到厌倦，不会忘记更新

> **Source: [[sources/wiki架构设计|wiki架构设计]]**
> - 维基层 (Wiki Layer): 位置: wiki/ 目录
> - 内容: LLM 生成和维护的 Markdown 页面
> - 页面类型: 实体页面、概念页面、源摘要、比较分析、综合页面、索引页面、日志页面