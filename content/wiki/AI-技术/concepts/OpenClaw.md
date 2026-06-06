---
type: concept
title: "OpenClaw"
category: "开发框架"
date: 2026-04-24
summary: "本方案的中间连接器（Gateway），负责监听飞书消息、调用OpenMAIC接口，并实现OpenMAIC与飞书多维表格之间的消息分发与数据流转。"
tags: [wiki, wiki/concept]
---

# OpenClaw

## Evolution Log
- 2026-04-24: 来自 [[INTEGRATION_SPEC]] 的认知：本方案的中间连接器（Gateway），负责监听飞书消息、调用OpenMAIC接口，并实现OpenMAIC与飞书多维表格之间的消息分发与数据流转。
- 2026-04-24: 来自 [[DEPLOYMENT]] 的认知：OpenMAIC部署的核心依赖网关工具，需安装v2026.2.1-zh.3及以上版本并配置飞书插件，提供消息网关能力与运行状态查询功能。
- 2026-04-24: 来自 [[checklist]] 的认知：本项目用于向飞书多维表格写入数据的底层能力，支撑bitable-sync.js的数据同步功能。
- 2026-04-24: 来自 [[BITABLE_GUIDE]] 的认知：连接飞书多维表格与OpenMAIC的中间服务，可监听多维表格事件、调用接口并实现飞书消息推送，需配置飞书相关凭证完成对接。
- 2026-04-24: 来自 [[INTEGRATION_SPEC]] 的认知：本方案中的连接器（网关）组件，负责监听飞书消息、调用OpenMAIC接口，并实现跨系统数据流转，将处理结果写入飞书多维表格。
- 2026-04-24: 来自 [[BITABLE_GUIDE]] 的认知：对接飞书生态的自动化工具，可监听多维表格事件、自动填充用户飞书OpenID、调用第三方接口并推送消息，需配置飞书相关参数方可正常运行。
