---
source: raw/05_代码与项目/skills/skills/skills/internal-comms/examples/company-newsletter.md
raw_sha256: 30f81cfbdb03858a006169c72169024089c7c5d3d32611d337782da4f38c86b5
compiled_at: 2026-04-14T05:19:56.464Z
---
# 企业内部全员通讯：公司新闻通讯示例规范

> [!TIP] TL;DR
> 本规范定义了面向千人以上规模企业的全员周/月度新闻通讯的撰写要求，明确了内容范围、格式结构、信息来源工具与优先级规则，用于生成适合Slack和邮件分发的轻量化全员通讯内容。

---

## 目录
- [核心撰写要求](#核心撰写要求)
- [可用信息来源工具规范](#可用信息来源工具规范)
- [内容分区要求](#内容分区要求)
- [内容优先级规则](#内容优先级规则)
- [参考格式模板](#参考格式模板)
- [原始文本引用](#原始文本引用)

---

## 核心撰写要求
需产出一份覆盖公司过去一周/月度情况的全员通讯，发送渠道为Slack和邮件，要求：
1. 总篇幅控制在约20-25条项目符号
2. 每条内容1-2句话，简洁聚焦
3. 使用第一人称「我们」语态，体现公司内部视角
4. 包含大量相关链接，可指向Google Drive文档、Slack公告频道高管消息、全员邮件、公司重要事件记录等

## 可用信息来源工具规范
如果有对应工具权限，优先从以下渠道收集内容；如果没有权限，需要明确告知用户需要补充内容：
| 工具类型 | 收集内容说明 |
|---------|-------------|
| Slack | 收集大频道内高互动（高反应数/高讨论数）的消息 |
| 邮件 | 收集高管发布的全员公告内容 |
| 日历 | 收集高参会人数的会议（如全员大会、重大公司公告会议），优先附上会议关联文档链接 |
| 内部文档 | 收集近一两周发布的受关注文档，如公司愿景文档、季度/半年度规划、核心高管发布的内容等 |
| 外部媒体 | 收集近一周公司获得的报道/行业提及内容 |

如果没有任何上述工具的访问权限，需要向用户索要待覆盖内容，仅承担格式整理和内容润色工作。

## 内容分区要求
适用于1000人以上的大型公司，需要按内容聚类分区，保证公司各业务领域都得到合理展示，常见分区方向参考：
- 按职能分：产品研发、市场销售、财务等
- 按主题分：招聘、执行、愿景等
- 按属性分：外部新闻、内部新闻等

## 内容优先级规则
### 重点聚焦内容
1. 具备公司级影响的内容
2. 管理层发布的公告
3. 重大里程碑与成就
4. 影响大多数员工的信息
5. 外部认可/媒体报道

### 需要规避的内容
1. 过度细分的团队细节（这类内容放在团队3P回顾即可）
2. 仅对小群体有效的信息
3. 已经发布过的重复信息

## 参考格式模板
```markdown
:megaphone: 公司公告
- 公告内容1
- 公告内容2
- 公告内容3

:dart: 优先级项目进展
- 领域1
    - 子项1
    - 子项2
    - 子项3
- 领域2
    - 子项1
    - 子项2
    - 子项3
- 领域3
    - 子项1
    - 子项2
    - 子项3

:pillar: 管理层更新
- 更新1
- 更新2
- 更新3

:thread: 团队动态
- 动态1
- 动态2
- 动态3
```

---

## 原始文本引用
> 来源路径：`raw/05_代码与项目/skills/skills/skills/internal-comms/examples/company-newsletter.md`
> ```markdown
> ## Instructions
> You are being asked to write a company-wide newsletter update. You are meant to summarize the past week/month of a company in the form of a newsletter that the entire company will read. It should be maybe ~20-25 bullet points long. It will be sent via Slack and email, so make it consumable for that.
> 
> Ideally it includes the following attributes:
> - Lots of links: pulling documents from Google Drive that are very relevant, linking to prominent Slack messages in announce channels and from executives, perhgaps referencing emails that went company-wide, highlighting significant things that have happened in the company.
> - Short and to-the-point: each bullet should probably be no longer than ~1-2 sentences
> - Use the "we" tense, as you are part of the company. Many of the bullets should say "we did this" or "we did that"
> 
> ## Tools to use
> If you have access to the following tools, please try to use them. If not, you can also let the user know directly that their responses would be better if they gave them access.
> 
> - Slack: look for messages in channels with lots of people, with lots of reactions or lots of responses within the thread
> - Email: look for things from executives that discuss company-wide announcements
> - Calendar: if there were meetings with large attendee lists, particularly things like All-Hands meetings, big company announcements, etc. If there were documents attached to those meetings, those are great links to include.
> - Documents: if there were new docs published in the last week or two that got a lot of attention, you can link them. These should be things like company-wide vision docs, plans for the upcoming quarter or half, things authored by critical executives, etc.
> - External press: if you see references to articles or press we've received over the past week, that could be really cool too.
> 
> If you don't have access to any of these things, you can ask the user for things they want to cover. In this case, you'll mostly just be polishing up and fitting to this format more directly.
> 
> ## Sections
> The company is pretty big: 1000+ people. There are a variety of different teams and initiatives going on across the company. To make sure the update works well, try breaking it into sections of similar things. You might break into clusters like {product development, go to market, finance} or {recruiting, execution, vision}, or {external news, internal news} etc. Try to make sure the different areas of the company are highlighted well.
> 
> ## Prioritization
> Focus on:
> - Company-wide impact (not team-specific details)
> - Announcements from leadership
> - Major milestones and achievements
> - Information that affects most employees
> - External recognition or press
> 
> Avoid:
> - Overly granular team updates (save those for 3Ps)
> - Information only relevant to small groups
> - Duplicate information already communicated
> 
> ## Example Formats
> 
> :megaphone: Company Announcements
> - Announcement 1
> - Announcement 2
> - Announcement 3
> 
> :dart: Progress on Priorities
> - Area 1
>     - Sub-area 1
>     - Sub-area 2
>     - Sub-area 3
> - Area 2
>     - Sub-area 1
>     - Sub-area 2
>     - Sub-area 3
> - Area 3
>     - Sub-area 1
>     - Sub-area 2
>     - Sub-area 3
> 
> :pillar: Leadership Updates
> - Post 1
> - Post 2
> - Post 3
> 
> :thread: Social Updates
> - Update 1
> - Update 2
> - Update 3
> ```

> [!WARNING] 冲突：
> 本页面无已知冲突，若与其他内部通讯规范出现分歧，请以制度文件要求为准。

---

*最后更新：2024-06-20*
