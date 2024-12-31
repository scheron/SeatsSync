<script lang="ts" setup>
import {cn} from "@/utils/tailwindcss"

import type {IconName} from "@/types/icons"
import type {ClassNameValue} from "tailwind-merge"

const props = defineProps<{
  name: IconName
  size?: string
  color?: string
}>()
</script>

<template>
  <svg :class="cn('inline-block aspect-square size-6', $attrs.class as ClassNameValue)" fill="currentColor">
    <use :href="`/icons-sprite.svg#${props.name}`" />
  </svg>
</template>
