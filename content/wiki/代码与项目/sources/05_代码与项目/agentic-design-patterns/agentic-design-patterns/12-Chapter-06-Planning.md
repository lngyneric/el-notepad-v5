---
source: raw/05_代码与项目/agentic-design-patterns/agentic-design-patterns/12-Chapter-06-Planning.md
raw_sha256: 736f366322f72a9ef27851d6aed9220331c42a9db7e4b3fda20613c920699463
compiled_at: 2026-04-14T03:59:18.028Z
---
# 智能体设计模式：规划（Planning）

> 来源路径：`raw/05_代码与项目/agentic-design-patterns/agentic-design-patterns/12-Chapter-06-Planning.md`

---

## TL;DR
规划模式是智能体系统的核心设计模式，它使智能体能够将复杂的高层次目标拆解为可执行的多步序列，从简单的被动响应转变为以目标为导向的主动执行，支持动态调整计划以适应环境变化，是多步骤任务自动化、复杂信息检索与复杂问题求解的基础能力。

---

## 目录
- [规划模式核心概念](#规划模式核心概念)
- [模式概览](#模式概览)
- [典型应用场景](#典型应用场景)
- [实战示例：基于Crew AI实现](#实战示例基于crew-ai实现)
- [业界案例](#业界案例)
  - [Google DeepResearch](#google-deepresearch)
  - [OpenAI Deep Research API](#openai-deep-research-api)
- [模式总结](#模式总结)
- [核心要点](#核心要点)
- [结语](#结语)
- [参考文献](#参考文献)
- [章节导航](#章节导航)

---

## 规划模式核心概念

智能行为远不止对眼前输入作出反应。它需要前瞻性，把复杂任务拆解为更小且可管理的步骤，并制定实现预期结果的策略。这正是规划模式发挥作用之处。其核心在于：**智能体（或智能体系统）能够制定一系列行动，使系统从初始状态迈向目标状态**。

> 原文引用：
> *Intelligent behavior often involves more than just reacting to the immediate input. It requires foresight, breaking down complex tasks into smaller, manageable steps, and strategizing how to achieve a desired outcome. This is where the Planning pattern comes into play. At its core, planning is the ability for an agent or a system of agents to formulate a sequence of actions to move from an initial state towards a goal state.*

---

## 模式概览

在AI语境下，可以将规划智能体理解为接受复杂目标委派的专家：用户只需要定义目标与约束（做什么），不需要指定实现方法（怎么做），智能体的核心任务是自主规划通往目标的路径。

完整的规划过程具备以下特征：
1. **先分析再生成计划**：智能体先明确初始状态（预算、人数、可用时间等约束）和目标状态，再寻找连接两者的最优行动序列，计划是根据请求即时生成的，并非预设。
2. **灵活适应性**：初步计划只是起点，智能体可以根据新信息调整路线，遇到障碍时会重新评估并生成替代方案，而非直接失败。
3. **存在权衡取舍**：灵活性与可预测性需要平衡：
   - 当解决方法明确可重复时，使用固定预设流程比动态规划更有效，能够降低不确定性，保证结果一致性
   - 选择规划型智能体还是任务执行型智能体的核心判断标准：**「如何做」的方案是否需要探索，还是已经明确？**

> 原文引用：
> *A hallmark of this process is adaptability. An initial plan is merely a starting point, not a rigid script. The agent's real power is its ability to incorporate new information and steer the project around obstacles.*
> *However, it is crucial to recognize the trade-off between flexibility and predictability. Dynamic planning is a specific tool, not a universal solution. [...] Therefore, the decision to use a planning agent versus a simple task-execution agent hinges on a single question: does the "how" need to be discovered, or is it already known?*

---

## 典型应用场景

规划是自主系统的核心计算过程，可将高层次目标转化为结构化的可执行步骤序列，典型应用包括：

1. **流程自动化编排**：将复杂业务流程拆解为有序子任务，处理依赖关系，例如新员工入职流程：拆解为创建系统账户、分配培训课程、跨部门协调等步骤，智能体按逻辑顺序执行。
2. **机器人与自主导航**：在状态空间中生成从起点到终点的路径，在避障、遵守交通规则等约束下优化时间、能耗等指标。
3. **结构化信息整合**：生成复杂输出时，将任务拆解为信息收集、归纳、结构化、迭代打磨等阶段，例如生成研究报告；也可用于多步骤客户支持问题，制定诊断、解决、升级的系统化流程。

本质上，规划模式使智能体从简单的被动反应升级为目标导向行为，为需要一系列相互关联步骤才能解决的问题提供逻辑框架。

> 原文引用：
> *In essence, the Planning pattern allows an agent to move beyond simple, reactive actions to goal-oriented behavior. It provides the logical framework necessary to solve problems that require a coherent sequence of interdependent operations.*

---

## 实战示例：基于Crew AI实现

以下示例使用CrewAI框架实现规划模式：智能体先制定多步骤计划解决复杂请求，再按顺序执行计划，任务为针对指定主题先规划大纲再撰写摘要。

完整可运行代码：
```python
import os
from dotenv import load_dotenv
from crewai import Agent, Task, Crew, Process
from langchain_openai import ChatOpenAI

# Load environment variables from .env file for security
# 从 .env 文件加载环境变量（如 OPENAI_API_KEY）
load_dotenv()

# 1. Explicitly define the language model for clarity
# 明确指定使用的模型
llm = ChatOpenAI(model="gpt-4-turbo")

# 2. Define a clear and focused agent
# 定义一个目标明确且聚焦的智能体
planner_writer_agent = Agent(
    role='Article Planner and Writer',
    goal='Plan and then write a concise, engaging summary on a specified topic.',
    backstory=(
        'You are an expert technical writer and content strategist. '
        'Your strength lies in creating a clear, actionable plan before writing, '
        'ensuring the final summary is both informative and easy to digest.'
    ),
    verbose=True,
    allow_delegation=False,
    llm=llm # Assign the specific LLM to the agent
)

# 3. Define a task with a more structured and specific expected output
# 定义一个更结构化且输出明确的任务
topic = "The importance of Reinforcement Learning in AI"
high_level_task = Task(
    description=(
        f"1. Create a bullet-point plan for a summary on the topic: '{topic}'.\n"
        f"2. Write the summary based on your plan, keeping it around 200 words."
    ),
    expected_output=(
        "A final report containing two distinct sections:\n\n"
        "### Plan\n"
        "- A bulleted list outlining the main points of the summary.\n\n"
        "### Summary\n"
        "- A concise and well-structured summary of the topic."
    ),
    agent=planner_writer_agent,
)

# Create the crew with a clear process
# 创建一个 Crew 实例来执行任务
crew = Crew(
    agents=[planner_writer_agent],
    tasks=[high_level_task],
    process=Process.sequential,
)

# Execute the task
# 开始执行
print("## Running the planning and writing task ##")
result = crew.kickoff()

print("\n\n---\n## Task Result ##\n---")
print(result)
```

> 译者注：[Colab 可运行代码](https://colab.research.google.com/drive/1TBcatcgnntrm31kfIzENsSMNYwMNLUOh) 已维护在[此处](/codes/Chapter-06-Planning-CrewAI-Example.py)。

---

## 业界案例

### Google DeepResearch

Google Gemini DeepResearch是面向自主信息检索与整合的智能体系统，通过多步骤动态迭代的智能体流程调用Google搜索，系统性探索复杂主题，核心工作流程如下：
1. **计划阶段**：将用户提问拆解为多要点研究计划，展示给用户审阅修改，共同确定研究方向后再执行
2. **迭代执行阶段**：不是执行预设搜索，而是根据已获取信息动态调整查询，主动识别知识缺口、核对数据、解决冲突，持续补充搜索
3. **异步架构设计**：支持长时间运行的研究任务，具备容错能力，用户可中途离开，完成后收到通知；还支持整合用户上传的私有文档
4. **输出阶段**：生成结构化带引用的多页报告，支持交互（音频概述、图表、原始来源链接），同时返回完整的来源清单保证透明度

典型应用场景包括：
- 竞争分析：自动收集汇总市场趋势、竞品信息、公众舆情、营销策略，替代人工收集数据，让分析师聚焦战略解读
- 学术文献综述：识别总结核心论文、梳理概念演变、勾勒新兴研究方向，加快研究初始阶段的进度
