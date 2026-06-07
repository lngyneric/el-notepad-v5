// LLM Wiki Skill: COMPILE - 批量编译，服务端可扫描但需本地执行
const SKILL_MD = `---
name: llm-wiki-compile
description: 批量编译未处理的 raw 源文件到 wiki，要求记录数据来源
---

# LLM Wiki - Compile Skill

## 规则
- 每个编译的概念/实体必须记录: sources, source-updated
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
reliability: medium
sources: [raw/领域/文件名.md]
source-updated: YYYY-MM-DD
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
  try {
    return new Response(JSON.stringify({
      skill: "compile",
      description: "批量编译未处理的 raw 源文件到 wiki",
      instructions: SKILL_MD,
      execution: "local",
      suggestedCommand: "claude -p "请执行 /compile，扫描所有未处理的 raw 文件"",
    }), { headers });
  } catch(e) {
    return new Response(JSON.stringify({ error: e.message, skill: "compile" }), { status: 500, headers });
  }
}
