// LLM Wiki Skills API - 统一入口
// GET  /api/skill          -> 技能列表
// GET  /api/skill?name=     -> 特定技能说明
// POST /api/skill?name=query -> 执行查询（服务端）

const SKILL_META = {
  ingest: { description: "摄入新源文件到wiki（需本地Claude Code执行）", execution: "local" },
  query: { description: "查询wiki知识（服务端AI执行）", execution: "server" },
  compile: { description: "批量编译未处理源文件（需本地执行）", execution: "local" },
  lint: { description: "健康检查-可信度+过期销毁（服务端可扫描）", execution: "hybrid" },
};

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const name = url.searchParams.get("name");
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };
  if (request.method === "OPTIONS") return new Response(null, { headers });

  // GET: 返回技能列表或特定技能说明
  if (request.method === "GET") {
    if (name && SKILL_META[name]) {
      return new Response(JSON.stringify({ skill: name, ...SKILL_META[name], instructions: "See /skills/llm-wiki-" + name + ".md" }), { headers });
    }
    return new Response(JSON.stringify({ skills: SKILL_META, usage: "GET /api/skill?name=<skill> | POST /api/skill?name=query" }), { headers });
  }

  // POST: 执行技能
  if (request.method === "POST" && name === "query") {
    const { question } = await request.json();
    if (!question) return new Response(JSON.stringify({ error: "empty question" }), { status: 400, headers });
    const idxResp = await fetch(url.origin + "/static/contentIndex.json");
    const index = await idxResp.json();

    // Search
    const q = question.toLowerCase();
    const terms = q.split(/[\s,，。！？、]+/).filter(t => t.length > 0);
    const extra = [];
    for (const t of terms) for (let i = 0; i < t.length - 1; i++) { const b = t.slice(i,i+2); if(b.match(/[\u4e00-\u9fff]/)) extra.push(b); }
    const all = [...terms, ...extra];
    const scores = [];
    for (const [slug, item] of Object.entries(index)) {
      if (!slug.includes("/concepts/")) continue;
      const text = (item.title + " " + (item.content || "")).toLowerCase();
      let score = 0;
      if (text.includes(q)) score += 20;
      for (const t of all) { if (t.length>=2 && text.includes(t)) { if(item.title.toLowerCase().includes(t)) score+=5; let p=0; while((p=text.indexOf(t,p))!==-1){score++;p+=t.length;} } }
      if (score > 0) scores.push({ slug, title: item.title, content: (item.content||"").slice(0,500), score });
    }
    scores.sort((a,b) => b.score - a.score);
    const results = scores.slice(0,5);
    const ctx = results.map((r,i) => "[S"+(i+1)+"] "+r.title+"\n"+(r.content||"").slice(0,300)).join("\n---\n");
    const sources = results.map(r => r.slug);

    if (!context.env.AI) {
      return new Response(JSON.stringify({ answer: results.length>0?"Found:\n"+results.map(r=>" - "+r.title).join("\n"):"Not found", sources }), { headers });
    }

    const sys = "You are a wiki assistant. Answer based on context. Be concise in Chinese.\n\nContext:\n" + (ctx || "No content.");
    const resp = await context.env.AI.run("@cf/google/gemma-4-26b-a4b-it", { messages: [{role:"system",content:sys},{role:"user",content:question}] });
    const answer = resp.response || (resp.choices?.[0]?.message?.content) || JSON.stringify(resp);
    return new Response(JSON.stringify({ answer, sources }), { headers });
  }

  // POST: 其他技能返回指令
  if (request.method === "POST" && name && SKILL_META[name] && name !== "query") {
    return new Response(JSON.stringify({ skill: name, action: "local_execution", message: "请在Claude Code中执行", ...SKILL_META[name] }), { headers });
  }

  return new Response(JSON.stringify({ error: "unknown skill" }), { status: 400, headers });
}
