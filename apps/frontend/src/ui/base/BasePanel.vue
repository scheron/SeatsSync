<script setup lang="ts">
withDefaults(
  defineProps<{
    clickable?: boolean
    active?: boolean
  }>(),
  {
    clickable: false,
    active: false,
  },
)
</script>

<template>
  <div
    class="border-content/10 focus-visible:border-accent hover:border-content/20 flex items-center justify-between rounded-lg border p-2 transition-colors outline-none"
    :class="{'border-primary-400 hover:border-primary-600 bg-primary-200 text-primary-900': active, 'cursor-pointer': clickable}"
    :tabindex="clickable ? 0 : undefined"
  >
    <slot />
  </div>
</template>
