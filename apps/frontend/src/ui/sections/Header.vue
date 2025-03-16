<script setup lang="ts">
import {ROUTE_NAMES} from "@/router/routes"
import {useThemeStore} from "@/stores/theme"
import {useUserStore} from "@/stores/user"
import BaseButton from "@/ui/base/BaseButton.vue"
import Logo from "@/ui/common/Logo.vue"

const themeStore = useThemeStore()
const userStore = useUserStore()
</script>

<template>
  <div class="bg-primary-100 relative text-content p-1 h-auto w-full flex items-center justify-between">
    <BaseButton :icon="themeStore.isDarkMode ? 'sun' : 'moon'" @click="themeStore.toggleDarkMode" />

    <RouterLink :to="{name: ROUTE_NAMES.MAIN}">
      <Logo class="absolute-center" />
    </RouterLink>

    <BaseButton v-if="userStore.isLoggedIn" icon="enter" class="flex-row-reverse text-lg" @click="userStore.logout">Logout</BaseButton>
  </div>
</template>
