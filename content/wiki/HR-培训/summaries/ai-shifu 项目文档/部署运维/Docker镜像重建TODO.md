---
title: "Docker 镜像重建 TODO"
description: "ai-shifu 项目 Docker 镜像重建操作清单，含大纲树缓存优化的热部署代码集成"
tags: [HR-培训, ai-shifu, 运维, Docker]
category: "部署运维"
summary: "Docker 镜像重建操作清单。大纲树查询缓存优化已通过 docker cp 热部署到运行容器，需要将代码变更正式集成到 Docker 镜像中。涉及 5 个文件的代码变更，包含 Redis 缓存(5min TTL)和缓存失效逻辑。"
reliability: "medium"
sources: [raw/HR-培训/ai-shifu 项目文档/部署运维/Docker镜像重建TODO.md]
source-updated: "2026-06-07"
---

# Docker 镜像重建 TODO

## 摘要

Docker 镜像重建操作清单。大纲树查询缓存优化（Redis + FallbackCacheProvider）已通过 docker cp 热部署到运行容器，需正式重建 Docker 镜像以持久化这些变更。

## 来源

- [[raw/HR-培训/ai-shifu 项目文档/部署运维/Docker镜像重建TODO.md]]
