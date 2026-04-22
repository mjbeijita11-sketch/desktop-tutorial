<template>
  <section class="login-page">
    <div class="hero-panel section-card">
      <div class="page-kicker">Mobile Demo Portal</div>
      <h1 class="hero-title">智能体广场</h1>
      <p class="hero-copy">
        以移动端 Web 仿真方式，集中展示排障、规则配置与业务办理三条重点业务链路。
      </p>
      <div class="chip-grid">
        <span class="pill">移动端仿真</span>
        <span class="pill">Mock 驱动</span>
        <span class="pill">领导演示向</span>
      </div>
    </div>

    <form class="login-card section-card" @submit.prevent="enterDemo">
      <div class="section-heading">
        <div>
          <h3>登录进入首页</h3>
          <p>登录仅用于进入演示流程，不涉及真实鉴权。</p>
        </div>
      </div>

      <label class="field">
        <span>账号名称</span>
        <input v-model="accountName" type="text" placeholder="请输入演示账号名称" />
      </label>

      <label class="field">
        <span>访问口令</span>
        <input v-model="demoCode" type="password" placeholder="输入任意内容即可进入" />
      </label>

      <div class="tips-box">
        <strong>演示提示</strong>
        <p>登录后默认进入移动工作台，可通过顶部菜单或底部导航进入智能体广场。</p>
      </div>

      <button class="accent-button submit" type="submit">进入首页</button>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

import { loginAsDemo } from "../stores/appState";

const router = useRouter();
const accountName = ref("业务体验官");
const demoCode = ref("demo");

function enterDemo() {
  loginAsDemo(accountName.value.trim());
  router.push("/app/home");
}
</script>

<style scoped>
.login-page {
  display: flex;
  flex-direction: column;
  gap: 18px;
  height: calc(100% - 42px);
  padding: 16px;
}

.hero-panel,
.login-card {
  padding: 22px 20px;
}

.hero-copy {
  margin: 14px 0 18px;
  color: var(--text-secondary);
  line-height: 1.8;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 16px;
}

.field span {
  font-size: 14px;
  font-weight: 600;
}

.field input {
  width: 100%;
  padding: 14px;
  border-radius: 16px;
  border: 1px solid rgba(155, 196, 255, 0.18);
  background: rgba(7, 24, 46, 0.7);
  color: var(--text-main);
}

.tips-box {
  margin-top: 18px;
  padding: 16px;
  border-radius: 18px;
  background: rgba(10, 32, 63, 0.48);
  color: var(--text-secondary);
}

.tips-box strong {
  display: block;
  margin-bottom: 8px;
  color: var(--text-main);
}

.submit {
  width: 100%;
  margin-top: 18px;
  padding: 14px 16px;
}
</style>
