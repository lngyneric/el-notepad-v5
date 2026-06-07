---
name: llm-wiki-query
description: 在单域内查询 wiki 并回答
---

# LLM Wiki - Query Skill

## 规则
- 查询限制在用户指定的领域内
- 如果问题跨域，分别回答每个域的结果
- 不要跨域综合（除非用户明确要求）
- 始终用 [[双链]] 标注来源

## 步骤
1. 确定问题所属领域
2. 搜索该领域 index.md + concepts/
3. 读取匹配页面
4. 综合回答，用 [[同域链接]] 标注来源
5. 可选：优质回答回写入 wiki（仅写回同域）
6. 更新 log.md
