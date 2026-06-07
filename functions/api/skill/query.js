// LLM Wiki Skill: QUERY - 查询 wiki 并回答（完全服务端执行）
function searchIndex(index, question) {
  const q = question.toLowerCase();
  const scores = [];
  const rawTerms = q.split(/[\s,\u3001\u3002\uff0c\uff01\uff1f\u0020\u300a\u300b\u201c\u201d]+/).filter(t => t.length > 0);
  const extraTerms = [];
  for (const term of rawTerms) {
    for (let i = 0; i < term.length - 1; i++) {
      const bi = term.slice(i, i + 2);
      if (bi.length >= 2 && bi.match(/[\u4e00-\u9fff]/)) extraTerms.push(bi);
    }
  }
  const allTerms = [...rawTerms, ...extraTerms];

  let domain = null;
  const domainMap = { "hr":"hr-培训","ai":"ai-技术","代码":"代码与项目","技能":"技能与工具","书":"阅读-books","阅读":"阅读-books","工作":"工作记录" };
  for (const [key, val] of Object.entries(domainMap)) {
    if (q.includes(key)) { domain = val; break; }
  }

  for (const [slug, item] of Object.entries(index)) {
    if (!slug.includes("/concepts/")) continue;
    if (domain && !slug.startsWith("wiki/" + domain)) continue;
    const text = (item.title + " " + (item.content || "")).toLowerCase();
    let score = 0;
    if (text.includes(q)) score += 20;
    for (const term of allTerms) {
      if (term.length < 2) continue;
      if (text.includes(term)) {
        if (item.title.toLowerCase().includes(term)) score += 5;
        let pos = 0;
        while ((pos = text.indexOf(term, pos)) !== -1) { score++; pos += term.length; }
      }
    }
    if (score > 0) scores.push({ slug, title: item.title, category: item.category, content: (item.content || "").slice(0, 500), score, domain: slug.split("/")[1] });
  }
  scores.sort((a, b) => b.score - a.score);
  return scores.slice(0, 5);
}

const SKILL_INSTRUCTIONS = `## QUERY Skill 说明

查询 wiki 的知识。完全服务端执行。

### 调用方式
POST /api/skill/query
Body: { "question": "HR三支柱模型是什么" }

### 返回格式
{
  "answer": "AI 生成的回答",
  "sources": ["wiki/hr-培训/concepts/hr三支柱模型"],
  "domain": "hr-培训",
  "skill": "query"
}`;

export async function onRequest(context) {
  const { request, env } = context;
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };
  if (request.method === "OPTIONS") return new Response(null, { headers });
  if (request.method === "GET") {
    return new Response(JSON.stringify({ skill: "query", instructions: SKILL_INSTRUCTIONS, endpoint: "POST /api/skill/query", params: { question: "string" } }), { headers });
  }
  try {
    const { question } = await request.json();
    if (!question || !question.trim()) return new Response(JSON.stringify({ error: "empty question" }), { status: 400, headers });

    const url = new URL(request.url);
    const base = url.protocol + "//" + url.host;
    const idxResp = await fetch(base + "/static/contentIndex.json");
    const index = await idxResp.json();
    const results = searchIndex(index, question);
    const ctx = results.map((r, i) => "[S" + (i+1) + "] " + r.title + " (" + r.domain + ")\n" + (r.content || "").slice(0, 300) + "\n---").join("\n");
    const sources = results.map(r => r.slug);

    if (!env.AI) {
      return new Response(JSON.stringify({ answer: "Found " + results.length + " relevant pages:\n" + results.map(r => "- " + r.title).join("\n"), sources, domain: results[0]?.domain, skill: "query" }), { headers });
    }

    const domainHint = results[0]?.domain ? "Domain: " + results[0].domain + ". Answer based ONLY on this domain." : "";
    const sys = "You are a helpful wiki assistant. Answer based on the context below. Be concise in Chinese. Cite sources.\n\n" + domainHint + "\n\nContext:\n" + (ctx || "No content found.");

    const resp = await env.AI.run("@cf/google/gemma-4-26b-a4b-it", {
      messages: [{ role: "system", content: sys }, { role: "user", content: question }]
    });

    const answer = resp.response || (resp.choices?.[0]?.message?.content) || JSON.stringify(resp);
    return new Response(JSON.stringify({ answer, sources, domain: results[0]?.domain, skill: "query" }), { headers });
  } catch(e) {
    return new Response(JSON.stringify({ error: e.message, skill: "query" }), { status: 500, headers });
  }
}
