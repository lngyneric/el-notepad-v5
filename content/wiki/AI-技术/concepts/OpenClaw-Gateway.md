---
type: concept
title: "OpenClaw Gateway"
date: 2026-04-24
tags: [wiki, wiki/concept]
---

# OpenClaw Gateway

## Evolution Log
- 2026-04-24: 来自 [[tasks]] 的认知：项目所需配置的网关环境，同时承载OpenClaw Plugin层的飞书Bitable事件监听功能。
- 2026-04-24: 来自 [[spec]] 的认知：连接飞书生态与OpenMAIC引擎的中间件，承担API鉴权与跨系统数据流转的核心职能。
- 2026-04-24: 来自 [[README]] 的认知：本项目飞书连接器的底层技术支撑，负责处理飞书生态内的消息转发与工具调用。
- 2026-04-24: 来自 [[ARCHITECTURE]] 的认知：基于Node.js构建的消息网关中间件，负责维护飞书WebSocket长连接、API Token权限校验、封装飞书Bitable API为AI可调用工具。
- 2026-04-24: 来自 [[ARCHITECTURE]] 的认知：本项目的消息网关，基于Node.js开发，负责飞书长连接维护、权限校验与飞书Bitable API的工具化封装，是连接各模块的核心流转枢纽。
