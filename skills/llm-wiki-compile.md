---
name: llm-wiki-compile
description: 批量编译未处理的 raw 源文件到 wiki，要求记录数据来源
---

# LLM Wiki - Compile Skill

## 规则
- 每个编译的概念/实体必须记录:
  - **sources**: [源文件名]
  - **source-updated**: YYYY-MM-DD
  - 在 frontmatter 中体现
- 每个摘要页面底部标注来源文件的路径
- 记录编译日期到 log.md

## 步骤
1. 扫描 raw/ 中所有 .md 文件
2. 对每个领域，对比 raw/ 和 wiki/<领域>/summaries/
3. 识别未处理文件
4. 逐文件执行 INGEST 流程
5. 每个概念的 frontmatter 必须包含 sources 和 source-updated
6. 更新 index.md + log.md

## frontmatter 强制字段
```yaml
---
title, description, tags, category, summary
reliability: medium
sources: [raw/领域/文件名.md]
source-updated: 2026-06-07
---
```

## 检查清单
- [ ] 所有新页面有 sources
- [ ] 所有新页面有 source-updated
- [ ] 仅同域双链
- [ ] log.md 已记录 compile 结果
