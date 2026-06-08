---
source: raw/05_代码与项目/NanoBanana-PPT-Skills-main/NanoBanana-PPT-Skills-main/API_MANAGEMENT.md
raw_sha256: 8216703a9906812d1c941f172708525807a5e3a32628ea512a01a4a9c5deff72
compiled_at: 2026-04-14T04:06:49.924Z
---
# NanoBanana-PPT-Skills API 密钥管理规范

> 来源路径：`raw/05_代码与项目/NanoBanana-PPT-Skills-main/NanoBanana-PPT-Skills-main/API_MANAGEMENT.md`

---

## TL;DR

本项目 API 密钥统一存储在 `ppt-generator/.env` 文件，由 `.gitignore` 保护不会提交到 Git，通过 `run.sh` 自动加载，开发时禁止硬编码密钥，必须从环境变量读取，遵循统一的安全管理规范即可。

---

## 目录
- [当前配置](#当前配置)
- [API 管理规范](#api-管理规范)
- [.env 文件结构](#env-文件结构)
- [安全检查清单](#安全检查清单)
- [最佳实践](#最佳实践)
- [迁移指南](#迁移指南)
- [常见问题](#常见问题)
- [总结](#总结)

---

## 当前配置

### API 存储位置
所有 API 密钥现在统一存储在：
```
📁 ppt-generator/.env
```

### 当前安全验证状态
| 项目 | 状态 |
|------|------|
| `.env` 文件已创建 | ✅ |
| 已被 `.gitignore` 保护（第15行规则） | ✅ |
| 不会被提交到 Git | ✅ |
| `run.sh` 可以正确加载 | ✅ |

### 使用方法
无需额外配置，直接使用即可：
```bash
./run.sh --plan slides_plan.json --style styles/gradient-glass.md --resolution 2K
```
运行后输出以下内容说明加载正常：
```
📌 从 .env 文件加载API密钥
```

---

## API 管理规范

### 1. 添加新的 API 密钥
编辑 `.env` 文件：
```bash
# 使用编辑器打开
nano .env

# 或使用 VS Code
code .env
```
按照以下格式添加：
```bash
# API 名称说明
# 用途：描述这个 API 的用途
# 获取地址：https://...
API_NAME=your-api-key-here
```

示例：
```bash
# OpenAI API
# 用途：未来可能用于文档分析
# 获取地址：https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
```

### 2. 在代码中使用 API 密钥
❌ **错误做法（硬编码，禁止使用）**：
```python
# 绝对不要这样做！
api_key = "AIzaSyAfHE4vctPhMF2mVn96aEZZp8WuURlaGpM"
```

✅ **正确做法（从环境变量读取）**：
```python
import os

# 从环境变量读取
api_key = os.environ.get("GEMINI_API_KEY")

# 或带默认值
api_key = os.getenv("GEMINI_API_KEY", "")

# 检查是否存在
if not api_key:
    raise ValueError("未找到 GEMINI_API_KEY 环境变量")
```

### 3. 环境变量加载优先级
`run.sh` 的加载逻辑：
```mermaid
graph TD
A[1. 系统环境变量（~/.zshrc 等）] -->|未找到| B[2. .env 文件]
B -->|未找到| C[3. 报错提示用户配置]
```
特性：
- ✅ CI/CD 环境可以使用系统环境变量
- ✅ 本地开发使用 .env 文件
- ✅ 灵活切换不同环境的密钥

### 4. 多环境管理
如果需要管理开发/测试/生产多个环境，按环境创建配置文件：
```bash
# 开发环境
.env.development

# 测试环境
.env.test

# 生产环境
.env.production
```
使用时切换：
```bash
# 复制对应环境的配置
cp .env.development .env

# 或使用符号链接（更方便切换）
ln -sf .env.development .env
```

---

## .env 文件结构

### 当前文件结构
```bash
.env
├─ [注释区域]
│  ├─ 安全提醒
│  ├─ 使用说明
│  └─ 加载优先级说明
│
├─ [主要 API 密钥]
│  └─ GEMINI_API_KEY (已配置)
│
├─ [备用 API 密钥]
│  ├─ OPENAI_API_KEY (注释状态)
│  ├─ ANTHROPIC_API_KEY (注释状态)
│  └─ STABILITY_API_KEY (注释状态)
│
└─ [项目配置]
   ├─ DEFAULT_RESOLUTION (注释状态)
   ├─ DEFAULT_STYLE (注释状态)
   └─ OUTPUT_DIR (注释状态)
```

### 预定义字段说明
| 变量名 | 状态 | 用途 | 获取地址 |
|--------|------|------|----------|
| `GEMINI_API_KEY` | ✅ 已配置 | Nano Banana Pro 图像生成 | [Google AI Studio](https://makersuite.google.com/app/apikey) |
| `OPENAI_API_KEY` | 💤 预留 | 未来可能用于文档分析 | [OpenAI Platform](https://platform.openai.com/api-keys) |
| `ANTHROPIC_API_KEY` | 💤 预留 | 未来可能用于Claude API | [Anthropic Console](https://console.anthropic.com/) |
| `STABILITY_API_KEY` | 💤 预留 | 未来可能用于其他图像模型 | [Stability AI](https://platform.stability.ai/) |

---

## 安全检查清单

### 开发时检查
- [ ] 从不在代码中硬编码 API 密钥
- [ ] 使用 `os.environ.get()` 或 `os.getenv()` 读取
- [ ] 添加密钥缺失时的错误提示
- [ ] 在函数/类初始化时读取，不要每次请求都读

### 提交前检查
- [ ] 运行 `git status` 确认 .env 不在待提交列表中
- [ ] 运行 `grep -r "AIzaSy" --exclude-dir=.git .` 无输出（无硬编码密钥）
- [ ] 检查 `.gitignore` 包含 `.env`
- [ ] 代码中无任何硬编码的密钥

### 分享项目时检查
- [ ] 提供 `.env.example` 作为模板
- [ ] 在 README 中说明如何配置
- [ ] 不要通过聊天/邮件发送 .env 文件
- [ ] 建议用户使用自己的 API 密钥

---

## 最佳实践

### 1. 密钥轮换
定期更新 API 密钥（建议 3-6 个月），步骤：
```bash
# 1. 在 API 平台生成新密钥
# 2. 更新 .env 文件
# 3. 测试功能正常
# 4. 撤销旧密钥
```

### 2. 最小权限原则
为不同用途创建不同权限的 API 密钥：
```bash
# 开发用（限制配额）
GEMINI_API_KEY_DEV=...

# 生产用（完整权限）
GEMINI_API_KEY_PROD=...
```

### 3. 友好错误处理
推荐封装统一的密钥获取函数：
```python
import os
import sys

def get_api_key(key_name):
    """安全获取 API 密钥"""
    api_key = os.getenv(key_name)

    if not api_key:
        print(f"❌ 错误: 未找到 {key_name} 环境变量")
        print("")
        print("请配置 API 密钥：")
        print("1. 编辑 .env 文件")
        print("2. 添加：{key_name}=your-key")
        print("3. 保存并重新运行")
        sys.exit(1)

    return api_key

# 使用示例
gemini_key = get_api_key("GEMINI_API_KEY")
```

### 4. 日志安全
禁止在日志中输出完整密钥，只输出部分片段用于调试：
```python
# ❌ 危险做法
print(f"Using API key: {api_key}")

# ✅ 安全做法
print(f"Using API key: {api_key[:8]}...{api_key[-4:]}")
# 输出示例: Using API key: AIzaSyAf...GpM
```

---

## 迁移指南

### 从系统环境变量迁移到 .env
如果您之前在 `~/.zshrc` 等系统配置中配置了密钥，按以下步骤迁移：
1. 从系统配置删除密钥：
```bash
# 编辑配置文件
nano ~/.zshrc

# 删除对应 export 行：export GEMINI_API_KEY
