<template>
  <Modal id="qr_show" title="QR код продукта">
    <!-- {{ $store.state.currentProduct }} {{ $store.state.qrData }} -->
    <div style="display: flex" v-if="$store.state.qrGenerated">
      <qrcode-vue :value="$store.state.qrData" :size="300" render-as="svg" level="H" background="#ffffff00" style="margin: 0 auto"/>
    </div>
    <p style="margin: auto; text-align: center; margin-top: 20px; font-size: 1.2rem;">ID продукта: {{ $store.state.currentProduct }}</p>
  </Modal>
</template>

<script setup lang="ts">
import Modal from "@/components/Modal.vue";
import QrcodeVue from 'qrcode.vue'
</script>