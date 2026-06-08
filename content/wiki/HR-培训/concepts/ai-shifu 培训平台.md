---
title: "ai-shifu 培训平台"
description: "sysmex 公司基于 ai-shifu 开源项目搭建的企业内部 AI 培训平台，覆盖课程管理、学员管理、教师分析仪表盘等功能"
tags: [HR-培训, ai-shifu, 培训平台, 系统]
category: "系统设计"
summary: "ai-shifu 是 sysmex 公司基于开源项目搭建的企业内部 AI 培训平台。技术栈为 Flask API 后端 + Next.js 前端，集成飞书/企业微信/Umami 等服务。核心功能包括课程管理、教师分析仪表盘、学员学情追踪、运营角色权限管理等。"
reliability: "medium"
sources:
  - raw/HR-培训/ai-shifu 项目文档/架构设计(1)/ai-shifu 项目架构.md
  - raw/HR-培训/ai-shifu 项目文档/架构设计(1)/工程基线.md
  - raw/HR-培训/ai-shifu 项目文档/架构设计(1)/Git仓库概览.md
  - raw/HR-培训/ai-shifu 项目文档/部署运维/安装部署指南.md
source-updated: "2026-06-07"
---

# ai-shifu 培训平台

## 概述

sysmex 公司基于 ai-shifu/ai-coach 开源项目搭建的企业内部 AI 培训平台。采用 Flask API + Next.js 的双组件架构，集成飞书、企业微信、Umami 分析、Venus 等服务。

## 系统架构
- **后端**: Flask/Python API 服务（503 文件）
- **前端**: Next.js Cook Web（TypeScript 208 + TSX 287 文件）
- **仓库**: ~897MB（含资源文件），Apache 2.0 许可证

## 核心功能

### 教师分析仪表盘
面向课程创建者/协作者的学员分析工具，追踪学习进度、对话数据等学情信息。

### 运营角色权限
在已有创建者(is_creator)角色基础上新增独立的运营(operator)角色，覆盖课程管理、订单管理、用户管理、系统配置等权限。

### 课程访问分析
基于 Umami 分析平台的访问量统计，后端封装 API 并提供缓存支持。

### 密码登录
支持手机号+密码和邮箱+密码两种登录方式，全流程覆盖注册、密码设置、登录与重置。

## Evolution Log
- 2026-06-07: 来自 [[ai-shifu 项目架构]] 的认知：ai-shifu 是 sysmex 自建的企业 AI 培训平台

## 相关概念
- [[GLAD学习平台]]
- [[企业培训机器人]]

## 来源
- [[raw/HR-培训/ai-shifu 项目文档/架构设计(1)/ai-shifu 项目架构.md]]
- [[raw/HR-培训/ai-shifu 项目文档/架构设计(1)/工程基线.md]]
