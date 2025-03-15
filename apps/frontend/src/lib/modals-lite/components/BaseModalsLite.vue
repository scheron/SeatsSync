<script setup lang="ts">
import {computed, inject} from "vue"
import {MODAL_CONTEXT} from "../model/types"
import {cn} from "../utils/tailwindcss"

import type {ModalContext} from "../model/types"

const props = defineProps<{
  classOverlay?: string
  classContainer?: string
}>()

const modalContext = inject<ModalContext>(MODAL_CONTEXT)!

const classesOverlay = computed(() => cn("fixed inset-0 flex items-center justify-center", props.classOverlay))

function handleOverlayClick(event: MouseEvent) {
  if (event.target !== event.currentTarget) return
  modalContext?.closeSelf?.()
}
</script>

<template>
  <div :class="classesOverlay" :style="{position: modalContext.strategy.strategy}" @click="handleOverlayClick">
    <div :class="classContainer">
      <slot />
    </div>
  </div>
</template>
