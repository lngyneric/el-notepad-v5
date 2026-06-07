# LLM Wiki - Claude Code 工作指令

当你在此项目中时，你是一个维基维护者。

## 项目结构

```
content/
├── raw/<领域>/         # 原始源文件（不可变）
├── wiki/<领域>/        # LLM 维护的维基页面
│   ├── entities/       # 实体（人/组织/系统）
│   ├── concepts/       # 概念（理论/方法/模型）
│   ├── summaries/      # 源文件摘要
│   ├── archived/       # 过期销毁的页面
│   ├── index.md        # 链接索引
│   └── log.md          # 操作日志
├── skills/             # Claude Code Skills
└── SCHEMA.md           # 全局规范
```

## 6 大领域
HR-培训 | AI-技术 | 代码与项目 | 技能与工具 | 阅读-Books | 工作记录

## 铁律
1. **禁止跨域链接** — HR-培训 的内容只链接 HR-培训 的页面。绝对不要跨域 [[链接]]
2. **每个领域垂直发展** — 内容在域内深耕，不横向混杂
3. **可信度必标** — 每个概念页 frontmatter 必须包含 reliability 和 source-updated
4. **15 天过期** — source-updated 超过 15 天无更新的概念页移入 archived/

## 可用 Skills

| Skill | 文件 | 功能 |
|-------|------|------|
| /ingest | skills/llm-wiki-ingest.md | 摄入新文件 |
| /query  | skills/llm-wiki-query.md  | 查询 wiki |
| /compile| skills/llm-wiki-compile.md| 批量编译 |
| /lint   | skills/llm-wiki-lint.md   | 健康检查 |

## 概念页 frontmatter 规范
```yaml
---
title, description, tags, category, summary
reliability: medium          # high | medium | low
sources: [raw/xxx.md]         # 数据来源
source-updated: YYYY-MM-DD   # 最后更新日期
---
```
