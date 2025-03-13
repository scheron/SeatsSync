<script setup lang="ts">
import {useThemeStore} from "@/stores/theme"
import {useUserStore} from "@/stores/user"
import BaseButton from "@/ui/base/BaseButton.vue"
import Logo from "@/ui/common/Logo.vue"

const themeStore = useThemeStore()
const userStore = useUserStore()
</script>

<template>
  <header class="h-page-header">
    <div class="bg-primary-100 relative flex h-full items-center justify-between rounded-b-lg shadow-md">
      <BaseButton :icon="themeStore.isDarkMode ? 'sun' : 'moon'" @click="themeStore.toggleDarkMode" />

      <Logo class="absolute-center" />

      <BaseButton v-if="userStore.isLoggedIn" icon="enter" class="flex-row-reverse text-lg" @click="userStore.logout">Logout</BaseButton>
    </div>
  </header>
</template>
