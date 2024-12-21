<script setup lang="ts">
import BaseCard from "@/ui/common/base/BaseCard.vue"
import Header from "@/ui/sections/Header.vue"
</script>

<template>
  <div class="flex h-svh w-svw flex-col gap-4 bg-primary-200 p-4 text-contrast">
    <Header />

    <div class="grid h-full grid-cols-[1fr_2fr_1fr] gap-4">
      <div class="flex flex-col gap-4">
        <BaseCard loading class="h-24"> Left Top Section </BaseCard>
        <BaseCard loading loader-type="spinner" class="flex-1">Left Main Content</BaseCard>
      </div>

      <div class="flex flex-col gap-4">
        <BaseCard class="flex-1">Center Main Content</BaseCard>
        <BaseCard loading class="h-24">Center Bottom Section</BaseCard>
      </div>

      <BaseCard loading loader-type="spinner">Right Content</BaseCard>
    </div>
  </div>
</template>
