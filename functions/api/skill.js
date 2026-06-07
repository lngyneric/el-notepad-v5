// LLM Wiki Skills Router - 任意 agent 可通过此 API 调用
const SKILLS = {
  ingest: { description: "摄入新源文件到 wiki（需本地执行）", endpoint: "/api/skill/ingest", execution: "local" },
  query: { description: "查询 wiki 知识（服务端执行，支持 AI）", endpoint: "/api/skill/query", execution: "server" },
  compile: { description: "批量编译未处理源文件（需本地执行）", endpoint: "/api/skill/compile", execution: "local" },
  lint: { description: "健康检查 - 可信度 + 过期销毁（服务端可扫描）", endpoint: "/api/skill/lint", execution: "hybrid" },
};

export async function onRequest(context) {
  const { request } = context;
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };
  if (request.method === "OPTIONS") return new Response(null, { headers });

  return new Response(JSON.stringify({
    service: "EL-Notepad LLM Wiki Skills",
    version: "1.0.0",
    description: "可通过任意 HTTP 客户端调用的 Wiki 运维 Skills",
    usage: "POST /api/skill/<skill-name> 或 GET 查看说明",
    skills: SKILLS,
    domain: ["HR-培训", "AI-技术", "代码与项目", "技能与工具", "阅读-Books", "工作记录"],
    rules: [
      "禁止跨域链接 - 概念只链接同域页面",
      "可信度必标 - reliability: high/medium/low",
      "15天过期 - source-updated > 15天移入 archived/"
    ]
  }), { headers });
}
