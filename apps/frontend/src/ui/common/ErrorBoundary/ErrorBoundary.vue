<script setup lang="ts">
import {onErrorCaptured, ref, useSlots} from "vue"
import DefaultFallback from "./DefaultFallback.vue"

import type {Component, ComponentPublicInstance} from "vue"

export interface VErrorBoundaryProps {
  fallBack?: Component
  onError?: Function
  params?: Record<any, any>
  stopPropagation?: boolean
}

const props = withDefaults(defineProps<VErrorBoundaryProps>(), {
  fallBack: () => DefaultFallback,
  onError: () => {},
  params: () => ({}),
  stopPropagation: false,
})

const emits = defineEmits<{"error-captured": [payload: {error: Error; vm: ComponentPublicInstance<any>; info: string}]}>()

const hasError$ = ref(false)
const err$ = ref<Error | null>(null)
const info$ = ref("")

const slots = useSlots()

if (!slots.default && !slots.boundary) {
  console.warn("ErrorBoundary component must have child components.")
}

onErrorCaptured((error: Error, vm, info: string) => {
  hasError$.value = true
  err$.value = error
  info$.value = info

  props?.onError(error, vm, info)
  console.log("Capture error in ErrorBoundary", {error, info})

  emits("error-captured", {error, vm, info})
  if (props.stopPropagation) return false
  return true
})
</script>

<template>
  <template v-if="!slots.boundary">
    <slot v-if="!hasError$" />
    <component :is="props.fallBack" v-else v-bind="params" />
  </template>

  <slot v-else name="boundary" :hasError="hasError$" :error="err$" :info="info$" v-bind="params" />
</template>
