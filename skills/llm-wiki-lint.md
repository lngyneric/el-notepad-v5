---
name: llm-wiki-lint
description: 健康检查 - 可信度标注 + 过期销毁
---

# LLM Wiki - Lint Skill

## 检查项

### 1. 可信度标注 (reliability)
扫描所有 wiki 概念页，检查 frontmatter 中的 reliability 字段：
- **high**: 有明确数据源的页面 (source-updated <= 7 天)
- **medium**: 有数据源但超过 7 天
- **low**: 无数据源或来自 LLM 推断
- **auto**: 无 reliability 字段的 -> 标记为 "low"，追加到 log.md
- 可信度标注后，概念页的 tag 中追加 reliability/high / reliability/low

### 2. 过期销毁 (15 天规则)
- 对每个概念页，检查 source-updated 字段
- 如果 source-updated 距今超过 15 天 -> 标记为 EXPIRED
- 过期处理:
  - 把页面移到 wiki/<领域>/archived/ (自动创建目录)
  - 在 index.md 中移除该条目
  - 在 log.md 中记录: [YYYY-MM-DD] expired | [[概念名]] (15天无更新)
- 不移除双链引用，但被引用的页面应标注 "-> 已归档"

### 3. 孤立页面
- 扫描无入站链接的概念页
- 如果有高可信度 -> 保留并标记
- 如果 low 可信度 + 无入站链接 -> 直接移入 archived/

### 4. 跨域链接检查
- 扫描所有跨域 [[wiki/其他领域/xxx]] 引用
- 未标注的跨域引用 -> 报告给用户处理

### 5. 索引同步
- concepts/ 存在但 index.md 没有 -> 补入
- index.md 有但文件不存在 -> 清理

## Lint 报告格式
追加到 log.md：
```
## [YYYY-MM-DD] lint | Health Check
- Reliability: high=34 medium=42 low=7 auto-fixed=3
- Expired: 2 pages -> archived/
- Orphans: 1 low可信度 -> archived/
- Cross-domain links: 0 违规
- Index synced: +2 -1
```

## 频率
建议每周运行一次
