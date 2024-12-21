<template>
  <div class="bg-red-100">
    <div class="text-accent">DARK MODE: {{ themeStore.isDarkMode }}</div>
    <div>COLOR PRIMARY: {{ themeStore.primaryColor }}</div>

    <input type="color" v-model="themeStore.primaryColor" @change="themeStore.setPrimaryColor(themeStore.primaryColor)" />
    <BaseCheckbox :model-value="themeStore.isDarkMode" @update:model-value="themeStore.toggleDarkMode" label="Primary color" />

    <div class="mt-6 flex flex-wrap gap-4">
      <div>Color palette</div>
      <div v-for="(key, index) in paletteKeys" :key="index" class="flex items-center space-x-4">
        <div class="h-16 w-16 rounded" :style="{backgroundColor: `var(--color-${key})`}"></div>
        <span class="text-primary-100">Base {{ key }}</span>
      </div>
    </div>

    <div class="mt-6 flex flex-wrap gap-4">
      <div class="bg-primary-400 text-contrast">Tailwind color palette</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useThemeStore} from "@/stores/theme"
import BaseCheckbox from "@/ui/common/base/BaseCheckbox.vue"

const themeStore = useThemeStore()

const paletteKeys = [0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900]
const twPaletteKeys = [100, 200, 300, 400, 500, 600, 700, 800, 900]
</script>
