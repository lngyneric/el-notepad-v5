---
title: "ai-shifu 运营角色模型"
description: "sysmex 培训平台的运营角色权限设计方案，课程/订单/用户管理权限模型"
tags: [HR-培训, ai-shifu, 权限, 角色设计]
category: "产品设计"
summary: "ai-shifu 平台的运营角色(Operator Role)权限模型。在现有 is_creator 单一角色基础上，新增独立的 operator 角色，覆盖课程管理(课程审核/上下架)、订单管理(查看及导出)、用户管理(查看/编辑)、系统配置(角色分配)等运营权限。"
reliability: "medium"
sources: ["[[sources/运营角色设计]]"]
source-updated: "2026-06-07"
---

# ai-shifu 运营角色模型

## 概述

ai-shifu 平台的运营角色权限模型设计。为适应开源项目的多租户运营需求，将原来单一的 is_creator 角色扩展为 creator + operator 双角色体系。

## 权限范围
- 课程管理：课程审核、上下架、分类管理
- 订单管理：订单查看、导出
- 用户管理：用户信息查看/编辑
- 系统配置：角色分配

## Evolution Log
- 2026-06-07: 来自 [[运营角色设计]] 的认知：ai-shifu 引入独立运营角色，实现 creator 和 operator 权限分离

## 来源
- [[raw/HR-培训/ai-shifu 项目文档/产品PRD(1)/运营角色设计.md]]
