---
title: "课程访问分析 PRD"
description: "基于 Umami 的课程访问人数分析与后端集成方案"
tags: [HR-培训, ai-shifu, 产品PRD, 分析]
category: "产品设计"
summary: "基于 Umami 分析平台的课程访问人数统计方案。后端通过 Umami API 获取数据并缓存，前端业务后端统一提供访问量指标，不直接查询 Umami。"
reliability: "medium"
sources: ["[[sources/课程访问分析prd]]"]
source-updated: "2026-06-07"
---

# 课程访问分析 PRD

## 摘要

基于 Umami 分析平台的课程访问人数（访问量）统计方案。后端封装 Umami API 查询逻辑并提供缓存，管理后台统一通过业务后端获取访问量数据。

## 来源

- [[raw/HR-培训/ai-shifu 项目文档/产品PRD(1)/课程访问分析PRD.md]]
