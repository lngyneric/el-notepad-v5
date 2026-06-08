# ai-shifu Git 概览

## 基本信息

| 项目 | 值 |
|------|----|
| 仓库 | ai-shifu / ai-coach |
| 代码规模 | Python 503 文件 · TypeScript 208 文件 · TSX 287 文件 |
| 仓库大小 | ~897 MB（含资源文件） |
| 许可证 | Apache 2.0 |
| 首次提交 | 2026-05-10 |
| 最近提交 | 2026-06-08 |

## 远程仓库

| 名称 | URL | 用途 |
|------|-----|------|
| `origin` | `git@github.com:ai-shifu/ai-shifu.git` | 上游官方仓库 |
| `github` | `git@github.com:lngyneric/ai-coach.git` | 开发维护仓库（sysmex） |

## 技术栈

- **后端**: Python 3.11 · Flask · SQLAlchemy · Celery · Gunicorn
- **前端**: Next.js · TypeScript · React
- **数据库**: MySQL 8.0 · Redis 7
- **AI**: DeepSeek · OpenAI · TTS (MiniMax, Azure)
- **容器**: Docker · Docker Compose · Nginx
- **其他**: OpenTelemetry · Langfuse · 飞书集成

## Docker 镜像

| 镜像 | 版本 |
|------|------|
| `aishifu/ai-shifu-api` | v2.0.0 · v2.0.1 |
| `aishifu/ai-shifu-cook-web` | v2.0.0 · v2.0.1 |

### 运行中容器

```
ai-shifu-api        (API 服务)
ai-shifu-cook-web   (前端)
ai-shifu-celery-worker  (异步任务)
ai-shifu-celery-beat    (定时任务)
ai-shifu-nginx      (反向代理)
ai-shifu-mysql      (数据库)
ai-shifu-redis      (缓存/Celery)
```

## 版本发布 (Tags)

当前共 26 个标签，从 v0.6.0 到 v1.4.1。

版本演进：
- v0.6.0 – v0.7.0：早期原型
- v1.0.0 – v1.2.x：正式发布、核心功能
- v1.3.x – v1.4.x：持续迭代（TTS、计费、管理后台）

## 分支策略

### 主分支
- `main` — 生产就绪代码（保护分支）

### 功能分支 (`feat/*`)
```
feat/add-course-question-by-chapter-chart
feat/ask-provider-config-v1
feat/course-permission-edit-notify
feat/credit-notification-page-update
feat/dashboard-chapter-learning-chart
feat/login-copy-fix
feat/minimax-tts-integration
feat/operator-course-detail-credit-details
feat/operator-user-credit-usage-tab-extension
```

### 修复分支 (`fix/*`)
```
fix/backfill-course-permission-migration
fix/copy-free
fix/draft-conflict-on-save
fix/fixed-output-bug
fix/graceful-bug-hunt
fix/hidden-variables
fix/home-redirect-loop
fix/ios-otp-dup
fix/learn-pay-gate-dedupe
fix/mobile-payment
fix/personalization-background-not-updating
fix/preview-block-index-fallback
fix/tts-bugfixes
fix/tts-no-speakable-noop
fix/variable-creation
```

### 个人开发分支
```
aichy/*         — 开发人员分支
copilot/*       — GitHub Copilot 辅助
dependabot/*    — 依赖自动更新
dev, dev01, dev02 — 开发环境
```

## 贡献者 (34 人)

| 贡献者 | 提交数 | 角色 |
|--------|--------|------|
| yfge | 1012 | 核心开发者（主架构） |
| 拐爷&&老拐瘦 | 648 | 核心开发者 |
| kunlulu | 307 | 核心开发者 |
| 辰汐 | 165 | 开发者 |
| QinyingShi | 161 | 开发者 |
| heshaofu2 | 146 | 开发者 |
| moemoefish | 139 | 开发者 |
| Qinying | 130 | 开发者 |
| Kenrick-Zhou | 123 | 开发者 |
| Sunner Sun | 114 | 开发者 |
| aichy | 100 | 开发者 |
| Sun Zhigang | 96 | 开发者 |
| aichy126 | 50 | 开发者 |
| yuyingtao | 43 | 开发者 |
| starkwang | 37 | 开发者 |
| sysmex | 11 | 运维开发 |
| 其他 | ~30 | 自动化/一次性贡献 |

## 近 30 天主要改动

### cache 优化 (sysmex, 2026-06-07~08)
- feat: 大纲树查询缓存 — Redis 缓存大纲结构，减少 4→1 SQL
- fix: cache.set() 参数名错误 ttl→ex
- fix: FallbackCacheProvider.get() 内存缓存回退
- docs: TODO-docker-rebuild.md

### PRD 上线配置 (sysmex, 2026-06-04)
- chore: PRD deployment — Nginx 配置持久化 + 知识图谱卷挂载
- feat: IVD知识图谱+AI情景对话窗+产品型号库

### 通知与计费 (Qinying/拐爷, 2026-05-25~26)
- 信用通知优化（模板、去重、SMS 过期时间）
- 运营端信用额度使用场景扩展
- MiniMax TTS 字符计费修复

### 登录/会话 (拐爷, 2026-05-25)
- 登录会话重置修复
- 手机号重复绑定预防

## Git 协作规范

### 提交信息格式
```
<type>: <subject>

<body> (可选)
```

### 类型前缀
- `feat:` — 新功能
- `fix:` — 修复
- `chore:` — 杂项（构建、部署、配置）
- `docs:` — 文档
- `refactor:` — 重构
- `test:` — 测试
- `style:` — 样式

### PR 流程
1. 从 `main` 创建功能/修复分支
2. 分支命名：`feat/xxx` 或 `fix/xxx`
3. 开发完成后提交 PR → 自动 CI 检查
4. 至少 1 人 Review 后合并
5. 合并到 `main` 后自动部署

### 环境管理
```
本地开发 : docker-compose.dev.yml
测试环境 : docker-compose.test.yml
生产环境 : 手动部署（docker compose）
```
