<script setup lang="ts">
import Logo from "@/ui/common/Logo.vue"

defineProps<{desc: string; title?: string}>()
defineEmits<{submit: []}>()
</script>

<template>
  <div class="flex w-64 flex-col items-center justify-center p-4">
    <Logo class="scale-75" />

    <div class="relative my-2 w-full border-b border-primary-300">
      <span v-if="title" class="absolute bg-primary-100 px-2 text-sm text-content/60 absolute-center">{{ title }}</span>
    </div>

    <form class="flex w-full flex-col gap-2" @submit.prevent="$emit('submit')">
      <div class="my-2 text-center text-xs font-light text-content/50">{{ desc }}</div>

      <slot />
    </form>
    <slot name="footer" />
  </div>
</template>
