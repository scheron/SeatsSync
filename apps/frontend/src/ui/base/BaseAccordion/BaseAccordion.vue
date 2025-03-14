<script setup lang="ts" generic="T">
import BaseAccordionItem from "./BaseAccordionItem.vue"

withDefaults(
  defineProps<{
    items: T[]
    itemId: (item: T, index: number) => string | number
    defaultOpened?: ((item: T, index: number) => boolean) | boolean
    activeItemId?: string | number
    group?: string
    closeActive?: boolean
    multiple?: boolean
  }>(),
  {
    items: () => [],
    itemId: (_, index: number) => index.toString(),
    defaultOpened: false,
    group: "default",
    multiple: false,
    closeActive: true,
  },
)
</script>

<template>
  <BaseAccordionItem
    v-for="(item, index) in items"
    :key="itemId(item, index)"
    :opened="typeof defaultOpened === 'function' ? defaultOpened(item, index) : defaultOpened"
    :active="activeItemId === itemId(item, index)"
    :group="group"
    :multiple="multiple"
    :close-active="closeActive"
  >
    <template #header>
      <slot name="header" :item="item" />
    </template>
    <template #content>
      <slot name="content" :item="item" />
    </template>
  </BaseAccordionItem>
</template>
