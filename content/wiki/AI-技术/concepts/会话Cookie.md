---
type: concept
title: "会话Cookie"
date: 2026-04-14
tags: [wiki, wiki/concept]
---

# 会话Cookie

## Evolution Log
- 2026-04-14: 来自 [[功能准备]] 的认知：登录成功后后端设置的`training_user` Cookie，携带用户id与token，属性为HttpOnly、SameSite=Lax，用于后续服务端识别用户会话。
