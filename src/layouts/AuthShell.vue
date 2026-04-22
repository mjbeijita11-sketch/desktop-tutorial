<template>
  <DeviceFrame>
    <RouterView />
  </DeviceFrame>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";

import DeviceFrame from "../components/shell/DeviceFrame.vue";
</script>
