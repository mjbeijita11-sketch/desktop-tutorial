import type { AgentFlowStep, FlowResult } from "../types/agent";

export type TroubleshootScenarioId = "order" | "card" | "app";
export type RuleSceneId = "upgrade" | "risk" | "dispatch";
export type ServiceSceneId = "package-change" | "replace-card" | "roaming";

export const troubleshootIntro =
  "请描述用户反馈的问题现象。我会先做意图识别，再进入对应的排障采集路径。";

export const troubleshootFirstStep: AgentFlowStep = {
  id: "troubleshoot-intent",
  title: "识别问题场景",
  description: "输入报障描述，系统将结合关键词自动识别问题类型。",
  assistantPrompt: troubleshootIntro,
  decisionCard: {
    id: "troubleshoot-intent-card",
    title: "问题描述",
    description: "支持自然语言描述，也可结合常见场景快速输入。",
    submitLabel: "开始识别",
    fields: [
      {
        id: "issueDescription",
        label: "报障描述",
        type: "textarea",
        required: true,
        placeholder: "例如：订单已扣款但执行失败，用户多次重试后仍显示处理中。",
        helper: "建议包含故障现象、影响范围和触发动作。",
      },
      {
        id: "scenarioHint",
        label: "常见场景提示",
        type: "chips",
        options: [
          { label: "订单执行类问题", value: "order" },
          { label: "卡服务不可用问题", value: "card" },
          { label: "App 执行报错问题", value: "app" },
        ],
      },
    ],
  },
};

const troubleshootBranchSteps: Record<TroubleshootScenarioId, AgentFlowStep> = {
  order: {
    id: "order-detail",
    title: "订单执行问题采集",
    description: "补充订单号、影响范围和执行阶段，生成处置建议。",
    assistantPrompt: "已识别为订单执行类问题，请继续补充订单执行上下文。",
    decisionCard: {
      id: "order-detail-card",
      title: "订单执行采集",
      description: "定位订单停滞节点，便于判断是否需要人工补偿。",
      submitLabel: "生成处置建议",
      fields: [
        { id: "orderNo", label: "订单号", type: "text", required: true, placeholder: "请输入订单号" },
        {
          id: "orderStage",
          label: "停滞阶段",
          type: "radio",
          required: true,
          options: [
            { label: "支付成功待下发", value: "payment" },
            { label: "执行中未完成", value: "executing" },
            { label: "回执超时未返回", value: "timeout" },
          ],
        },
        {
          id: "impactLevel",
          label: "影响范围",
          type: "chips",
          required: true,
          options: [
            { label: "单用户", value: "single" },
            { label: "小范围批量", value: "batch" },
            { label: "全量场景", value: "global" },
          ],
        },
      ],
    },
  },
  card: {
    id: "card-detail",
    title: "卡服务不可用采集",
    description: "补充卡号、城市和异常现象，用于判断服务状态。",
    assistantPrompt: "已识别为卡服务不可用问题，请继续补充卡片状态信息。",
    decisionCard: {
      id: "card-detail-card",
      title: "卡服务采集",
      description: "用于判断卡状态是否异常、是否需要重置服务能力。",
      submitLabel: "生成处置建议",
      fields: [
        { id: "cardNo", label: "卡号/ICCID", type: "text", required: true, placeholder: "请输入卡号或 ICCID" },
        {
          id: "region",
          label: "业务地区",
          type: "select",
          required: true,
          options: [
            { label: "上海", value: "上海" },
            { label: "江苏", value: "江苏" },
            { label: "浙江", value: "浙江" },
          ],
        },
        {
          id: "symptom",
          label: "异常现象",
          type: "radio",
          required: true,
          options: [
            { label: "无信号", value: "无信号" },
            { label: "有信号但不可用", value: "有信号但不可用" },
            { label: "业务突然停机", value: "业务突然停机" },
          ],
        },
      ],
    },
  },
  app: {
    id: "app-detail",
    title: "App 报错采集",
    description: "补充版本、错误阶段和报错码，便于快速还原问题。",
    assistantPrompt: "已识别为 App 执行报错问题，请继续补充终端与报错信息。",
    decisionCard: {
      id: "app-detail-card",
      title: "App 报错采集",
      description: "用于判断前端版本异常、接口超时还是鉴权错误。",
      submitLabel: "生成处置建议",
      fields: [
        { id: "appVersion", label: "App 版本", type: "text", required: true, placeholder: "例如 6.4.3" },
        {
          id: "errorStage",
          label: "出错阶段",
          type: "radio",
          required: true,
          options: [
            { label: "登录后首页加载", value: "登录后首页加载" },
            { label: "提交业务办理", value: "提交业务办理" },
            { label: "查询结果回填", value: "查询结果回填" },
          ],
        },
        { id: "errorCode", label: "报错码", type: "text", required: true, placeholder: "例如 APP-504" },
      ],
    },
  },
};

export function classifyTroubleshoot(description: string, hint?: string): TroubleshootScenarioId {
  if (hint === "order" || hint === "card" || hint === "app") return hint;
  const lowered = description.toLowerCase();
  if (lowered.includes("订单") || lowered.includes("扣款") || lowered.includes("执行")) return "order";
  if (lowered.includes("卡") || lowered.includes("无信号") || lowered.includes("停机")) return "card";
  return "app";
}

export function getTroubleshootStep(id: TroubleshootScenarioId): AgentFlowStep {
  return troubleshootBranchSteps[id];
}

export function getTroubleshootSceneLabel(id: TroubleshootScenarioId): string {
  return {
    order: "订单执行类问题",
    card: "卡服务不可用问题",
    app: "App 执行报错问题",
  }[id];
}

export function buildTroubleshootResult(
  id: TroubleshootScenarioId,
  payload: Record<string, string | string[]>,
): FlowResult {
  if (id === "order") {
    return {
      title: "建议进入订单补偿处置",
      summary: `订单 ${payload.orderNo} 当前处于 ${payload.orderStage} 阶段，建议先校验下发状态，再发起补偿工单。`,
      nextActions: ["回查支付与下发日志", "校验回执链路是否超时", "生成人工补偿工单并通知业务"],
      ctaLabel: "生成处置工单",
      ctaHint: "将自动带出订单号、影响范围和建议动作。",
      status: "warning",
      reference: "TRB-ORDER-02",
    };
  }

  if (id === "card") {
    return {
      title: "建议触发卡状态重检",
      summary: `卡片 ${payload.cardNo} 在 ${payload.region} 区域出现 ${payload.symptom}，建议先重检状态并同步服务节点。`,
      nextActions: ["回查卡状态和启停机记录", "检查区域网络与卡能力状态", "必要时触发服务重置并回访用户"],
      ctaLabel: "生成处置工单",
      ctaHint: "将带出卡号、区域和故障现象。",
      status: "warning",
      reference: "TRB-CARD-07",
    };
  }

  return {
    title: "建议进入版本与接口联排",
    summary: `App ${payload.appVersion} 在 ${payload.errorStage} 阶段触发 ${payload.errorCode}，建议结合版本包与接口日志联排。`,
    nextActions: ["校验当前灰度版本配置", "回查接口错误码对应服务", "通知前端与网关团队同步定位"],
    ctaLabel: "生成处置工单",
    ctaHint: "将自动生成跨团队协同单。",
    status: "info",
    reference: "TRB-APP-11",
  };
}

export const ruleIntro =
  "请先描述需要配置的规则场景。我会推荐模板，再引导你完成参数配置和规则草案生成。";

export const ruleSceneStep: AgentFlowStep = {
  id: "rule-scene",
  title: "选择规则场景",
  description: "先锁定业务场景，后续卡片会根据场景限制可配范围。",
  assistantPrompt: ruleIntro,
  decisionCard: {
    id: "rule-scene-card",
    title: "场景选择",
    description: "推荐先从常见模板场景启动。",
    submitLabel: "进入配置",
    fields: [
      {
        id: "scene",
        label: "目标场景",
        type: "radio",
        required: true,
        options: [
          { label: "套餐升级提醒", value: "upgrade" },
          { label: "风险行为拦截", value: "risk" },
          { label: "工单自动分派", value: "dispatch" },
        ],
      },
      {
        id: "objective",
        label: "业务目标",
        type: "textarea",
        required: true,
        placeholder: "例如：在用户到达指定阈值后自动触发升级提醒。",
      },
    ],
  },
};

const ruleConfigSteps: Record<RuleSceneId, AgentFlowStep> = {
  upgrade: {
    id: "rule-upgrade-config",
    title: "套餐升级规则配置",
    description: "设置阈值、触达渠道和动作策略。",
    assistantPrompt: "已匹配到套餐升级提醒模板，请配置触发阈值和触达动作。",
    decisionCard: {
      id: "rule-upgrade-card",
      title: "升级提醒配置",
      description: "阈值支持 1-999 的整数，用于控制触发规则。",
      submitLabel: "生成规则草案",
      fields: [
        { id: "threshold", label: "触发阈值", type: "text", required: true, placeholder: "例如 80" },
        {
          id: "channel",
          label: "触达渠道",
          type: "chips",
          required: true,
          options: [
            { label: "App 消息", value: "App 消息" },
            { label: "短信", value: "短信" },
            { label: "人工外呼", value: "人工外呼" },
          ],
        },
        {
          id: "action",
          label: "执行动作",
          type: "radio",
          required: true,
          options: [
            { label: "提醒并推荐升级方案", value: "提醒并推荐升级方案" },
            { label: "直接进入办理入口", value: "直接进入办理入口" },
          ],
        },
      ],
    },
  },
  risk: {
    id: "rule-risk-config",
    title: "风险拦截规则配置",
    description: "设置触发条件、拦截等级和通知动作。",
    assistantPrompt: "已切换到风险拦截模板，请配置风险阈值与处置动作。",
    decisionCard: {
      id: "rule-risk-card",
      title: "风险拦截配置",
      description: "适合高频失败操作、异常账号行为等场景。",
      submitLabel: "生成规则草案",
      fields: [
        { id: "threshold", label: "风险阈值", type: "text", required: true, placeholder: "例如 3" },
        {
          id: "channel",
          label: "告警渠道",
          type: "chips",
          required: true,
          options: [
            { label: "运营看板", value: "运营看板" },
            { label: "短信告警", value: "短信告警" },
            { label: "企微通知", value: "企微通知" },
          ],
        },
        {
          id: "action",
          label: "拦截动作",
          type: "radio",
          required: true,
          options: [
            { label: "暂停操作并人工复核", value: "暂停操作并人工复核" },
            { label: "直接拒绝并反馈原因", value: "直接拒绝并反馈原因" },
          ],
        },
      ],
    },
  },
  dispatch: {
    id: "rule-dispatch-config",
    title: "工单分派规则配置",
    description: "设置优先级、地域和分派动作。",
    assistantPrompt: "已切换到工单分派模板，请配置地域和优先级策略。",
    decisionCard: {
      id: "rule-dispatch-card",
      title: "工单分派配置",
      description: "分派规则会自动限定到当前模板可配置字段。",
      submitLabel: "生成规则草案",
      fields: [
        { id: "threshold", label: "优先级阈值", type: "text", required: true, placeholder: "例如 5" },
        {
          id: "channel",
          label: "分派区域",
          type: "chips",
          required: true,
          options: [
            { label: "华东", value: "华东" },
            { label: "华南", value: "华南" },
            { label: "全国", value: "全国" },
          ],
        },
        {
          id: "action",
          label: "分派策略",
          type: "radio",
          required: true,
          options: [
            { label: "按技能组自动分派", value: "按技能组自动分派" },
            { label: "按负责人池轮询分派", value: "按负责人池轮询分派" },
          ],
        },
      ],
    },
  },
};

export function getRuleStep(scene: RuleSceneId): AgentFlowStep {
  return ruleConfigSteps[scene];
}

export function getRuleSceneLabel(scene: RuleSceneId): string {
  return {
    upgrade: "套餐升级提醒",
    risk: "风险行为拦截",
    dispatch: "工单自动分派",
  }[scene];
}

export function validateThreshold(value: string): string | null {
  if (!/^\d+$/.test(value)) return "阈值需为整数。";
  const numeric = Number(value);
  if (numeric < 1 || numeric > 999) return "阈值需在 1 到 999 之间。";
  return null;
}

export function buildRuleResult(scene: RuleSceneId, payload: Record<string, string | string[]>): FlowResult {
  return {
    title: `${getRuleSceneLabel(scene)}草案已生成`,
    summary: `系统已根据阈值 ${payload.threshold}、渠道 ${payload.channel} 和动作 ${payload.action} 组合出一份可发布草案。`,
    nextActions: ["完成规则名称和生效范围确认", "检查冲突规则和灰度范围", "发布后同步给运营看板和责任人"],
    ctaLabel: "发布规则草案",
    ctaHint: "发布后仅作为演示态结果，不会真的修改系统。",
    status: "success",
    reference: `RULE-${scene.toUpperCase()}-01`,
  };
}

export const serviceIntro =
  "请先描述要办理的事项。我会识别业务类型，再用卡片帮你一步步收集办理参数和材料。";

export const serviceIntentStep: AgentFlowStep = {
  id: "service-intent",
  title: "识别办理事项",
  description: "先锁定要办理的业务，再进入卡片式参数采集。",
  assistantPrompt: serviceIntro,
  decisionCard: {
    id: "service-intent-card",
    title: "事项识别",
    description: "推荐先从预置事项进入，便于快速演示办理闭环。",
    submitLabel: "进入办理",
    fields: [
      {
        id: "serviceType",
        label: "办理事项",
        type: "radio",
        required: true,
        options: [
          { label: "套餐变更", value: "package-change" },
          { label: "补换卡申请", value: "replace-card" },
          { label: "国际漫游开通", value: "roaming" },
        ],
      },
      {
        id: "requestSummary",
        label: "诉求描述",
        type: "textarea",
        required: true,
        placeholder: "例如：用户希望将当前套餐升级为更高流量档位。",
      },
    ],
  },
};

const serviceParameterSteps: Record<ServiceSceneId, AgentFlowStep> = {
  "package-change": {
    id: "service-package-params",
    title: "套餐变更参数采集",
    description: "选择目标套餐、变更生效时间和通知方式。",
    assistantPrompt: "已识别为套餐变更，请补充目标套餐和生效方式。",
    decisionCard: {
      id: "service-package-card",
      title: "变更参数",
      description: "采用卡片式办理，避免自由输入带来的信息缺漏。",
      submitLabel: "确认材料",
      fields: [
        {
          id: "targetPlan",
          label: "目标套餐",
          type: "radio",
          required: true,
          options: [
            { label: "129 元畅享版", value: "129 元畅享版" },
            { label: "169 元尊享版", value: "169 元尊享版" },
            { label: "199 元商旅版", value: "199 元商旅版" },
          ],
        },
        {
          id: "effectiveTime",
          label: "生效时间",
          type: "chips",
          required: true,
          options: [
            { label: "立即生效", value: "立即生效" },
            { label: "次月生效", value: "次月生效" },
          ],
        },
        {
          id: "notice",
          label: "通知方式",
          type: "chips",
          required: true,
          options: [
            { label: "App 消息", value: "App 消息" },
            { label: "短信", value: "短信" },
          ],
        },
      ],
    },
  },
  "replace-card": {
    id: "service-card-params",
    title: "补换卡参数采集",
    description: "选择办理原因、配送方式和联系人信息。",
    assistantPrompt: "已识别为补换卡申请，请补充原因与交付方式。",
    decisionCard: {
      id: "service-card-card",
      title: "补换卡参数",
      description: "会根据选择自动生成办理建议。",
      submitLabel: "确认材料",
      fields: [
        {
          id: "reason",
          label: "办理原因",
          type: "radio",
          required: true,
          options: [
            { label: "卡片损坏", value: "卡片损坏" },
            { label: "设备更换", value: "设备更换" },
            { label: "遗失补办", value: "遗失补办" },
          ],
        },
        {
          id: "delivery",
          label: "交付方式",
          type: "chips",
          required: true,
          options: [
            { label: "直营网点自提", value: "直营网点自提" },
            { label: "快递配送", value: "快递配送" },
          ],
        },
        { id: "contact", label: "联系人手机号", type: "text", required: true, placeholder: "请输入联系人手机号" },
      ],
    },
  },
  roaming: {
    id: "service-roaming-params",
    title: "国际漫游开通参数采集",
    description: "选择国家地区、开通时段和风险确认方式。",
    assistantPrompt: "已识别为国际漫游开通，请补充国家地区与时段。",
    decisionCard: {
      id: "service-roaming-card",
      title: "漫游开通参数",
      description: "系统会结合国家地区给出风险提示。",
      submitLabel: "确认材料",
      fields: [
        {
          id: "region",
          label: "国家/地区",
          type: "radio",
          required: true,
          options: [
            { label: "中国香港", value: "中国香港" },
            { label: "新加坡", value: "新加坡" },
            { label: "欧洲多国", value: "欧洲多国" },
          ],
        },
        {
          id: "period",
          label: "开通时段",
          type: "chips",
          required: true,
          options: [
            { label: "7 天", value: "7 天" },
            { label: "30 天", value: "30 天" },
          ],
        },
        {
          id: "riskConfirm",
          label: "风险确认",
          type: "radio",
          required: true,
          options: [
            { label: "已确认资费说明", value: "已确认资费说明" },
            { label: "需再次提醒", value: "需再次提醒" },
          ],
        },
      ],
    },
  },
};

export const serviceMaterialsStep: AgentFlowStep = {
  id: "service-materials",
  title: "确认办理材料",
  description: "对办理条件和材料做最终确认，再生成办理结果。",
  assistantPrompt: "请确认办理材料和风险提示，确认后即可生成结果。",
  decisionCard: {
    id: "service-materials-card",
    title: "材料确认",
    description: "至少勾选两个关键确认项，保证办理信息完整。",
    submitLabel: "生成办理结果",
    fields: [
      {
        id: "materials",
        label: "已确认事项",
        type: "checklist",
        required: true,
        options: [
          { label: "已确认实名信息", value: "已确认实名信息" },
          { label: "已确认套餐/业务影响", value: "已确认套餐/业务影响" },
          { label: "已确认通知方式", value: "已确认通知方式" },
          { label: "已确认风险提示", value: "已确认风险提示" },
        ],
      },
    ],
  },
};

export function getServiceStep(scene: ServiceSceneId): AgentFlowStep {
  return serviceParameterSteps[scene];
}

export function getServiceSceneLabel(scene: ServiceSceneId): string {
  return {
    "package-change": "套餐变更",
    "replace-card": "补换卡申请",
    roaming: "国际漫游开通",
  }[scene];
}

export function buildServiceResult(scene: ServiceSceneId, payload: Record<string, string | string[]>): FlowResult {
  return {
    title: `${getServiceSceneLabel(scene)}受理完成`,
    summary: `系统已根据当前卡片参数生成办理单，关键信息为 ${Object.values(payload)
      .flat()
      .slice(0, 3)
      .join(" / ")}。`,
    nextActions: ["生成标准办理单号", "同步办理状态到用户侧消息中心", "支持后续回到办理页继续追踪"],
    ctaLabel: "提交办理指令",
    ctaHint: "演示态下会返回一个模拟办理单号。",
    status: "success",
    reference: `SRV-${scene.toUpperCase()}-09`,
  };
}
