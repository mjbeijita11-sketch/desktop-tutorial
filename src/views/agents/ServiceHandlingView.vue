<template>
  <div class="page">
    <section class="summary section-card">
      <div class="page-kicker">Featured Flow</div>
      <h2>业务办理智能体</h2>
      <p>通过事项识别、卡片式参数采集和办理结果确认，演示业务受理过程。</p>
      <div class="chip-grid">
        <span class="pill">{{ serviceLabel }}</span>
        <span class="pill">卡片式参数采集</span>
        <span class="pill">结果回执</span>
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
  buildServiceResult,
  getServiceSceneLabel,
  getServiceStep,
  serviceIntentStep,
  serviceMaterialsStep,
  type ServiceSceneId,
} from "../../mock/flows";
import { markAgentVisited } from "../../stores/appState";
import type { ConversationMessage, FlowResult } from "../../types/agent";

const phase = ref<"intent" | "params" | "materials" | "result">("intent");
const serviceType = ref<ServiceSceneId | null>(null);
const parameterPayload = ref<Record<string, string | string[]>>({});
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
  phase.value = "intent";
  serviceType.value = null;
  parameterPayload.value = {};
  result.value = null;
  actionDone.value = false;
  errorMessage.value = "";
  messages.value = [];
  pushMessage("assistant", serviceIntentStep.assistantPrompt);
}

function formatPayload(payload: Record<string, string | string[]>) {
  return Object.values(payload)
    .flat()
    .join(" / ");
}

function handleSubmit(payload: Record<string, string | string[]>) {
  errorMessage.value = "";

  if (phase.value === "intent") {
    serviceType.value = String(payload.serviceType) as ServiceSceneId;
    pushMessage("user", String(payload.requestSummary));
    phase.value = "params";
    pushMessage("assistant", `已识别为“${getServiceSceneLabel(serviceType.value)}”。请继续补充办理参数。`);
    return;
  }

  if (phase.value === "params" && serviceType.value) {
    parameterPayload.value = payload;
    pushMessage("user", formatPayload(payload));
    phase.value = "materials";
    pushMessage("assistant", serviceMaterialsStep.assistantPrompt);
    return;
  }

  if (phase.value === "materials" && serviceType.value) {
    const confirmed = Array.isArray(payload.materials) ? payload.materials : [];
    if (confirmed.length < 2) {
      errorMessage.value = "请至少确认两个关键事项，保证办理信息完整。";
      return;
    }
    pushMessage("user", confirmed.join(" / "));
    result.value = buildServiceResult(serviceType.value, {
      ...parameterPayload.value,
      ...payload,
    });
    phase.value = "result";
    pushMessage("assistant", result.value.summary, "success");
  }
}

function handleAction() {
  if (!result.value || actionDone.value) return;
  actionDone.value = true;
  pushMessage("system", `办理指令已提交，模拟单号 ${result.value.reference}，状态为“待执行”。`, "success");
}

const currentStep = computed(() => {
  if (phase.value === "intent") return serviceIntentStep;
  if (phase.value === "params" && serviceType.value) return getServiceStep(serviceType.value);
  if (phase.value === "materials") return serviceMaterialsStep;
  return null;
});

const serviceLabel = computed(() => (serviceType.value ? getServiceSceneLabel(serviceType.value) : "待识别事项"));

onMounted(() => {
  markAgentVisited("service");
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
