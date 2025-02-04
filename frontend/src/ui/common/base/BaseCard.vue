<script setup lang="ts">
import {computed} from "vue"
import {cn} from "@/shared/utils/tailwindcss"
import BaseSpinner from "./BaseSpinner.vue"

import type {HtmlHTMLAttributes} from "vue"

type Props = {
  loading?: boolean
  loaderType?: "skeleton" | "spinner"
  class?: HtmlHTMLAttributes["class"]
}

const props = withDefaults(defineProps<Props>(), {
  loaderType: "skeleton",
  loading: false,
  class: "",
})

const classes = computed(() => {
  return cn("relative size-full overflow-auto rounded-lg bg-primary-100 p-4 shadow-md", props.class)
})
</script>

<template>
  <div :class="classes">
    <div v-if="loading" class="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-primary-300">
      <div v-if="loaderType === 'skeleton'" class="size-full">
        <div class="size-full animate-pulse rounded bg-primary-500"></div>
      </div>

      <BaseSpinner v-else-if="loaderType === 'spinner'" class="size-10 text-primary-900" />
    </div>

    <slot v-else />
  </div>
</template>
