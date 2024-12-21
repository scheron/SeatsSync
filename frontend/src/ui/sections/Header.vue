<script setup lang="ts">
import {useThemeStore} from "@/stores/theme"
import BaseButton from "@/ui/common/base/BaseButton.vue"
import Logo from "@/ui/common/Logo.vue"

const cinema = "CGV Pearl Plaza"
const themeStore = useThemeStore()
</script>

<template>
  <header class="relative flex items-center justify-between rounded-lg bg-primary-100 p-4 shadow-md">
    <div>
      <BaseButton icon="map-pin" class="text-lg">{{ cinema }}</BaseButton>
    </div>

    <Logo class="absolute-center" />

    <div class="flex items-center gap-2">
      <BaseButton :icon="themeStore.isDarkMode ? 'sun' : 'moon'" @click="themeStore.toggleDarkMode" />
      <BaseButton icon="enter" class="flex-row-reverse text-lg">Login</BaseButton>
    </div>
  </header>
</template>
