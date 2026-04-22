<template>
  <div class="page">
    <section class="placeholder-hero section-card" v-if="agent">
      <div class="page-kicker">Preview Agent</div>
      <h2>{{ agent.name }}</h2>
      <p>{{ agent.description }}</p>
      <div class="chip-grid">
        <span class="pill">{{ agent.capability }}</span>
        <span class="pill">轻量预留页</span>
      </div>
    </section>

    <section class="section-card placeholder-body" v-if="agent">
      <div class="section-heading">
        <div>
          <h3>当前演示范围</h3>
          <p>该智能体保留了可点击入口和返回链路，便于后续扩充完整流程。</p>
        </div>
      </div>
      <ul class="preview-list">
        <li>已预留移动端入口与视觉样式</li>
        <li>已接入最近使用记录，方便从首页回访</li>
        <li>后续可按同样方式接入对话、卡片和结果页</li>
      </ul>
      <RouterLink class="accent-button back-button" to="/app/plaza">返回智能体广场</RouterLink>
    </section>

    <section class="section-card placeholder-body" v-else>
      <div class="section-heading">
        <div>
          <h3>未找到对应智能体</h3>
          <p>当前路由未匹配到可展示的轻量智能体入口。</p>
        </div>
      </div>
      <RouterLink class="accent-button back-button" to="/app/plaza">返回智能体广场</RouterLink>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";

import { agentsById } from "../../mock/agents";
import { markAgentVisited } from "../../stores/appState";
import { isAgentId } from "../../types/agent";

const route = useRoute();

const agent = computed(() => {
  const raw = String(route.params.agentId ?? "");
  return isAgentId(raw) ? agentsById[raw] : null;
});

watch(
  () => agent.value?.id,
  (value) => {
    if (value) markAgentVisited(value);
  },
  { immediate: true },
);

onMounted(() => {
  if (agent.value) markAgentVisited(agent.value.id);
});
</script>

<style scoped>
.placeholder-hero,
.placeholder-body {
  padding: 20px;
}

.placeholder-hero p {
  margin: 10px 0 16px;
  color: var(--text-secondary);
  line-height: 1.7;
}

.preview-list {
  margin: 16px 0 0;
  padding-left: 20px;
  color: var(--text-secondary);
  line-height: 1.8;
}

.back-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 48px;
  margin-top: 18px;
}
</style>
