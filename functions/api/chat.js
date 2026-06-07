// Cloudflare Pages Function - AI Chat API v6 (better Chinese search)
function searchIndex(index, question, topK) {
  const q = question.toLowerCase();
  const scores = [];
  
  // Split into terms: on whitespace, common punctuation, AND 2-char+ Chinese n-grams
  const rawTerms = q.split(/[\s,\u3001\u3002\uff0c\uff01\uff1f\u0020\u300a\u300b\u201c\u201d]+/).filter(t => t.length > 0);
  
  // Also generate 2-char sliding windows for Chinese text
  const extraTerms = [];
  for (const term of rawTerms) {
    for (let i = 0; i < term.length - 1; i++) {
      const bi = term.slice(i, i + 2);
      if (bi.length >= 2 && bi.match(/[\u4e00-\u9fff]/)) extraTerms.push(bi);
    }
  }
  const allTerms = [...rawTerms, ...extraTerms];
  
  for (const [slug, item] of Object.entries(index)) {
    if (!slug.includes("/concepts/")) continue;
    const text = (item.title + " " + (item.content || "")).toLowerCase();
    let score = 0;
    
    // Direct query match (high weight)
    if (text.includes(q)) score += 20;
    
    // Match each term
    for (const term of allTerms) {
      if (term.length < 2) continue;
      if (text.includes(term)) {
        if (item.title.toLowerCase().includes(term)) score += 5;
        let count = 0, pos = 0;
        while ((pos = text.indexOf(term, pos)) !== -1) { count++; pos += term.length; }
        score += count;
      }
    }
    
    if (score > 0) scores.push({ slug, title: item.title, content: (item.content || "").slice(0, 500), score });
  }
  
  scores.sort((a, b) => b.score - a.score);
  return scores.slice(0, topK || 5);
}

export async function onRequest(context) {
  const { request, env } = context;
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };
  if (request.method === "OPTIONS") return new Response(null, { headers });
  if (request.method !== "POST") return new Response(JSON.stringify({ error: "not allowed" }), { status: 405, headers });

  try {
    const { question } = await request.json();
    if (!question || !question.trim()) return new Response(JSON.stringify({ error: "empty question" }), { status: 400, headers });

    const url = new URL(request.url);
    const base = url.protocol + "//" + url.host;
    const idxResp = await fetch(base + "/static/contentIndex.json");
    const index = await idxResp.json();
    const results = searchIndex(index, question);
    const ctx = results.map(function(r, i) {
      return "[S" + (i+1) + "] " + r.title + "\n" + (r.content || "").slice(0, 300) + "\n---";
    }).join("\n");
    const sources = results.map(function(r) { return r.slug; });

    if (!env.AI) {
      const answer = results.length > 0
        ? "Found:\n" + results.map(function(r) { return "- " + r.title; }).join("\n")
        : "Not found.";
      return new Response(JSON.stringify({ answer: answer, sources: sources }), { headers });
    }

    const sys = "You are a helpful wiki assistant. Answer based on the context below. Be concise in Chinese.\n\nContext:\n" + (ctx || "No relevant content found.");

    const resp = await env.AI.run("@cf/google/gemma-4-26b-a4b-it", {
      messages: [
        { role: "system", content: sys },
        { role: "user", content: question }
      ]
    });

    let answer = "";
    if (resp.response) answer = resp.response;
    else if (resp.choices && resp.choices[0] && resp.choices[0].message) answer = resp.choices[0].message.content;
    else answer = JSON.stringify(resp);

    return new Response(JSON.stringify({ answer: answer, sources: sources }), { headers });

  } catch(e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers });
  }
}
