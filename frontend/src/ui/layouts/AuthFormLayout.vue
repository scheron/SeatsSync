<script setup lang="ts">
import Logo from "@/ui/common/Logo.vue"

defineProps<{label: string}>()
</script>

<template>
  <div class="flex w-64 flex-col items-center justify-center p-4">
    <Logo class="scale-50" />

    <div class="mb-1 w-full border-b border-primary-300"></div>

    <div class="flex w-full flex-col gap-2">
      <div class="mb-2 text-center text-xs font-light text-content/30">{{ label }}</div>

      <slot />
    </div>
    <slot name="footer" />
  </div>
</template>
