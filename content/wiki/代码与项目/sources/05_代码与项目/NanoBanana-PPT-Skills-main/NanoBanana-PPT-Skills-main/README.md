---
source: raw/05_代码与项目/NanoBanana-PPT-Skills-main/NanoBanana-PPT-Skills-main/README.md
raw_sha256: b9d2b3015017d10d860bfa6969fa14daeedcbfee4bbbdd3a675db19ea3132d4f
compiled_at: 2026-04-14T04:07:48.468Z
---
# NanoBanana PPT Skills
> 基于 AI 自动生成高质量 PPT 图片和视频的工具

---

## TL;DR
NanoBanana PPT Skills 是一个 AI 驱动的 PPT 生成工具，可基于输入文档自动生成带智能转场的 PPT 图片或完整 PPT 视频，支持 Claude Code Skill 调用，支持多风格自定义，需要 Google Gemini API 密钥（基础功能必需），可灵 AI API 密钥（转场视频功能可选）。

---

## 基本信息
| 项目 | 信息 |
|------|------|
| 当前版本 | 2.0.0 |
| 开源协议 | MIT |
| 要求 Python 版本 | 3.8+ |
| 创作者 | [歸藏](https://github.com/op7418) |
| 项目仓库 | https://github.com/op7418/NanoBanana-PPT-Skills |

---

## 核心功能
### 核心能力
- 🤖 智能文档分析，自动提取核心要点规划 PPT 结构
- 🎨 支持多种视觉风格，可无限扩展自定义风格
- 🖼️ 支持生成 2K/4K 分辨率 16:9 PPT 图片，约 30 秒/页（2K）
- 🎬 可灵 AI 生成流畅的页面转场动画
- 🎮 支持视频+图片混合的交互式播放器，支持键盘导航
- 🎥 一键导出包含所有转场的完整 PPT 视频
- 📊 自动识别封面页/内容页/数据页，适配对应布局

### v2.0 新增视频特性
- 首页自动生成循环预览动画
- 页面间智能转场视频自动生成
- 按键翻页播放转场，结束后显示静态页的交互模式
- 自动统一所有视频分辨率、帧率，保证拼接流畅

---

## 支持的视觉风格
| 风格 | 特点 | 适用场景 |
|------|------|----------|
| 渐变毛玻璃卡片 | Apple Keynote 极简主义、玻璃拟态、霓虹渐变、3D 光照 | 科技产品、商务演示、数据报告、企业展示 |
| 矢量插画 | 扁平化、黑色轮廓、复古柔和配色、几何简化 | 教育培训、创意提案、儿童相关、品牌故事 |

可在 `styles/` 目录新建 markdown 文件自定义添加新风格。

---

## 安装方式

### 方式一：Claude Code 自动安装（推荐）
1. 提前获取 API 密钥：
   - 必需：[Google AI API 密钥](https://aistudio.google.com/apikey)
   - 可选（视频功能）：[可灵 AI API 密钥](https://klingai.com)
2. 将下方提示词替换密钥后发送给 Claude Code，即可自动完成安装：
```
请帮我安装 NanoBanana PPT Skills：

1. 克隆项目并进入目录：
   git clone https://github.com/op7418/NanoBanana-PPT-Skills.git
   cd NanoBanana-PPT-Skills

2. 创建 Python 虚拟环境：
   python3 -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate

3. 安装依赖：
   pip install google-genai pillow python-dotenv

4. 配置 API 密钥 - 创建 .env 文件：
   cp .env.example .env

5. 编辑 .env 文件，填入我的 API 密钥：

   GEMINI_API_KEY=YOUR_GEMINI_API_KEY
   KLING_ACCESS_KEY=YOUR_KLING_ACCESS_KEY
   KLING_SECRET_KEY=YOUR_KLING_SECRET_KEY

   注意：
   - GEMINI_API_KEY: Google AI API 密钥（必需，用于生成 PPT 图片）
   - KLING_ACCESS_KEY 和 KLING_SECRET_KEY: 可灵 AI 密钥（可选，用于生成转场视频）

6. 验证安装：
   python3 generate_ppt.py --help

完成后，告诉我安装结果和如何使用。

我的 API 密钥：
- GEMINI_API_KEY: YOUR_GEMINI_API_KEY_HERE
- KLING_ACCESS_KEY: YOUR_KLING_ACCESS_KEY_HERE (可选)
- KLING_SECRET_KEY: YOUR_KLING_SECRET_KEY_HERE (可选)
```

### 方式二：手动安装
1. 克隆项目
```bash
git clone https://github.com/op7418/NanoBanana-PPT-Skills.git
cd NanoBanana-PPT-Skills
```

2. 创建虚拟环境
```bash
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

3. 安装依赖
```bash
pip install google-genai pillow
```
如果需要视频功能，额外安装 FFmpeg：
```bash
# macOS
brew install ffmpeg
# Ubuntu/Debian
sudo apt-get install ffmpeg
# Windows：下载 FFmpeg 并添加到系统 PATH
```

4. 配置 API 密钥
```bash
cp .env.example .env
# 编辑 .env 文件填入你的密钥
```
```env
# Google AI API 密钥（必需）
GEMINI_API_KEY=your_gemini_api_key_here
# 可灵 AI API 密钥（可选，视频功能需要）
KLING_ACCESS_KEY=your_kling_access_key_here
KLING_SECRET_KEY=your_kling_secret_key_here
```

5. 验证安装
```bash
python3 generate_ppt.py --help
# 输出帮助信息即安装成功
```

---

## 作为 Claude Code Skill 安装
支持直接作为 Claude Code 技能安装，可自然语言调用生成。

### 自动安装为 Skill
将下方提示词替换密钥后发送给 Claude Code 即可自动安装：
```
请帮我将 NanoBanana PPT Skills 安装为 Claude Code Skill：

1. 创建 Skill 目录：
   mkdir -p ~/.claude/skills/ppt-generator

2. 克隆项目到 Skill 目录：
   git clone https://github.com/op7418/NanoBanana-PPT-Skills.git ~/.claude/skills/ppt-generator

3. 进入目录并安装依赖：
   cd ~/.claude/skills/ppt-generator
   python3 -m venv venv
   source venv/bin/activate
   pip install google-genai pillow python-dotenv

4. 配置 API 密钥：
   cp .env.example .env

   然后编辑 .env 文件，填入我的 API 密钥：
   GEMINI_API_KEY=YOUR_GEMINI_API_KEY
   KLING_ACCESS_KEY=YOUR_KLING_ACCESS_KEY
   KLING_SECRET_KEY=YOUR_KLING_SECRET_KEY

5. 验证安装：
   python3 generate_ppt.py --help

完成后，告诉我如何在 Claude Code 中使用这个 Skill。

我的 API 密钥：
- GEMINI_API_KEY: YOUR_GEMINI_API_KEY_HERE
- KLING_ACCESS_KEY: YOUR_KLING_ACCESS_KEY_HERE (可选)
- KLING_SECRET_KEY: YOUR_KLING_SECRET_KEY_HERE (可选)
```

### 安装后使用方式
安装完成后直接在 Claude Code 中使用：
- 命令调用：`/ppt-generator-pro`
- 自然语言调用：例如 `我想基于以下文档生成一个 5 页的 PPT，使用渐变毛玻璃风格。[你的文档内容]`

### Skill 模式 vs 独立模式对比
| 特性 | Skill 模式 | 独立模式 |
|------|-----------|---------|
| 安装位置 | `~/.claude/skills/ppt-generator/` | 任意目录 |
| 调用方式 | 命令/自然语言 | 手动执行 Python 脚本 |
| 文档分析 | Claude 自动完成 | 需手动准备 JSON 规划文件 |
| 交互体验 | 对话式，自动询问配置 | 命令行参数指定 |
| 适用场景 | 日常快速生成 | 批量生成、自动化脚本 |

---

## 使用指南

### 基础使用：生成 PPT 图片
1. 准备内容规划文件 `my_slides_plan.json`，格式示例：
```json
{
  "title": "AI 产品设计指南",
  "total_slides": 5,
  "slides": [
    {
      "slide_number": 1,
      "page_type": "cover",
      "content": "标题：AI 产品设计指南\n副标题：构建以用户为中心的智能体验"
    },
    {
      "slide_number": 2,
      "page_type": "content",
      "content": "核心原则\n- 简单直观
