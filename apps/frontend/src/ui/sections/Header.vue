<script setup lang="ts">
import {ROUTE_NAMES} from "@/router/routes"
import {useCinemaStore} from "@/stores/cinema/cinema.store"
import {useThemeStore} from "@/stores/theme"
import {useUserStore} from "@/stores/user"
import BaseButton from "@/ui/base/BaseButton.vue"
import BaseSelect from "@/ui/base/BaseSelect.vue"
import Logo from "@/ui/common/Logo.vue"

const themeStore = useThemeStore()
const userStore = useUserStore()
const cinemaStore = useCinemaStore()
</script>

<template>
  <header class="h-page-header">
    <div class="bg-primary-100 relative flex h-full items-center justify-between">
      <BaseButton :icon="themeStore.isDarkMode ? 'sun' : 'moon'" @click="themeStore.toggleDarkMode" />

      <BaseSelect
        v-if="cinemaStore.activeCinema"
        :options="cinemaStore.cinemas"
        :model-value="cinemaStore.activeCinema"
        @update:model-value="cinemaStore.onSelectCinema"
      />

      <RouterLink :to="{name: ROUTE_NAMES.MAIN}">
        <Logo class="absolute-center" />
      </RouterLink>

      <BaseButton v-if="userStore.isLoggedIn" icon="enter" class="flex-row-reverse text-lg" @click="userStore.logout">Logout</BaseButton>
    </div>
  </header>
</template>
