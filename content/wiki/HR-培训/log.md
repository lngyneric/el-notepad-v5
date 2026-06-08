# HR-培训 操作日志

## 2026-06-06 restructure | 初始化 HR-培训 领域
- 创建领域独立维基结构（多领域维基模式）
- 迁移 raw/ 中 HR 相关源文件到 raw/HR-培训/
- 迁移 wiki 中 HR 相关概念/实体/摘要到 wiki/HR-培训/
- raw 源文件数: 128
- 概念数: 87
- 实体数: 1
- 摘要数: 14
- sources: 2
- 当前领域: HR-培训（仅此领域已就绪，其余待创建）

## 2026-06-07 compile | HR-培训 编译
- 处理未编译文件：01_项目文档/HR信息生命周期管理系统/README.md
- 新概念: [[HR信息生命周期管理系统]]
- 新摘要: [[01_项目文档/HR信息生命周期管理系统/README]]
- 补全 5 个缺失 source 副本
- 概念数: 87 → 88
- 摘要数: 14 → 19
- sources 新增 6 个

## 2026-06-07 lint | Decay Model Health Check
- Reliability: high=1 medium=0 low=119 auto-fixed=119
- Expired: 0 pages（无 source-updated > 15 天）
- Cross-domain links: 0 违规
- Index synced: 一致（concepts=120）

## 工作流程
- INGEST: 新源文件放入 raw/HR-培训/
- COMPILE: 读取 raw/ 更新 wiki/HR-培训/
- QUERY: 在 wiki/HR-培训/index.md 中查找
- LINT: 定期检查矛盾/孤立页面
