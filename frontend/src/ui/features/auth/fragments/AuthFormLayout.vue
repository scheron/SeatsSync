<script setup lang="ts">
import Logo from "@/ui/common/Logo.vue"

defineProps<{desc: string; title?: string}>()
defineEmits<{submit: []}>()
</script>

<template>
  <div class="flex w-64 flex-col items-center justify-center p-4">
    <Logo class="scale-75" />

    <div class="border-primary-300 relative my-2 w-full border-b">
      <span v-if="title" class="bg-primary-100 text-content/60 absolute-center absolute px-2 text-sm">{{ title }}</span>
    </div>

    <form class="flex w-full flex-col gap-2" @submit.prevent="$emit('submit')">
      <div class="text-content/50 my-2 text-center text-xs font-light">{{ desc }}</div>

      <slot />
    </form>
    <slot name="footer" />
  </div>
</template>
