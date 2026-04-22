<template>
  <RouterLink :to="agent.route" class="agent-card section-card" :class="{ compact }">
    <div class="agent-top">
      <AgentGlyph :agent="agent" />
      <span class="agent-status">{{ agent.featured ? "重点推荐" : "更多智能体" }}</span>
    </div>

    <div class="agent-main">
      <h3>{{ agent.name }}</h3>
      <p class="agent-desc">{{ agent.description }}</p>
    </div>

    <div class="intro-block">
      <span class="intro-label">功能</span>
      <p>{{ agent.functionIntro }}</p>
    </div>

    <div class="intro-block">
      <span class="intro-label">应用领域</span>
      <p>{{ agent.domainIntro }}</p>
    </div>

    <div class="chip-grid">
      <span v-for="tag in agent.tags" :key="tag" class="mini-chip">{{ tag }}</span>
    </div>

    <div class="agent-foot">
      <strong>{{ agent.category }}</strong>
      <span>{{ compact ? "查看" : "进入" }}</span>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";

import AgentGlyph from "./AgentGlyph.vue";
import type { AgentMeta } from "../../types/agent";

defineProps<{
  agent: AgentMeta;
  compact?: boolean;
}>();
</script>

<style scoped>
.agent-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px 16px;
  min-height: 278px;
  transition:
    transform 0.24s ease,
    border-color 0.24s ease,
    background 0.24s ease;
}

.agent-card:hover {
  transform: translateY(-2px);
  border-color: rgba(111, 188, 255, 0.34);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05)),
    rgba(9, 31, 61, 0.88);
}

.agent-card.compact {
  min-height: 266px;
}

.agent-top,
.agent-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.agent-status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  background: rgba(92, 201, 255, 0.12);
  border: 1px solid rgba(124, 200, 255, 0.18);
  color: var(--text-secondary);
  font-size: 12px;
}

.agent-main h3 {
  margin: 0;
  font-size: 18px;
  line-height: 1.35;
}

.agent-desc {
  margin: 8px 0 0;
  color: var(--text-secondary);
  line-height: 1.6;
  font-size: 13px;
}

.intro-block {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 2px;
}

.intro-label {
  color: var(--accent);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.intro-block p {
  margin: 0;
  color: rgba(239, 246, 255, 0.8);
  line-height: 1.65;
  font-size: 13px;
}

.mini-chip {
  padding: 5px 10px;
  border-radius: 999px;
  background: rgba(92, 201, 255, 0.08);
  color: var(--text-secondary);
  font-size: 12px;
}

.agent-foot strong {
  max-width: 72%;
  color: rgba(244, 249, 255, 0.74);
  font-size: 13px;
  font-weight: 600;
  line-height: 1.5;
}

.agent-foot span {
  color: var(--accent);
  font-weight: 700;
}
</style>
