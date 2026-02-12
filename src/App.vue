<template>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"/>
  <div class="root" id="root">
    <router-view v-slot="{ Component, route }">
      <Header/>
      <div class="layout">
        <transition
            enter-active-class="animate__animated animate__fadeIn"
            leave-active-class="animate__animated animate__fadeOut"
            mode="out-in">
          <component :is="Component" :key="route.fullPath" />
        </transition>
      </div>

      <QrScannerModal/>
      <QrShowModal/>
      <CreateTypeModal/>
      <CreateCategoryModal/>

      <Notification />
    </router-view>
  </div>
</template>

<script setup lang="ts">
import Header from "@/components/Header.vue";
import QrScannerModal from "./modals/QrScannerModal.vue";
import QrShowModal from "./modals/QrShowModal.vue";
import CreateTypeModal from "./modals/CreateTypeModal.vue";
import CreateCategoryModal from "./modals/CreateCategoryModal.vue";
</script>

<style scoped lang="scss">
.root {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
  margin-top: 54px;
}

.animate__animated.animate__fadeIn {
  --animate-duration: 0.5s;
}

.animate__animated.animate__fadeOut {
  --animate-duration: 0.5s;
}
</style>
