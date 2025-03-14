<script setup lang="ts">
import {QrcodeCanvas} from "qrcode.vue"
import {useThemeStore} from "@/stores/theme"

import type {Level} from "qrcode.vue"

withDefaults(defineProps<{code: string; size?: number; level?: Level}>(), {
  code: "",
  level: "H",
  size: 100,
})

const themeStore = useThemeStore()
</script>

<template>
  <QrcodeCanvas
    :value="code"
    :size="size"
    :level="level"
    class="size-full"
    :background="themeStore.isDarkMode ? '#000000' : '#ffffff'"
    :foreground="themeStore.isDarkMode ? '#ffffff' : '#000000'"
  />
</template>
