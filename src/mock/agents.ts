import type { AgentId, AgentMeta } from "../types/agent";

export const agentList: AgentMeta[] = [
  {
    id: "troubleshoot",
    name: "排障智能体",
    shortName: "排障",
    description: "识别报障场景，收敛故障原因并给出处置方案。",
    capability: "故障识别 / 流程处置 / 工单生成",
    category: "运营支撑",
    functionIntro: "自动识别故障类型，串联信息采集、处置建议和工单闭环。",
    domainIntro: "适用于订单执行异常、卡服务不可用、App 报错等运营支撑场景。",
    tags: ["重点演示", "意图识别", "处置建议"],
    route: "/app/agents/troubleshoot",
    status: "featured",
    featured: true,
    accent: "linear-gradient(135deg, #69ddff 0%, #2d7fff 100%)",
  },
  {
    id: "rule-config",
    name: "规则配置智能体",
    shortName: "规则",
    description: "用对话和模板卡片协同生成规则草案并完成校验。",
    capability: "场景选型 / 参数配置 / 草案发布",
    category: "策略编排",
    functionIntro: "通过模板卡片配置阈值、动作和触达方式，快速生成规则草案。",
    domainIntro: "适用于营销触达、风险拦截、工单分派等策略配置场景。",
    tags: ["重点演示", "模板配置", "规则校验"],
    route: "/app/agents/rule-config",
    status: "featured",
    featured: true,
    accent: "linear-gradient(135deg, #65f3d2 0%, #2a9dff 100%)",
  },
  {
    id: "service",
    name: "业务办理智能体",
    shortName: "办理",
    description: "对话式识别办理事项，驱动卡片化参数采集与结果确认。",
    capability: "事项识别 / 参数采集 / 办理推进",
    category: "客户服务",
    functionIntro: "识别办理事项后，分步骤采集参数与材料，并输出标准办理结果。",
    domainIntro: "适用于套餐变更、补换卡申请、国际漫游开通等客户服务场景。",
    tags: ["重点演示", "卡片表单", "办理闭环"],
    route: "/app/agents/service",
    status: "featured",
    featured: true,
    accent: "linear-gradient(135deg, #ffd36e 0%, #ff8c4b 100%)",
  },
  {
    id: "card-query",
    name: "卡信息查询智能体",
    shortName: "卡查",
    description: "面向卡状态、套餐、启停和生命周期的轻量查询入口。",
    capability: "状态查询 / 生命周期概览",
    category: "轻量预留",
    functionIntro: "快速查询卡状态、套餐信息与生命周期关键节点。",
    domainIntro: "适用于客服查询、运营排查和卡业务基础信息核验场景。",
    tags: ["预留", "查询类"],
    route: "/app/agents/card-query",
    status: "preview",
    featured: false,
    accent: "linear-gradient(135deg, #5bc2ff 0%, #4c65ff 100%)",
  },
  {
    id: "knowledge-qa",
    name: "知识问答智能体",
    shortName: "问答",
    description: "对接知识文档、操作规范和业务口径的快速问答入口。",
    capability: "知识检索 / 规范问答",
    category: "轻量预留",
    functionIntro: "基于知识库快速返回制度口径、处理规范和操作建议。",
    domainIntro: "适用于培训辅导、业务答疑和标准口径查询等知识服务场景。",
    tags: ["预留", "问答类"],
    route: "/app/agents/knowledge-qa",
    status: "preview",
    featured: false,
    accent: "linear-gradient(135deg, #88c7ff 0%, #3aa0ff 100%)",
  },
  {
    id: "data-query",
    name: "数据查询智能体",
    shortName: "数查",
    description: "面向业务指标、趋势和维度拆解的轻量分析入口。",
    capability: "指标查询 / 趋势追踪",
    category: "轻量预留",
    functionIntro: "支持业务指标查询、趋势解读和关键维度拆分。",
    domainIntro: "适用于运营分析、经营追踪和专题数据洞察等分析场景。",
    tags: ["预留", "分析类"],
    route: "/app/agents/data-query",
    status: "preview",
    featured: false,
    accent: "linear-gradient(135deg, #65d2ff 0%, #1ca7b8 100%)",
  },
];

export const agentsById = Object.fromEntries(agentList.map((agent) => [agent.id, agent])) as Record<
  AgentId,
  AgentMeta
>;

export const featuredAgents = agentList.filter((agent) => agent.featured);
export const previewAgents = agentList.filter((agent) => !agent.featured);

export const homeHighlights = [
  { label: "今日演示链路", value: "3 条" },
  { label: "可体验智能体", value: "6 个" },
  { label: "推荐进入广场", value: "1 次点击" },
];

export const stageMoments = [
  "登录即进入移动工作台，首屏聚焦重点智能体与推荐入口。",
  "智能体广场完整展示 6 个智能体，支持从首页和侧边抽屉双入口进入。",
  "三条主链路全部由脚本化 Mock 驱动，可按选择推进，适合领导演示。",
];
