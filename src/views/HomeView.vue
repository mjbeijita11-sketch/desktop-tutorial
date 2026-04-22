<template>
  <div class="page">
    <section class="hero section-card">
      <div class="page-kicker">Welcome Back</div>
      <h2>{{ appState.user?.name ?? "演示账号" }}，欢迎进入移动工作台</h2>
      <p>
        当前首页聚合了业务入口、重点智能体推荐和最近使用记录，适合作为演示开场页。
      </p>
      <div class="hero-actions">
        <RouterLink class="accent-button hero-button" to="/app/plaza">进入智能体广场</RouterLink>
        <RouterLink class="ghost-button hero-button" :to="featuredAgents[0].route">直接体验排障链路</RouterLink>
      </div>
    </section>

    <section class="metrics-grid">
      <div v-for="item in homeHighlights" :key="item.label" class="metric-card section-card">
        <strong>{{ item.value }}</strong>
        <span>{{ item.label }}</span>
      </div>
    </section>

    <section class="page-section">
      <div class="section-heading">
        <div>
          <h3>推荐智能体</h3>
          <p>三条重点链路已可完整体验</p>
        </div>
      </div>
      <div class="card-grid">
        <AgentCard v-for="agent in featuredAgents" :key="agent.id" :agent="agent" compact />
      </div>
    </section>

    <section class="page-section section-card recent-panel">
      <div class="section-heading">
        <div>
          <h3>最近使用</h3>
          <p>根据演示体验自动记录最近访问入口</p>
        </div>
      </div>
      <div class="recent-list">
        <RouterLink v-for="agent in recentList" :key="agent.id" :to="agent.route" class="recent-item">
          <div>
            <strong>{{ agent.name }}</strong>
            <p>{{ agent.capability }}</p>
          </div>
          <span>进入</span>
        </RouterLink>
      </div>
    </section>

    <section class="page-section section-card moment-panel">
      <div class="section-heading">
        <div>
          <h3>演示节奏建议</h3>
          <p>首页建议用 30 秒建立整体认知</p>
        </div>
      </div>
      <ol class="moment-list">
        <li v-for="item in stageMoments" :key="item">{{ item }}</li>
      </ol>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";

import AgentCard from "../components/agent/AgentCard.vue";
import { featuredAgents, homeHighlights, stageMoments } from "../mock/agents";
import { appState, recentAgents } from "../stores/appState";

const recentList = computed(() => (recentAgents.value.length ? recentAgents.value : featuredAgents.slice(0, 2)));
</script>

<style scoped>
.hero,
.recent-panel,
.moment-panel {
  padding: 20px;
}

.hero p {
  margin: 10px 0 18px;
  color: var(--text-secondary);
  line-height: 1.7;
}

.hero-actions {
  display: flex;
  gap: 12px;
}

.hero-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0 16px;
}

.metrics-grid,
.card-grid {
  display: grid;
  gap: 12px;
}

.metrics-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.metric-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 18px 16px;
}

.metric-card strong {
  font-size: 26px;
}

.metric-card span {
  color: var(--text-secondary);
  font-size: 13px;
}

.card-grid {
  grid-template-columns: 1fr;
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 16px;
}

.recent-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 18px;
  background: rgba(10, 32, 63, 0.46);
  border: 1px solid rgba(151, 194, 255, 0.12);
}

.recent-item p {
  margin: 6px 0 0;
  color: var(--text-secondary);
  font-size: 13px;
}

.recent-item span {
  color: var(--accent);
  font-weight: 700;
}

.moment-list {
  margin: 16px 0 0;
  padding-left: 20px;
  color: var(--text-secondary);
  line-height: 1.8;
}

@media (max-width: 380px) {
  .hero-actions,
  .metrics-grid {
    grid-template-columns: 1fr;
    display: grid;
  }
}
</style>
