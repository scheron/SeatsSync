<script setup lang="ts">
import {useDevice} from "@/composables/useDevice"
import {Carousel, Slide} from "vue3-carousel"

const {isTablet} = useDevice()

const slides = ["start", "middle", "end"]
</script>

<template>
  <div class="flex h-screen w-screen flex-col gap-4 overflow-hidden bg-primary-200 p-4 text-content">
    <slot name="header" />

    <Carousel v-if="isTablet" class="layout-carousel" height="100%" :perPage="1">
      <Slide v-for="slide in slides" :key="slide" class="flex h-full flex-col gap-4">
        <slot :name="slide" />
      </Slide>
    </Carousel>

    <div v-else class="grid h-full grid-cols-[1fr_2fr_1fr] gap-4">
      <div v-for="slide in slides" :key="slide" class="flex flex-col gap-4">
        <slot :name="slide" />
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
:deep(.layout-carousel) {
  height: 100%;

  & .carousel__viewport {
    height: 100%;
  }
}
</style>
