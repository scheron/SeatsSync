<script setup lang="ts">
import {useThemeStore} from "@/stores/theme"
import BaseButton from "@/ui/common/base/BaseButton.vue"
import BasePopover from "@/ui/common/base/BasePopover.vue"
import Logo from "@/ui/common/Logo.vue"
import BaseInput from "../common/base/BaseInput/BaseInput.vue"

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
      <BasePopover>
        <template #trigger="{show}">
          <BaseButton icon="enter" class="flex-row-reverse text-lg" @click="show">Login</BaseButton>
        </template>
        <template #content>
          <div class="flex flex-col gap-2">
            <BaseInput label="Username" placeholder="Enter username" />
            <BaseInput label="2FA-Key" placeholder="Enter 6 digits 2FA-Key" />
          </div>
        </template>
      </BasePopover>
    </div>
  </header>
</template>
