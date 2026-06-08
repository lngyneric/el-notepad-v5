---
title: "Superpowers 安装与引导"
description: "Superpowers 在 Codex 和 OpenCode CLI 环境中的安装配置与引导流程"
tags: [技能与工具, Superpowers, 安装, Bootstrap]
category: "工具安装"
summary: "Superpowers 作为 AI 助手技能系统，支持在 Codex 和 OpenCode 两种 CLI 环境中安装运行。Codex 环境通过克隆仓库 + AGENTS.md 配置安装；OpenCode 环境通过插件注册 + symlink 集成。两者均支持三级技能优先级体系。"
reliability: "high"
sources: 
  - raw/技能与工具/04_技能与工具/Superpowers/superpowers-main/.codex/INSTALL.md
  - raw/技能与工具/04_技能与工具/Superpowers/superpowers-main/.opencode/INSTALL.md
  - raw/技能与工具/04_技能与工具/Superpowers/superpowers-main/.codex/superpowers-bootstrap.md
source-updated: "2026-06-07"
---

# Superpowers 安装与引导

## 概述

Superpowers 在 Codex 和 OpenCode 两种 CLI 环境中的安装和引导配置。

## Codex 安装流程
- 克隆仓库到 `~/.codex/superpowers/`
- 创建 `~/.codex/skills/` 个人技能目录
- 更新 `AGENTS.md` 添加 Superpowers System 配置
- 运行 `superpowers-codex bootstrap` 验证

## OpenCode 安装流程
- 克隆仓库到 `~/.config/opencode/superpowers/`
- 创建 symlink 注册插件
- 重启 OpenCode 后自动激活

## 工具映射
Codex 对 Claude Code 特有工具的替代方案：
- TodoWrite → update_plan
- Task(子代理) → 手动执行
- Skill → use-skill 命令

## 相关概念
- [[using-superpowers技能]]

## Evolution Log
- 2026-06-07: 来自 [[04_技能与工具/Superpowers/superpowers-main/.codex/INSTALL]]、[[04_技能与工具/Superpowers/superpowers-main/.opencode/INSTALL]]、[[04_技能与工具/Superpowers/superpowers-main/.codex/superpowers-bootstrap]] 的认知：Superpowers 在不同 CLI 环境中有不同的安装和引导方式

## 来源
- [raw/技能与工具/04_技能与工具/Superpowers/superpowers-main/.codex/INSTALL.md]
- [raw/技能与工具/04_技能与工具/Superpowers/superpowers-main/.opencode/INSTALL.md]
- [raw/技能与工具/04_技能与工具/Superpowers/superpowers-main/.codex/superpowers-bootstrap.md]
