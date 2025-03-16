<script setup lang="ts">
import BaseIcon from "@/ui/base/BaseIcon.vue"
</script>

<template>
  <ul class="flex items-center justify-center gap-8 rounded-md p-2">
    <li class="text-content/80 flex uppercase items-center gap-2 text-sm">
      <div class="bg-primary-300/50 size-6 border border-accent/20 rounded-md flex items-center justify-center">
        <BaseIcon name="close" class="text-primary-700 size-4" />
      </div>
      Reserved
    </li>
    <li class="text-content/80 flex uppercase items-center gap-2 text-sm">
      <div class="bg-primary-700/50 size-6 border border-accent/20 rounded-md"></div>
      Vacant
    </li>
  </ul>
</template>
