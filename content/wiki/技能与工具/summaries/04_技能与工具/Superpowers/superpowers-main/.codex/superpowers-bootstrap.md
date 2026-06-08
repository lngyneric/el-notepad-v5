---
title: "Superpowers Bootstrap for Codex"
description: "Superpowers 在 Codex CLI 的引导配置，包含技能工具映射和运行规则"
tags: [技能与工具, Superpowers, Codex, Bootstrap]
category: "工具配置"
summary: "Superpowers 在 Codex CLI 环境中的引导配置文件，定义了工具映射规则（TodoWrite→update_plan、Task→手动执行等）、技能命名规则（superpowers:skill-name、personal:skill-name）以及使用技能的强制性规则。"
reliability: "medium"
sources: [raw/技能与工具/04_技能与工具/Superpowers/superpowers-main/.codex/superpowers-bootstrap.md]
source-updated: "2026-06-07"
---

# Superpowers Bootstrap for Codex

## 摘要

Superpowers 在 Codex CLI 的 bootstrap 配置文件。核心内容：工具映射（TodoWrite → update_plan，Task → 手动执行等），技能命名与优先级规则（superpowers: / personal: 前缀），使用技能的强制性规则（相关技能必须使用）。

## 核心规则
- 任务前必须检查技能列表
- 相关技能必须加载使用
- 工具映射用于 Codex 不支持的 Claude Code 工具

## 来源

- [[raw/技能与工具/04_技能与工具/Superpowers/superpowers-main/.codex/superpowers-bootstrap.md]]
