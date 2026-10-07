// EL-Notepad 知识源：读构建产物 /static/contentIndex.json（content-index emitter 生成）
// 实现 kb-core 的 KnowledgeSource 接口；中文检索逻辑 port 自 functions/api/chat.js
import type {
  DocMeta,
  DocumentText,
  KnowledgeSource,
  SearchHit,
  SearchOptions,
} from "./kb-core/types";

interface IndexEntry {
  slug: string;
  filePath: string;
  title: string;
  links: string[];
  tags: string[];
  content: string;
}

type ContentIndex = Record<string, IndexEntry>;

// 标签页是自动生成的导航页，不算知识库正文
function isNoteSlug(slug: string): boolean {
  return slug !== "tags" && !slug.startsWith("tags/");
}

// 模块级缓存：构建产物在一次部署内不可变，isolate 复用时直接命中
let cachedIndex: Promise<ContentIndex> | null = null;

async function loadIndex(base: string): Promise<ContentIndex> {
  if (!cachedIndex) {
    cachedIndex = fetch(base + "/static/contentIndex.json").then(async (r) => {
      if (!r.ok) throw new Error(`contentIndex.json HTTP ${r.status}`);
      return (await r.json()) as ContentIndex;
    }).catch((e) => {
      cachedIndex = null; // 失败则下次重试
      throw e;
    });
  }
  return cachedIndex;
}

export class NotesIndexSource implements KnowledgeSource {
  readonly id = "el-notepad";

  constructor(private readonly base: string) {}

  async listDocuments(): Promise<DocMeta[]> {
    const index = await loadIndex(this.base);
    const metas: DocMeta[] = [];
    for (const [slug, e] of Object.entries(index)) {
      if (!isNoteSlug(slug)) continue;
      const content = e.content ?? "";
      metas.push({
        id: slug,
        title: e.title || slug,
        file: e.filePath ?? "",
        size: new TextEncoder().encode(content).byteLength,
        updated_at: null, // contentIndex 不带日期；P1 可接 recent-notes 数据
        tags: e.tags ?? [],
        summary: content.slice(0, 200).replace(/\n+/g, " "),
      });
    }
    metas.sort((a, b) => a.id.localeCompare(b.id));
    return metas;
  }

  async readDocument(id: string): Promise<DocumentText | null> {
    if (!isNoteSlug(id)) return null;
    const index = await loadIndex(this.base);
    const e = index[id];
    if (!e) return null;
    return { id, title: e.title || id, text: e.content ?? "" };
  }

  /** 中文感知检索：二元分词 + 标题加权（逻辑 port 自 functions/api/chat.js） */
  async search(query: string, opts?: SearchOptions): Promise<SearchHit[]> {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const limit = Math.min(Math.max(opts?.limit ?? 3, 1), 10);
    const tag = (opts?.tag ?? "").trim();
    const index = await loadIndex(this.base);

    const rawTerms = q.split(/[\s,、。，？！《》“”]+/).filter((t) => t.length > 0);
    const extraTerms: string[] = [];
    for (const term of rawTerms) {
      for (let i = 0; i < term.length - 1; i++) {
        const bi = term.slice(i, i + 2);
        if (/[\u4e00-\u9fff]/.test(bi)) extraTerms.push(bi);
      }
    }
    const allTerms = [...rawTerms, ...extraTerms];

    const hits: SearchHit[] = [];
    for (const [slug, e] of Object.entries(index)) {
      if (!isNoteSlug(slug)) continue;
      if (tag && !(e.tags ?? []).includes(tag)) continue;
      const content = e.content ?? "";
      const text = (e.title + " " + content).toLowerCase();
      let score = 0;
      if (text.includes(q)) score += 20;
      for (const term of allTerms) {
        if (term.length < 2) continue;
        if (text.includes(term)) {
          if (e.title.toLowerCase().includes(term)) score += 5;
          let count = 0;
          let pos = 0;
          while ((pos = text.indexOf(term, pos)) !== -1) {
            count++;
            pos += term.length;
          }
          score += count;
        }
      }
      if (score > 0) {
        const cl = content.toLowerCase();
        let si = cl.indexOf(q);
        if (si === -1) {
          for (const t of allTerms) {
            const i = cl.indexOf(t);
            if (i !== -1) {
              si = i;
              break;
            }
          }
        }
        const start = Math.max(0, (si === -1 ? 0 : si) - 60);
        const snippet =
          (start > 0 ? "…" : "") + content.slice(start, start + 180).replace(/\n+/g, " ") + "…";
        hits.push({
          slug,
          title: e.title || slug,
          score,
          snippet,
          size: new TextEncoder().encode(content).byteLength,
          updated_at: null,
          tags: e.tags ?? [],
        });
      }
    }
    hits.sort((a, b) => b.score - a.score);
    return hits.slice(0, limit);
  }
}
