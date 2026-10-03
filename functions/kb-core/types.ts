// kb-core 类型与 KnowledgeSource 接口：接入任意知识库的唯一扩展点。
// 网关、工具、鉴权都不感知具体知识库，只依赖这个接口。

export interface DocMeta {
  id: string;
  title: string;
  file: string;
  size: number; // 字节数
  updated_at: string | null;
  tags: string[];
  summary: string;
}

export interface SearchHit {
  slug: string;
  title: string;
  score: number;
  snippet: string;
  size: number;
  updated_at: string | null;
  tags: string[];
}

export interface DocumentText {
  id: string;
  title: string;
  text: string;
}

export interface SearchOptions {
  tag?: string;
  limit?: number;
}

export interface KnowledgeSource {
  readonly id: string;
  /** 列出全部文档（含元数据）；顺序即展示顺序 */
  listDocuments(): Promise<DocMeta[]>;
  /** 按 id 读正文；不存在返回 null */
  readDocument(id: string): Promise<DocumentText | null>;
  /** 可选：知识源自带检索；不实现则走 defaultSearch（关键词遍历，小语料够用） */
  search?(query: string, opts?: SearchOptions): Promise<SearchHit[]>;
}

export interface AskResult {
  route: string;
  confidence: number | null;
  reason: string | null;
  model: string;
  answer: string;
}

/** AI 问答后端：由装配层注入（如 mdflow-docs 的 Jev 路由 + Workers AI） */
export type AskBackend = (question: string, context: string) => Promise<AskResult>;

/** 默认关键词检索：遍历清单逐篇读正文计分，返回片段 */
export async function defaultSearch(
  source: KnowledgeSource,
  query: string,
  opts?: SearchOptions
): Promise<SearchHit[]> {
  const q = query.trim();
  if (!q) return [];
  const limit = Math.min(Math.max(opts?.limit ?? 3, 1), 10);
  const tag = (opts?.tag ?? "").trim();
  const metas = await source.listDocuments();
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  const scored: SearchHit[] = [];
  for (const meta of metas) {
    if (tag && !meta.tags.includes(tag)) continue;
    const doc = await source.readDocument(meta.id);
    if (!doc) continue;
    const lower = doc.text.toLowerCase();
    let score = 0;
    let firstHit = -1;
    for (const t of terms) {
      let i = -1;
      let n = 0;
      while ((i = lower.indexOf(t, i + 1)) !== -1) {
        n++;
        if (firstHit === -1 || i < firstHit) firstHit = i;
      }
      score += n;
    }
    if (score > 0) {
      const start = Math.max(0, firstHit - 60);
      const snippet =
        (start > 0 ? "…" : "") +
        doc.text.slice(start, firstHit + 120).replace(/\n+/g, " ") +
        "…";
      scored.push({
        slug: meta.id,
        title: meta.title,
        score,
        snippet,
        size: meta.size,
        updated_at: meta.updated_at,
        tags: meta.tags,
      });
    }
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}
