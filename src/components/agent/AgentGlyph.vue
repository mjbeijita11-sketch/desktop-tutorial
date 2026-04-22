<template>
  <div class="glyph-shell" :style="{ background: agent.accent }">
    <svg v-if="agent.id === 'troubleshoot'" viewBox="0 0 48 48" fill="none" class="glyph">
      <path d="M15 12h18l5 5v19H15z" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M33 12v6h5" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M21 23h11M21 29h7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
      <circle cx="18" cy="32" r="5" stroke="currentColor" stroke-width="2.2"/>
      <path d="m22 36 4 4" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
    </svg>

    <svg v-else-if="agent.id === 'rule-config'" viewBox="0 0 48 48" fill="none" class="glyph">
      <rect x="10" y="11" width="28" height="8" rx="4" stroke="currentColor" stroke-width="2.2"/>
      <rect x="10" y="29" width="28" height="8" rx="4" stroke="currentColor" stroke-width="2.2"/>
      <path d="M20 19v10M30 19v10" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
      <circle cx="20" cy="15" r="3.5" fill="currentColor"/>
      <circle cx="30" cy="33" r="3.5" fill="currentColor"/>
    </svg>

    <svg v-else-if="agent.id === 'service'" viewBox="0 0 48 48" fill="none" class="glyph">
      <rect x="12" y="10" width="24" height="28" rx="6" stroke="currentColor" stroke-width="2.2"/>
      <path d="M18 18h12M18 24h12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
      <path d="m18 31 4 4 8-9" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>

    <svg v-else-if="agent.id === 'card-query'" viewBox="0 0 48 48" fill="none" class="glyph">
      <rect x="10" y="14" width="28" height="20" rx="5" stroke="currentColor" stroke-width="2.2"/>
      <path d="M10 20h28" stroke="currentColor" stroke-width="2.2"/>
      <path d="M17 28h7M29 28h2" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
    </svg>

    <svg v-else-if="agent.id === 'knowledge-qa'" viewBox="0 0 48 48" fill="none" class="glyph">
      <path d="M14 12h16a4 4 0 0 1 4 4v20H18a4 4 0 0 0-4 4z" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M18 16h16v20" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M21 21h8M21 27h10" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
    </svg>

    <svg v-else viewBox="0 0 48 48" fill="none" class="glyph">
      <path d="M13 34V18M24 34V11M35 34V24" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
      <circle cx="13" cy="34" r="3.5" fill="currentColor"/>
      <circle cx="24" cy="11" r="3.5" fill="currentColor"/>
      <circle cx="35" cy="24" r="3.5" fill="currentColor"/>
    </svg>
  </div>
</template>

<script setup lang="ts">
import type { AgentMeta } from "../../types/agent";

defineProps<{
  agent: AgentMeta;
}>();
</script>

<style scoped>
.glyph-shell {
  display: grid;
  place-items: center;
  width: 58px;
  height: 58px;
  border-radius: 18px;
  color: #f7fbff;
  box-shadow:
    0 10px 24px rgba(22, 66, 142, 0.24),
    inset 0 1px 0 rgba(255, 255, 255, 0.28);
}

.glyph {
  width: 28px;
  height: 28px;
}
</style>
