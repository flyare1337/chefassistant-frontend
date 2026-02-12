<script setup lang="ts">

import Chart from "@/components/Chart.vue";
import {onBeforeMount} from "vue";
import {authStore} from "@/utils/auth.ts";
import router from "@/router";

const auth = authStore()

onBeforeMount(async () => {
  if (!auth.isAuth) {
    await router.push("/")
  }
})
</script>

<template>
<div class="analytics">
  <div class="analytics-container container">
    <div class="analytics-title">Аналитика</div>
    <div class="analytics-card">
      <div class="analytics-card-chart-wrapper">
        <Chart />
      </div>
    </div>
  </div>
</div>
</template>

<style scoped lang="scss">
.analytics {
  margin-top: 60px;

  &-title {
    font-size: 2rem;
    font-weight: 600;
  }

  &-card {
    margin-top: 30px;
    width: 100%;
    padding: 30px;
    background: var(--color-sub-background);
    border: 1px solid var(--color-main);
    border-radius: 15px;

    &-chart {
      &-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}

</style>