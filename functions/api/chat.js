// Cloudflare Pages Function - AI Chat API v3 (debug mode)
function searchIndex(index, question, topK) {
  const q = question.toLowerCase();
  const scores = [];
  for (const [slug, item] of Object.entries(index)) {
    const text = (item.title + ' ' + (item.content || '')).toLowerCase();
    let score = 0;
    if (text.includes(q)) score += 10;
    const terms = q.split(/[\s,\u3001\u3002\uff0c\uff01\uff1f\u0020\u300a\u300b\u201c\u201d]+/).filter(t => t.length > 0);
    for (const term of terms) {
      if (term.length >= 2 && text.includes(term)) {
        if (item.title.toLowerCase().includes(term)) score += 5;
        score += (text.match(new RegExp(term.replace(/[.*+?^${}()|[\]\]/g, '\$&'), 'g')) || []).length;
      }
    }
    if (q.length >= 3) {
      for (let i = 0; i < q.length - 2; i++) {
        const tri = q.substring(i, i + 3);
        if (text.includes(tri)) score += 2;
      }
    }
    if (score > 0) scores.push({ slug, title: item.title, content: (item.content || '').slice(0, 500), score });
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
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Only POST supported" }), { status: 405, headers });
  }
  try {
    const { question } = await request.json();
    if (!question || !question.trim()) {
      return new Response(JSON.stringify({ error: "Please enter a question" }), { status: 400, headers });
    }
    
    const url = new URL(request.url);
    const baseUrl = url.protocol + "//" + url.host;
    const idxResp = await fetch(baseUrl + "/static/contentIndex.json");
    const index = await idxResp.json();
    const results = searchIndex(index, question);
    const contextText = results.map((r, i) =>
      "[Source " + (i+1) + "] " + r.title + "\n" + (r.content || "").slice(0, 300) + "\n---"
    ).join("\n");

    if (!env.AI) {
      const answer = results.length > 0
        ? "Found:\n\n" + results.map(r => "\u2022 " + r.title + ": " + (r.content || "").slice(0, 200)).join("\n")
        : "Not found.";
      return new Response(JSON.stringify({ answer, sources: results.map(r => r.slug) }), { headers });
    }

    // Try NON-streaming first to see if model works at all
    const systemPrompt = "You are a helpful wiki assistant. Answer based ONLY on the context below. Be concise in Chinese.\n\nContext:\n" + (contextText || "(No content)");
    
    const resp = await env.AI.run("@cf/google/gemma-4-26b-a4b-it", {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question }
      ]
    });
    
    // resp should be { response: "..." } for non-streaming
    const answer = resp.response || JSON.stringify(resp);
    
    return new Response(JSON.stringify({ 
      answer, 
      sources: results.map(r => r.slug),
      debug: { resultsCount: results.length, resultTitles: results.map(r => r.title) }
    }), { headers });
    
  } catch(e) {
    return new Response(JSON.stringify({ error: e.message, stack: e.stack }), { status: 500, headers });
  }
}
