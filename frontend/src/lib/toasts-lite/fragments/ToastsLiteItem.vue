<script setup lang="ts">
import {ref, watchEffect} from "vue"

import type {ToastProps} from "../model/types"

const props = defineProps<ToastProps>()
const emit = defineEmits(["close"])

const timer = ref<ReturnType<typeof setTimeout> | null>(null)
const startedAt = ref<number>(0)
const remainingTime = ref<number>(0)

function close() {
  if (timer.value) clearTimeout(timer.value)
  emit("close")
}

function pause() {
  if (timer.value) {
    clearTimeout(timer.value)
    timer.value = null
    remainingTime.value = props.duration - (Date.now() - startedAt.value)
  }
}

function resume() {
  if (!timer.value && remainingTime.value > 0) {
    timer.value = setTimeout(close, remainingTime.value)
  }
}

watchEffect(() => {
  if (props.autoClose) {
    startedAt.value = Date.now()
    remainingTime.value = props.duration
    timer.value = setTimeout(close, props.duration)
  }
})

defineExpose({
  pause,
  resume,
})
</script>
<template>
  <div class="toasts-lite__toast" :style="`--toast-duration: ${duration}s;`" @click.prevent="close">
    <div v-if="['success', 'error', 'loading'].includes(type)" class="toasts-lite__icon">
      <div v-if="type === 'success'" class="toasts-lite__success" />
      <div v-else-if="type === 'error'" class="toasts-lite__error" />
      <div v-else-if="type === 'loading'" class="toasts-lite__loading" />
    </div>
    <div class="toasts-lite__content">
      <div class="toasts-lite__content-message">{{ message }}</div>
    </div>
  </div>
</template>
