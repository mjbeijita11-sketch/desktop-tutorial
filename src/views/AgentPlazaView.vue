<template>
  <div class="page">
    <section class="plaza-hero section-card">
      <div class="page-kicker">Agent Matrix</div>
      <h2>智能体广场</h2>
      <p>面向移动端场景集中展示 6 个智能体，每个卡片均包含图标、功能介绍和应用领域说明。</p>
    </section>

    <section class="page-section">
      <div class="section-heading">
        <div>
          <h3>重点演示智能体</h3>
          <p>可完整体验会话、卡片、结果页闭环</p>
        </div>
        <span class="pill">{{ featuredAgents.length }} 个</span>
      </div>
      <div class="grid">
        <AgentCard v-for="agent in featuredAgents" :key="agent.id" :agent="agent" />
      </div>
    </section>

    <section class="page-section">
      <div class="section-heading">
        <div>
          <h3>轻量预留入口</h3>
          <p>保留跳转与返回路径，便于后续拓展更多能力</p>
        </div>
        <span class="pill">{{ previewAgents.length }} 个</span>
      </div>
      <div class="grid">
        <AgentCard v-for="agent in previewAgents" :key="agent.id" :agent="agent" compact />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import AgentCard from "../components/agent/AgentCard.vue";
import { featuredAgents, previewAgents } from "../mock/agents";
</script>

<style scoped>
.plaza-hero {
  padding: 20px;
}

.plaza-hero p {
  margin: 10px 0 0;
  color: var(--text-secondary);
  line-height: 1.8;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

@media (max-width: 360px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
