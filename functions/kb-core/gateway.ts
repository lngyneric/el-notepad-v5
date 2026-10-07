// kb-core 网关：无状态 Streamable HTTP（JSON-RPC）MCP 网关
// 实现 initialize / notifications / ping / tools.list / tools.call
// 工具（ask 仅当注入 askBackend 时注册）：
//   list_documents / search_docs / read_doc / ask（带引用溯源 sources）
import type { AskBackend, KnowledgeSource } from "./types";
import { defaultSearch } from "./types";
import { isAuthorized } from "./auth";

const PROTOCOL_VERSIONS = ["2025-06-18", "2025-03-26", "2024-11-05"];

interface JsonRpcRequest {
  jsonrpc: "2.0";
  id?: string | number | null;
  method: string;
  params?: Record<string, unknown>;
}

export interface ToolDescriptions {
  listDocuments?: string;
  searchDocs?: string;
  query?: string;
  tag?: string;
  readDoc?: string;
  slug?: string;
  ask?: string;
  question?: string;
  doc?: string;
}

export interface GatewayOptions {
  source: KnowledgeSource;
  serverName: string;
  serverVersion: string;
  instructions: string;
  /** 说明页上展示的连接地址，如 https://xxx.workers.dev/mcp */
  endpointUrl: string;
  /** 请求时读取鉴权 token（Worker secret）；返回 undefined 则不强制鉴权 */
  getAuthToken: () => string | undefined;
  /** AI 问答后端；不传则不注册 ask 工具（瘦知识库模式） */
  askBackend?: AskBackend;
  /** 工具文案覆盖；不传则用通用默认文案 */
  descriptions?: ToolDescriptions;
}

const DEFAULT_DESCRIPTIONS: Required<ToolDescriptions> = {
  listDocuments: "列出知识库中所有文档的清单：slug、标题、路径、大小、更新时间、标签和摘要。",
  searchDocs: "全文检索知识库文档，返回匹配的文档标题、slug、上下文片段及元数据（大小/更新时间/标签）。可用 tag 缩小范围。",
  query: "检索关键词",
  tag: "按标签过滤（可选）",
  readDoc: "按 slug 读取整篇知识库文档的原文。",
  slug: "文档标识，可用 list_documents 查询",
  ask: "围绕知识库文档向 AI 提问，返回答案及引用来源（sources）。",
  question: "要问的问题",
  doc: "限定在哪篇文档范围内回答（可选，不填则以全库为上下文）",
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept, Mcp-Session-Id, Authorization",
};

function jsonRpcResult(id: string | number | null | undefined, result: unknown) {
  return Response.json(
    { jsonrpc: "2.0", id: id ?? null, result },
    { headers: { "Content-Type": "application/json", ...corsHeaders } }
  );
}

function jsonRpcError(id: string | number | null | undefined, code: number, message: string) {
  return Response.json(
    { jsonrpc: "2.0", id: id ?? null, error: { code, message } },
    { headers: { "Content-Type": "application/json", ...corsHeaders } }
  );
}

function unauthorizedResponse() {
  return new Response(
    JSON.stringify({
      jsonrpc: "2.0",
      id: null,
      error: { code: -32001, message: "unauthorized: 需要有效的 Bearer token" },
    }),
    { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
  );
}

function toolText(text: string) {
  return { content: [{ type: "text", text }] };
}

function errText(text: string) {
  return { ...toolText(text), isError: true };
}

async function buildTools(opts: GatewayOptions) {
  const d = { ...DEFAULT_DESCRIPTIONS, ...opts.descriptions };
  const slugs = (await opts.source.listDocuments()).map((m) => m.id);
  // slug 多到一定规模时不再用 enum（schema 会爆炸），改用纯字符串
  const slugSchema: Record<string, unknown> = { type: "string", description: d.slug };
  if (slugs.length <= 50) slugSchema.enum = slugs;
  interface ToolDef {
    name: string;
    description: string;
    inputSchema: { type: string; properties: Record<string, unknown>; required?: string[] };
  }
  const tools: ToolDef[] = [
    {
      name: "list_documents",
      description: d.listDocuments,
      inputSchema: { type: "object", properties: {} },
    },
    {
      name: "search_docs",
      description: d.searchDocs,
      inputSchema: {
        type: "object",
        properties: {
          query: { type: "string", description: d.query },
          limit: { type: "number", description: "最多返回几条，默认 3" },
          tag: { type: "string", description: d.tag },
        },
        required: ["query"],
      },
    },
    {
      name: "read_doc",
      description: d.readDoc,
      inputSchema: {
        type: "object",
        properties: {
          slug: slugSchema,
        },
        required: ["slug"],
      },
    },
  ];
  if (opts.askBackend) {
    tools.push({
      name: "ask",
      description: d.ask,
      inputSchema: {
        type: "object",
        properties: {
          question: { type: "string", description: d.question },
          doc: { ...slugSchema, description: d.doc },
        },
        required: ["question"],
      },
    });
  }
  return tools;
}

async function callListDocuments(source: KnowledgeSource) {
  return toolText(JSON.stringify(await source.listDocuments(), null, 2));
}

async function callSearchDocs(source: KnowledgeSource, args: Record<string, unknown>) {
  const query = String(args.query ?? "").trim();
  if (!query) return errText("query 不能为空");
  const limit = Math.min(Math.max(Number(args.limit ?? 3) || 3, 1), 10);
  const tag = String(args.tag ?? "").trim();
  const hits = source.search
    ? await source.search(query, { tag, limit })
    : await defaultSearch(source, query, { tag, limit });
  return toolText(JSON.stringify(hits, null, 2));
}

async function callReadDoc(source: KnowledgeSource, args: Record<string, unknown>) {
  const slug = String(args.slug ?? "");
  const doc = await source.readDocument(slug);
  if (!doc) {
    const all = await source.listDocuments();
    const shown = all
      .slice(0, 20)
      .map((m) => m.id)
      .join(", ");
    const more = all.length > 20 ? `（等共 ${all.length} 篇，用 list_documents 查询完整清单）` : "";
    return errText(`未知文档 slug: ${slug}，可用：${shown}${more}`);
  }
  return toolText(`# ${doc.title}\n\n${doc.text}`);
}

async function callAsk(source: KnowledgeSource, askBackend: AskBackend, args: Record<string, unknown>) {
  const question = String(args.question ?? "").trim();
  if (!question) return errText("question 不能为空");
  const slug = String(args.doc ?? "");
  const sources: { slug: string; title: string }[] = [];
  let docContent: string;
  if (slug) {
    const doc = await source.readDocument(slug);
    if (!doc) return errText(`未知文档 slug: ${slug}`);
    docContent = `# ${doc.title}\n${doc.text}`;
    sources.push({ slug: doc.id, title: doc.title });
  } else {
    // 不指定文档时默认以全库为上下文，保证答案可溯源
    const parts: string[] = [];
    for (const meta of await source.listDocuments()) {
      const doc = await source.readDocument(meta.id);
      if (!doc) continue;
      parts.push(`# ${doc.title}\n${doc.text}`);
      sources.push({ slug: doc.id, title: doc.title });
    }
    docContent = parts.join("\n\n---\n\n");
  }
  const res = await askBackend(question, docContent);
  return toolText(
    JSON.stringify(
      {
        route: res.route,
        reason: res.reason,
        confidence: res.confidence,
        model: res.model,
        sources,
        answer: res.answer,
      },
      null,
      2
    )
  );
}

export function createMcpHandler(opts: GatewayOptions): (request: Request) => Promise<Response> {
  async function handleOne(req: JsonRpcRequest): Promise<Response | null> {
    const id = req.id ?? null;
    const isNotification = req.id === undefined;
    switch (req.method) {
      case "initialize": {
        const params = (req.params ?? {}) as Record<string, unknown>;
        const want = String(params.protocolVersion ?? "");
        const version = PROTOCOL_VERSIONS.includes(want) ? want : PROTOCOL_VERSIONS[0];
        return jsonRpcResult(id, {
          protocolVersion: version,
          capabilities: { tools: {} },
          serverInfo: { name: opts.serverName, version: opts.serverVersion },
          instructions: opts.instructions,
        });
      }
      case "ping":
        return jsonRpcResult(id, {});
      case "tools/list":
        return jsonRpcResult(id, { tools: await buildTools(opts) });
      case "tools/call": {
        const params = (req.params ?? {}) as Record<string, unknown>;
        const name = String(params.name ?? "");
        const args = (params.arguments ?? {}) as Record<string, unknown>;
        try {
          if (name === "list_documents") return jsonRpcResult(id, await callListDocuments(opts.source));
          if (name === "search_docs") return jsonRpcResult(id, await callSearchDocs(opts.source, args));
          if (name === "read_doc") return jsonRpcResult(id, await callReadDoc(opts.source, args));
          if (name === "ask") {
            if (!opts.askBackend) return jsonRpcError(id, -32602, `未知工具: ${name}`);
            return jsonRpcResult(id, await callAsk(opts.source, opts.askBackend, args));
          }
          return jsonRpcError(id, -32602, `未知工具: ${name}`);
        } catch (e) {
          return jsonRpcResult(id, errText(`工具执行失败: ${String(e)}`));
        }
      }
      default:
        // 以 notifications/ 开头的是通知，无需响应
        if (req.method.startsWith("notifications/") || isNotification) return null;
        return jsonRpcError(id, -32601, `未知方法: ${req.method}`);
    }
  }

  return async function handleMcp(request: Request): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }
    if (!isAuthorized(request, opts.getAuthToken())) return unauthorizedResponse();
    if (request.method === "GET") {
      // 浏览器直接打开时给个说明页
      const toolNames = (await buildTools(opts)).map((t) => t.name).join(" / ");
      return new Response(
        `${opts.serverName} MCP 网关（${opts.serverName} v${opts.serverVersion}）\n\n` +
          `这是一个 Streamable HTTP MCP 端点，请用 MCP 客户端连接：\n` +
          `  ${opts.endpointUrl}\n\n` +
          `可用工具：${toolNames}` +
          (opts.getAuthToken() ? `\n\n此端点已启用 Bearer token 鉴权。` : ``),
        { headers: { "Content-Type": "text/plain; charset=utf-8", ...corsHeaders } }
      );
    }
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
    }
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonRpcError(null, -32700, "请求体不是合法 JSON");
    }
    const requests = Array.isArray(body) ? body : [body];
    const responses: Response[] = [];
    for (const r of requests) {
      const req = r as JsonRpcRequest;
      if (!req || req.jsonrpc !== "2.0" || typeof req.method !== "string") {
        responses.push(jsonRpcError((r as JsonRpcRequest)?.id ?? null, -32600, "无效的 JSON-RPC 请求"));
        continue;
      }
      const resp = await handleOne(req);
      if (resp) responses.push(resp);
    }
    if (responses.length === 0) {
      return new Response(null, { status: 202, headers: corsHeaders });
    }
    if (!Array.isArray(body) && responses.length === 1) return responses[0];
    // 批量：逐个解析 JSON 再合并
    const merged = [];
    for (const r of responses) merged.push(await r.json());
    return Response.json(merged, {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  };
}
