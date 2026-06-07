// LLM Wiki Skill: LINT - 健康检查，可扫描内容索引做部分服务端检查
const SKILL_MD = `---
name: llm-wiki-lint
description: 健康检查 - 可信度标注 + 过期销毁
---

# LLM Wiki - Lint Skill

## 检查项

### 1. 可信度标注 (reliability)
- high: 有明确数据源 (source-updated ≤ 7 天)
- medium: 有数据源但超过 7 天
- low: 无数据源或来自 LLM 推断

### 2. 过期销毁 (15 天规则)
- source-updated 超过 15 天 → 移入 wiki/<领域>/archived/

### 3. 孤立页面
- 无入站链接 + low 可信度 → 移入 archived/

### 4. 跨域链接检查
### 5. 索引同步
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
  // 服务端可检查 contentIndex 中的 reliability 状态
  try {
    const url = new URL(request.url);
    const base = url.protocol + "//" + url.host;
    const idxResp = await fetch(base + "/static/contentIndex.json");
    const index = await idxResp.json();

    let withReliability = 0, total = 0, expired = 0;
    const now = Date.now();
    for (const [slug, item] of Object.entries(index)) {
      if (!slug.includes("/concepts/")) continue;
      total++;
      if (item.reliability) withReliability++;
      if (item.sourceUpdated) {
        const days = (now - new Date(item.sourceUpdated).getTime()) / 86400000;
        if (days > 15) expired++;
      }
    }

    return new Response(JSON.stringify({
      skill: "lint",
      description: "健康检查 - 可信度标注 + 过期销毁",
      instructions: SKILL_MD,
      execution: "local",
      serverStats: {
        totalConcepts: total,
        withReliability: withReliability,
        withoutReliability: total - withReliability,
        expiredOver15Days: expired
      },
      suggestedCommand: "claude -p "请执行 /lint，检查 wiki 健康状态"",
    }), { headers });
  } catch(e) {
    return new Response(JSON.stringify({ error: e.message, skill: "lint" }), { status: 500, headers });
  }
}
