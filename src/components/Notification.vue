<script setup lang="ts">
import {PhCheck} from "@phosphor-icons/vue";


</script>

<script lang="ts">
import { ref } from "vue";
import { viewNotify, notify, getNotification } from "@/utils/notification.ts";


</script>

<template>
<div class="notification" v-if="viewNotify">
  <div class="notification-wrapper">
    <div class="notification-card" :class="notify.status === 0 ? 'success' : 'error'">
      <div class="notification-title">
        {{ notify.title }}
      </div>
      <div class="notification-body">{{ notify.msg }}</div>
    </div>
  </div>
</div>
</template>

<style scoped lang="scss">
.notification {
  position: fixed;
  bottom: 20px;
  right: 20px;

  &-card {
    width: 400px;
    padding: 20px;
    border-radius: 15px;

    &.success {
      border: 1px solid #a3d886;
      background: #d9dbb2;
    }

    &.error {
      border: 1px solid #f79d8f;
      background: #f5bdaa;
    }
  }

  &-title {
    display: flex;
    align-items: center;
    gap: 0 15px;
    font-weight: 600;
    font-size: 1.15rem;
    margin-bottom: 10px;
  }
}
</style>