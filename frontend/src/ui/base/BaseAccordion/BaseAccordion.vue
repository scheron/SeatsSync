<script setup lang="ts" generic="T">
import BaseAccordionItem from "./BaseAccordionItem.vue"

withDefaults(
  defineProps<{
    items: T[]
    itemId: (item: T, index: number) => string | number
    defaultOpened: (item: T, index: number) => boolean
    group?: string
    multiple?: boolean
  }>(),
  {
    items: () => [],
    itemId: (_, index: number) => index.toString(),
    opened: () => false,
    group: "default",
    multiple: false,
  },
)
</script>

<template>
  <BaseAccordionItem
    v-for="(item, index) in items"
    :key="itemId(item, index)"
    :opened="defaultOpened(item, index)"
    :group="group"
    :multiple="multiple"
  >
    <template #header>
      <slot name="header" :item="item" />
    </template>
    <template #content>
      <slot name="content" :item="item" />
    </template>
  </BaseAccordionItem>
</template>
