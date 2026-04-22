<template>
  <div class="page">
    <section class="summary section-card">
      <div class="page-kicker">Featured Flow</div>
      <h2>排障智能体</h2>
      <p>先识别问题场景，再进入订单、卡服务或 App 报错三类处理路径。</p>
      <div class="chip-grid">
        <span class="pill">订单执行类问题</span>
        <span class="pill">卡服务不可用问题</span>
        <span class="pill">App 执行报错问题</span>
      </div>
    </section>

    <ConversationThread :messages="messages" />

    <FlowDecisionCard
      v-if="currentStep && currentStep.decisionCard"
      :card="currentStep.decisionCard"
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
  buildTroubleshootResult,
  classifyTroubleshoot,
  getTroubleshootSceneLabel,
  getTroubleshootStep,
  troubleshootFirstStep,
  type TroubleshootScenarioId,
} from "../../mock/flows";
import { markAgentVisited } from "../../stores/appState";
import type { ConversationMessage, FlowResult } from "../../types/agent";

const phase = ref<"intent" | "detail" | "result">("intent");
const scenario = ref<TroubleshootScenarioId | null>(null);
const result = ref<FlowResult | null>(null);
const actionDone = ref(false);
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
  phase.value = "intent";
  scenario.value = null;
  result.value = null;
  actionDone.value = false;
  messages.value = [];
  pushMessage("assistant", troubleshootFirstStep.assistantPrompt);
}

function formatPayload(payload: Record<string, string | string[]>) {
  return Object.entries(payload)
    .filter(([, value]) => (Array.isArray(value) ? value.length > 0 : String(value).trim()))
    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join("、") : value}`)
    .join("；");
}

function handleSubmit(payload: Record<string, string | string[]>) {
  if (phase.value === "intent") {
    const description = String(payload.issueDescription ?? "");
    pushMessage("user", description);
    const detected = classifyTroubleshoot(description, String(payload.scenarioHint ?? ""));
    scenario.value = detected;
    phase.value = "detail";
    pushMessage(
      "assistant",
      `已识别为“${getTroubleshootSceneLabel(detected)}”。我将根据该场景继续采集关键上下文，并给出处置建议。`,
    );
    return;
  }

  if (phase.value === "detail" && scenario.value) {
    pushMessage("user", formatPayload(payload));
    result.value = buildTroubleshootResult(scenario.value, payload);
    phase.value = "result";
    pushMessage("assistant", result.value.summary, result.value.status);
  }
}

function handleAction() {
  if (!result.value || actionDone.value) return;
  actionDone.value = true;
  pushMessage("system", `处置工单已生成，单号 WO-20260422-018，关联模板 ${result.value.reference}。`, "success");
}

const currentStep = computed(() => {
  if (phase.value === "intent") return troubleshootFirstStep;
  if (phase.value === "detail" && scenario.value) return getTroubleshootStep(scenario.value);
  return null;
});

onMounted(() => {
  markAgentVisited("troubleshoot");
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
