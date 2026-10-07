# kb-core（vendored）

本目录的 `types.ts` / `auth.ts` / `gateway.ts` 是从 mdflow-docs 仓库
`src/kb-core/` 原样复制的通用 MCP 中间件（`KnowledgeSource` 接口 +
JSON-RPC 网关 + Bearer 鉴权），上游有更新时手动同步。

- 上游：`mdflow-docs` 仓库的 `src/kb-core/`
- 本仓库的装配：`functions/mcp.ts` + `functions/notes-index-source.ts`
- `static-assets-source.ts` 未复制（Pages Functions 没有 ASSETS binding，用不上）
