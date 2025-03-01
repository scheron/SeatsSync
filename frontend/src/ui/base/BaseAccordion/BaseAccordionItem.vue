<script setup lang="ts">
import {ref} from "vue"
import {useExpansionGroupItem} from "@/composables/useExpansionGroupItem"
import BaseIcon from "@/ui/base/BaseIcon.vue"
import BaseTransitions from "@/ui/base/BaseTransitions.vue"

const props = withDefaults(
  defineProps<{
    opened?: boolean
    group?: string
    multiple?: boolean
  }>(),
  {
    opened: false,
    group: "default",
    multiple: false,
  },
)

const isOpened = props.multiple ? ref(props.opened) : useExpansionGroupItem(props.group, props.opened)
</script>

<template>
  <div>
    <div
      tabindex="0"
      class="border-content/10 focus-within:border-accent hover:border-content/20 flex cursor-pointer items-center justify-between rounded-lg border transition-colors outline-none"
      :class="{'border-accent/50': isOpened}"
      @click="isOpened = !isOpened"
      @keydown.enter="isOpened = !isOpened"
      :aria-expanded="isOpened"
    >
      <slot name="header" />
      <BaseIcon name="chevron-down" class="mx-2 size-4 transition-transform duration-300" :class="{'rotate-180': isOpened}" />
    </div>

    <BaseTransitions name="slide">
      <div v-show="isOpened" class="mt-2 overflow-hidden transition-all duration-300">
        <slot name="content" />
      </div>
    </BaseTransitions>
  </div>
</template>
