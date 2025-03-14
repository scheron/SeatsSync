<script setup lang="ts">
import {computed} from "vue"
import {cn} from "@/utils/tailwindcss"
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
    <div v-if="loading" class="bg-primary-300 absolute inset-0 z-10 flex items-center justify-center rounded-lg">
      <div v-if="loaderType === 'skeleton'" class="size-full">
        <div class="bg-primary-500 size-full animate-pulse rounded"></div>
      </div>

      <BaseSpinner v-else-if="loaderType === 'spinner'" class="text-primary-900 size-10" />
    </div>

    <slot v-else />
  </div>
</template>
