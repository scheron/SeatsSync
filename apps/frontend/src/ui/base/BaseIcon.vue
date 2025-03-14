<script lang="ts" setup>
import {spriteInfo} from "@/types/icons"
import {cn} from "@/utils/tailwindcss"

import type {IconName} from "@/types/icons"
import type {ClassNameValue} from "tailwind-merge"

defineProps<{name: IconName}>()
</script>

<template>
  <svg :class="cn('inline-block aspect-square size-6', $attrs.class as ClassNameValue)" fill="currentColor">
    <use :href="`/${spriteInfo.filename}#${name}`" />
  </svg>
</template>
