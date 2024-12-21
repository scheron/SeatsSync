<template>
  <div>
    <input type="color" v-model="primaryColor" @change="setPrimaryColor(primaryColor)" />

    <div class="mt-6 flex flex-wrap gap-4">
      <div v-for="(key, index) in paletteKeys" :key="index" class="flex items-center space-x-4">
        <div class="h-16 w-16 rounded" :style="{backgroundColor: `var(--base-${key})`}"></div>
        <span class="text-gray-700 dark:text-gray-300">Base {{ key }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import {usePalette} from "./stores/theme/usePalette"

const {primaryColor, setPrimaryColor} = usePalette()

const paletteKeys = [0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900]
</script>
