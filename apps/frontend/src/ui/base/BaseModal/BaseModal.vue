<script setup lang="ts">
import {computed} from "vue"
import {BaseModalsLite} from "@/lib/modals-lite"
import {cn} from "@/utils/tailwindcss"
import BaseSpinner from "@/ui/base/BaseSpinner.vue"
import {containerVariants, contentVariants} from "./variants"

import type {Props} from "./types"

const props = withDefaults(defineProps<Props>(), {
  classContainer: "",
  classContent: "",
  align: "center",
  position: "center",
  fullscreen: false,
  loading: false,
})

const emit = defineEmits<{close: []}>()

const containerClass = computed(() => cn(containerVariants(props).value, props.classContainer))
const contentClass = computed(() => cn(contentVariants(props).value, props.classContent))
const overlayClass = computed(() => cn("bg-primary-100/90", props.classOverlay))
</script>

<template>
  <BaseModalsLite :class-container="containerClass" :class-overlay="overlayClass" @click-outside="emit('close')">
    <div class="size-full overflow-auto" :class="contentClass">
      <slot v-if="loading" name="loader">
        <div class="size-full min-h-48 min-w-48">
          <BaseSpinner />
        </div>
      </slot>

      <slot v-else />
    </div>
  </BaseModalsLite>
</template>
