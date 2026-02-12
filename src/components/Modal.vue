<template>
  <div v-if="$store.state.showPopup === id" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop style="width: 600px">
      <div class="modal-title">
        <div class="title">{{ title }}</div>
        <div class="x" @click="closeModal"><PhX :size="40" /></div>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {PhX} from "@phosphor-icons/vue";

export default defineComponent({
  name: 'Modal',
  components: {PhX},
  props: {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true
    },
  },
  emits: ['close'],
  methods: {
    closeModal() {
      this.$emit('close');
      this.$store.commit('showPopup', {'value': ''})
    },
  },
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
}

.modal-content {
  width: 100%;
  padding: 30px;
  background: var(--color-sub-background);
  border: 1px solid var(--color-main);
  border-radius: 15px;
}

.modal-title {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.modal-title .title {
  font-size: 1.5rem !important;
  font-weight: 600;
}

.modal-title .x {
  cursor: pointer;
  transition: 0.125s ease-in-out;
}

.modal-title .x:hover {
  opacity: 0.5;
}

</style>