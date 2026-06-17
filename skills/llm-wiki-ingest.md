---
name: llm-wiki-ingest
description: 摄入新源文件到所属领域维基（禁止跨域链接）
---

# LLM Wiki - Ingest Skill

## 核心规则
- **每个领域完全独立**：entities/、concepts/、summaries/ 各自在所属 <领域> 中
- **禁止跨域双链**：HR-培训 的 concept 不能 [[链接]] AI-技术 的页面
- 如果新内容明显属于另一个领域，告诉用户放错地方了
- 不要创建跨域索引或汇总页

## 步骤
1. **确定领域**: 新文件在 raw/<领域>/ 中，wiki 操作也只在同一领域进行
2. **读源文件**: 理解内容，提取该领域内的实体和概念
3. **查重**: 检查 wiki/<领域>/index.md 和 concepts/ 避免重复
4. **创建/更新 wiki 页面**:
   - summaries/: 摘要页面
   - concepts/: 新概念页面，加 Evolution Log 条目
   - entities/: 新实体页面
   - **只建本域双链**: [[概念名]] 只链接同领域的页面
5. **更新 index.md + log.md**
6. **页面完整性检查**: 确认 summaries/ 文件数 = 新源文件数，concepts/ 文件数在合理范围，sources/ 副本完整
7. **更新根目录索引**: 检查 content/index.md 中是否有所属领域的入口链接，如缺失则补入
8. **检查非标准内容（只读报告，不删除）**: 检查 wiki/ 下是否存在非标准内容，**只生成清单提醒不改动**：
   - `wiki/` 根目录下的 .md / .canvas / 文件夹 → 列出提醒（如旧版单域残留 concepts/ entities/ sources/ 等）
   - 非标准领域目录（无 concepts/summaries 子目录）→ 列出提醒
   - **重要保护**: 以下目录不扫描不触碰 — `.obsidian/`（插件配置）、`raw/`（源文件）、`public/`、`node_modules/`、`.git/`
   - 输出格式：
     ```
     ⚠️ wiki 非标准内容清单:
     - wiki/concepts/ (13 files) — 旧版单域结构
     - wiki/entities/ (4 files) — 旧版单域结构
     - wiki/index.md — 旧版索引
     （用户确认后再清理）
     ```
9. **git add -A + git commit + git push**

## 概念页面模板
```markdown
---
title: "概念名"
description: "一句话说明"
tags: [domain, concept]
category: "分类名"
summary: "从本质理解的角度描述"
reliability: "medium"
sources: [源文件名]
source-updated: "YYYY-MM-DD"
---

# 概念名

## Evolution Log
- YYYY-MM-DD: 来自 [[源文件摘要]] 的认知：...

## 相关页面
- [[同域概念1]]
- [[同域概念2]]
```

## 检查清单
- [ ] 仅同域双链
- [ ] 无跨域 [[链接]]
- [ ] summaries/ 已创建
- [ ] concepts/ 已创建或更新
- [ ] index.md + log.md 已更新
- [ ] 页面完整性已确认
- [ ] 根目录 index.md 已同步
- [ ] wiki 非标准内容已检查（只读不删）
- [ ] 保护目录确认（.obsidian / raw / public / node_modules / .git）
- [ ] git add + commit + push
