<template>
  <div class="page">
    <section class="summary section-card">
      <div class="page-kicker">Featured Flow</div>
      <h2>规则配置智能体</h2>
      <p>通过场景选择、模板化参数配置和规则草案发布，演示智能规则生成体验。</p>
      <div class="chip-grid">
        <span class="pill">{{ sceneLabel }}</span>
        <span class="pill">对话式引导</span>
        <span class="pill">模板式配置</span>
      </div>
    </section>

    <ConversationThread :messages="messages" />

    <FlowDecisionCard
      v-if="currentStep && currentStep.decisionCard"
      :card="currentStep.decisionCard"
      :error-message="errorMessage"
      @submit="handleSubmit"
    />

    <ResultPanel v-if="result" :result="result" :action-done="actionDone" @action="handleAction" />

    <button class="ghost-button reset-button" type="button" @click="resetFlow">重新开始此链路</button>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

import ConversationThread from "../../components/agent/ConversationThread.vue";
import FlowDecisionCard from "../../components/agent/FlowDecisionCard.vue";
import ResultPanel from "../../components/agent/ResultPanel.vue";
import {
  buildRuleResult,
  getRuleSceneLabel,
  getRuleStep,
  ruleSceneStep,
  validateThreshold,
  type RuleSceneId,
} from "../../mock/flows";
import { markAgentVisited } from "../../stores/appState";
import type { ConversationMessage, FlowResult } from "../../types/agent";

const phase = ref<"scene" | "config" | "result">("scene");
const selectedScene = ref<RuleSceneId | null>(null);
const result = ref<FlowResult | null>(null);
const actionDone = ref(false);
const errorMessage = ref("");
const messages = ref<ConversationMessage[]>([]);

function nowText() {
  return new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function pushMessage(role: ConversationMessage["role"], content: string, tone?: ConversationMessage["tone"]) {
  messages.value.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
    timestamp: nowText(),
    tone,
  });
}

function resetFlow() {
  phase.value = "scene";
  selectedScene.value = null;
  result.value = null;
  errorMessage.value = "";
  actionDone.value = false;
  messages.value = [];
  pushMessage("assistant", ruleSceneStep.assistantPrompt);
}

function formatPayload(payload: Record<string, string | string[]>) {
  return Object.values(payload)
    .map((value) => (Array.isArray(value) ? value.join("、") : value))
    .filter(Boolean)
    .join(" / ");
}

function handleSubmit(payload: Record<string, string | string[]>) {
  errorMessage.value = "";

  if (phase.value === "scene") {
    selectedScene.value = String(payload.scene) as RuleSceneId;
    pushMessage("user", `${payload.objective}`);
    phase.value = "config";
    pushMessage(
      "assistant",
      `已切换到“${getRuleSceneLabel(selectedScene.value)}”模板。接下来请补充阈值、渠道和动作策略。`,
    );
    return;
  }

  if (phase.value === "config" && selectedScene.value) {
    const validation = validateThreshold(String(payload.threshold ?? ""));
    if (validation) {
      errorMessage.value = validation;
      return;
    }
    pushMessage("user", formatPayload(payload));
    result.value = buildRuleResult(selectedScene.value, payload);
    phase.value = "result";
    pushMessage("assistant", result.value.summary, "success");
  }
}

function handleAction() {
  if (!result.value || actionDone.value) return;
  actionDone.value = true;
  pushMessage("system", `规则草案已发布为演示版本，编号 ${result.value.reference}。`, "success");
}

const currentStep = computed(() => {
  if (phase.value === "scene") return ruleSceneStep;
  if (phase.value === "config" && selectedScene.value) return getRuleStep(selectedScene.value);
  return null;
});

const sceneLabel = computed(() => (selectedScene.value ? getRuleSceneLabel(selectedScene.value) : "待选择场景"));

onMounted(() => {
  markAgentVisited("rule-config");
  resetFlow();
});
</script>

<style scoped>
.summary {
  padding: 20px;
}

.summary p {
  margin: 10px 0 16px;
  color: var(--text-secondary);
  line-height: 1.7;
}

.reset-button {
  width: 100%;
  padding: 14px 16px;
}
</style>
