// Cloudflare Pages Function - AI Chat API
function searchIndex(index, question, topK) {
  const terms = question.toLowerCase().split(/[\s,\u3001\u3002\uff0c\uff01\uff1f\u0020]+/).filter(t => t.length > 1);
  const scores = [];
  for (const [slug, item] of Object.entries(index)) {
    const text = (item.title + ' ' + (item.content || '')).toLowerCase();
    let score = 0;
    for (const term of terms) {
      if (text.includes(term)) {
        if (item.title.toLowerCase().includes(term)) score += 3;
        score += (text.match(new RegExp(term, 'g')) || []).length;
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
      "[Source " + (i+1) + "] " + r.title + "\n" + r.content.slice(0, 300) + "\n---"
    ).join("\n");

    if (!env.AI) {
      // Fallback: no AI binding configured
      const answer = results.length > 0
        ? "Found relevant content:\n\n" + results.map(r => "\u2022 " + r.title + ": " + r.content.slice(0, 200)).join("\n")
        : "No relevant content found. Please try a different question.";
      return new Response(JSON.stringify({ answer, sources: results.map(r => r.slug) }), { headers });
    }

    const systemPrompt = "You are a helpful wiki assistant. Answer based on the context below.\n\nRelevant wiki content:\n" + (contextText || "(No directly relevant content found)");

    const stream = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question }
      ],
      stream: true,
    });

    const readable = new ReadableStream({
      async start(controller) {
        const enc = new TextEncoder();
        try {
          for await (const chunk of stream) {
            const text = chunk.response || "";
            controller.enqueue(enc.encode(JSON.stringify({ text }) + "\n"));
          }
          controller.enqueue(enc.encode(JSON.stringify({ done: true, sources: results.map(r => r.slug) }) + "\n"));
        } catch(e) {
          controller.enqueue(enc.encode(JSON.stringify({ error: e.message }) + "\n"));
        }
        controller.close();
      }
    });

    return new Response(readable, {
      headers: { ...headers, "Content-Type": "text/event-stream" }
    });
  } catch(e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers });
  }
}
