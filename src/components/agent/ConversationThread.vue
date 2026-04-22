<template>
  <section class="section-card thread">
    <div class="section-heading">
      <div>
        <h3>对话进度</h3>
        <p>通过会话和卡片混合驱动演示链路</p>
      </div>
    </div>
    <div class="messages">
      <article
        v-for="message in messages"
        :key="message.id"
        class="message"
        :class="[message.role, message.tone ?? 'normal']"
      >
        <div class="message-meta">
          <span>{{ roleLabelMap[message.role] }}</span>
          <small>{{ message.timestamp }}</small>
        </div>
        <p>{{ message.content }}</p>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ConversationMessage } from "../../types/agent";

defineProps<{
  messages: ConversationMessage[];
}>();

const roleLabelMap = {
  assistant: "智能体",
  user: "用户",
  system: "系统",
};
</script>

<style scoped>
.thread {
  padding: 18px;
}

.messages {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.message {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 88%;
  padding: 14px 15px;
  border-radius: 20px;
  border: 1px solid rgba(152, 192, 255, 0.12);
  background: rgba(8, 31, 61, 0.62);
}

.message.user {
  margin-left: auto;
  background: linear-gradient(135deg, rgba(44, 128, 255, 0.88), rgba(66, 206, 255, 0.72));
  color: #f5fbff;
}

.message.system {
  max-width: 100%;
  background: rgba(18, 53, 101, 0.56);
}

.message.success {
  border-color: rgba(85, 222, 156, 0.3);
}

.message.warning {
  border-color: rgba(255, 179, 77, 0.34);
}

.message-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  color: var(--text-secondary);
  font-size: 12px;
}

.message.user .message-meta {
  color: rgba(255, 255, 255, 0.82);
}

.message p {
  margin: 0;
  line-height: 1.7;
  white-space: pre-wrap;
}
</style>
