<script setup lang="ts">
import Logo from "@/ui/common/Logo.vue"

defineProps<{desc: string}>()
defineEmits<{submit: [void]}>()
</script>

<template>
  <div class="flex w-64 flex-col items-center justify-center p-4">
    <Logo class="scale-75" />

    <div class="mb-1 w-full border-b border-primary-300"></div>

    <form class="flex w-full flex-col gap-2" @submit.prevent="$emit('submit')">
      <div class="mb-2 text-center text-xs font-light text-content/50">{{ desc }}</div>

      <slot />
    </form>
    <slot name="footer" />
  </div>
</template>
