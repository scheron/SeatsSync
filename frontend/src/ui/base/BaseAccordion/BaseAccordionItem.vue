<script setup lang="ts">
import {ref} from "vue"
import {useExpansionGroupItem} from "@/composables/useExpansionGroupItem"
import BaseIcon from "@/ui/base/BaseIcon.vue"
import BasePanel from "@/ui/base/BasePanel.vue"
import BaseTransitions from "@/ui/base/BaseTransitions.vue"

const props = withDefaults(
  defineProps<{
    opened?: boolean
    group?: string
    multiple?: boolean
    closeActive?: boolean
    active?: boolean
  }>(),
  {
    opened: false,
    group: "default",
    multiple: false,
    closeActive: true,
  },
)

const isOpened = props.multiple ? ref(props.opened) : useExpansionGroupItem(props.group, props.opened)

function onToggle() {
  if (!props.closeActive && isOpened.value && props.active) return

  isOpened.value = !isOpened.value
}
</script>

<template>
  <div>
    <BasePanel clickable :aria-expanded="isOpened" :active="active" @click="onToggle" @keydown.enter="onToggle">
      <slot name="header" />
      <BaseIcon name="chevron-down" class="mx-2 size-4 transition-transform duration-300" :class="{'rotate-180': isOpened}" />
    </BasePanel>

    <BaseTransitions name="slide">
      <div v-show="isOpened" class="mt-2 overflow-hidden transition-all duration-300">
        <slot name="content" />
      </div>
    </BaseTransitions>
  </div>
</template>
