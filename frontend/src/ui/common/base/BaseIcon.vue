<script lang="ts" setup>
import {ref, watchEffect} from "vue"
import {cn} from "@/utils/tailwindcss"

import type {IconName} from "@/types/icons"
import type {ClassNameValue} from "tailwind-merge"

const props = defineProps<{name: IconName}>()

const iconComponent = ref(null)

watchEffect(async () => {
  try {
    iconComponent.value = await import(`@/assets/icons/${props.name}.svg`)
  } catch (error) {
    try {
      iconComponent.value = (await import(`@/assets/icons/default.svg`)) as any
    } catch (defaultError) {
      iconComponent.value = null
    }
  }
})
</script>

<template>
  <component :is="iconComponent" v-if="iconComponent" :class="cn('inline-block aspect-square size-6', $attrs.class as ClassNameValue)" />
</template>
