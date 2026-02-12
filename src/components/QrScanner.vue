<script setup lang="ts">
import {onMounted, ref, type Ref} from "vue";
import {type Html5QrcodeResult, Html5QrcodeScanner, type QrcodeSuccessCallback} from "html5-qrcode";
import type {Html5QrcodeError} from "html5-qrcode/core";

const props = defineProps({
  qrbox: {
    type: Number,
    default: 250
  },
  fps: {
    type: Number,
    default: 10
  },
  onScanned: {
    type: Function,
    required: true
  }
})

let scanner: Ref<Html5QrcodeScanner | undefined> = ref(undefined)

let onScanSuccess = function (decodedText: string, result: Html5QrcodeResult) {
  props.onScanned(decodedText, result)
  scanner.value?.clear()
}

let onError = function (errorMessage: string, error: Html5QrcodeError) {
  // console.error(errorMessage)
}

onMounted(async () => {
  const config = {
    fps: props.fps,
    qrbox: props.qrbox,
  };
  console.log(config);
  const html5QrcodeScanner = new Html5QrcodeScanner('qr-code-full-region', config, false);
  html5QrcodeScanner.render(onScanSuccess, onError);
  scanner.value = html5QrcodeScanner
})
</script>

<template>
  <div id="qr-code-full-region" style="max-width: 70%; margin: auto"></div>
</template>

<style scoped lang="scss">

</style>