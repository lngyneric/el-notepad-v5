// LLM Wiki Skill: INGEST - 获取摄入指令给任意 agent
const SKILL_MD = `---
name: llm-wiki-ingest
description: 摄入新源文件到所属领域维基（禁止跨域链接）
---

# LLM Wiki - Ingest Skill

## 核心规则
- **每个领域完全独立**：entities/、concepts/、summaries/ 各自在所属 <领域> 中
- **禁止跨域双链**：HR-培训 的 concept 不能 [[链接]] AI-技术 的页面
- 如果新内容明显属于另一个领域，告诉用户放错地方了

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
6. **git commit + push**

## 概念页 frontmatter 模板
title, description, tags, category, summary
reliability: medium
sources: [raw/领域/文件名.md]
source-updated: YYYY-MM-DD

## 检查清单
- [ ] 仅同域双链
- [ ] 无跨域 [[链接]]
- [ ] summaries/ 已创建
- [ ] concepts/ 已创建或更新
- [ ] index.md + log.md 已更新
- [ ] git commit + push
`;

export async function onRequest(context) {
  const { request } = context;
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };
  if (request.method === "OPTIONS") return new Response(null, { headers });
  if (request.method === "GET") {
    return new Response(JSON.stringify({
      skill: "ingest",
      description: "摄入新源文件到 wiki",
      instructions: SKILL_MD,
      endpoint: "POST /api/skill/ingest",
      params: { filePath: "raw/<领域>/文件名.md", url: "可选-在线文章URL" },
      execution: "local"
    }), { headers });
  }
  try {
    const { filePath, url } = await request.json();
    const domains = ["HR-培训","AI-技术","代码与项目","技能与工具","阅读-Books","工作记录"];
    let detectedDomain = null;
    if (filePath) {
      for (const d of domains) {
        if (filePath.includes(d)) { detectedDomain = d; break; }
      }
    }
    return new Response(JSON.stringify({
      skill: "ingest",
      action: "local_execution_required",
      message: "INGEST 需要本地执行文件操作。请在 Claude Code 中运行以下指令：",
      instructions: SKILL_MD,
      filePath: filePath || null,
      detectedDomain: detectedDomain,
      suggestedCommand: filePath ? `claude -p "请执行 /ingest，处理 ${filePath}"` : "claude -p "请执行 /ingest"",
    }), { headers });
  } catch(e) {
    return new Response(JSON.stringify({ error: e.message, skill: "ingest" }), { status: 500, headers });
  }
}
