// EL-Notepad MCP 端点：https://el-notepad-v5.pages.dev/mcp
// 瘦知识库模式（list_documents / search_docs / read_doc），不注 askBackend。
// 鉴权：Pages 环境变量 MCP_AUTH_TOKEN（可选；未配置则保持开放）
import { createMcpHandler } from "./kb-core/gateway";
import { NotesIndexSource } from "./notes-index-source";

interface PagesContext {
  request: Request;
  env: Record<string, string | undefined>;
}

export async function onRequest(context: PagesContext): Promise<Response> {
  const { request, env } = context;
  const url = new URL(request.url);
  const base = url.protocol + "//" + url.host;
  const handler = createMcpHandler({
    source: new NotesIndexSource(base),
    serverName: "el-notepad-v5",
    serverVersion: "0.1.0",
    instructions:
      "EL-Notepad 个人知识库（Quartz/Obsidian，中文）：可列出笔记清单、全文检索（中文二元分词）、阅读笔记原文。7 大领域：HR-培训、AI-技术、代码与项目、技能与工具、阅读-Books、工作记录、摄影鉴赏。笔记 URL 规律：https://el-notepad-v5.pages.dev/{slug}/",
    endpointUrl: base + "/mcp",
    getAuthToken: () => env.MCP_AUTH_TOKEN,
    descriptions: {
      listDocuments: "列出知识库全部笔记的清单：slug、标题、路径、大小、标签和摘要（不含自动生成的标签页）。",
      searchDocs: "全文检索笔记（中文按二元分词，标题加权），返回标题、slug、上下文片段及元数据。可用 tag 缩小范围。",
      query: "检索关键词，如：RAG、培训体系、日报",
      tag: "按标签过滤（可选）",
      readDoc: "按 slug 读取整篇笔记的 markdown 原文。",
      slug: "笔记标识，如 wiki/AI-技术/index；可用 list_documents 查询",
    },
  });
  return handler(request);
}
