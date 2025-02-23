<script setup lang="ts">
import {onBeforeMount, onUnmounted, ref, watch} from "vue"
import BaseButton from "@/ui/common/base/BaseButton.vue"
import BasePopover from "@/ui/common/base/BasePopover.vue"
import Logo from "@/ui/common/Logo.vue"
import AuthForm from "@/ui/features/auth"
import {useHttp} from "@/composables/useHttp"
import {useWebSocket} from "@/composables/useWebSocket"
import {useCinemaStore} from "@/stores/cinema/cinema.store"
import {useThemeStore} from "@/stores/theme"

import type {Cinema} from "@/types/cinema"

const cinemaStore = useCinemaStore()
const themeStore = useThemeStore()

const isUserLoggedIn = ref(false)
const cinemas = ref<Cinema[]>([])
const activeCinema = ref<number | null>(null)

const {subscribe} = useWebSocket()
const request = useHttp()

const cleanUserSub = subscribe<{status: "user" | "guest"}, null>({
  msg: {type: "user.subscribe", data: null, eid: "1234"},
  onResult: ({data}) => {
    isUserLoggedIn.value = data.status === "user"
  },
})

subscribe<Cinema[], null>({
  msg: {type: "cinema.get_cinemas", data: null},
  isOnce: true,
  onResult: ({data}) => {
    cinemas.value = data
    activeCinema.value = data[0].id
  },
})

onUnmounted(() => {
  cleanUserSub()
})

function onLogout() {
  request({method: "POST", url: "user.logout"})
}

watch(activeCinema, (newCinema) => {
  const cinema = cinemas.value.find((cinema) => cinema.id === newCinema)
  if (cinema) {
    themeStore.setPrimaryColor(cinema.color)
    cinemaStore.cinema = cinema
    cinemaStore.onSelectHall(cinema.halls[0])
  }
})
</script>

<template>
  <header class="bg-primary-100 relative flex items-center justify-between rounded-lg p-4 shadow-md">
    <div>
      <BaseButton icon="map-pin" class="text-lg"></BaseButton>
      <select v-model="activeCinema" class="bg-primary-100 border-primary-400 rounded-lg border p-2">
        <option value="" disabled selected>Select cinema</option>
        <option v-for="cinema in cinemas" :key="cinema.id" :value="cinema.id">{{ cinema.name }}</option>
      </select>
    </div>

    <Logo class="absolute-center" />

    <div class="flex items-center gap-2">
      <BaseButton :icon="themeStore.isDarkMode ? 'sun' : 'moon'" @click="themeStore.toggleDarkMode" />

      <BaseButton v-if="isUserLoggedIn" icon="enter" class="flex-row-reverse text-lg" @click="onLogout">Logout</BaseButton>

      <BasePopover v-else>
        <template #trigger="{show}">
          <BaseButton icon="enter" class="flex-row-reverse text-lg" @click="show">Login</BaseButton>
        </template>

        <template #content>
          <div class="border-primary-400 bg-primary-100 flex flex-col rounded-lg border shadow-lg">
            <AuthForm />
          </div>
        </template>
      </BasePopover>
    </div>
  </header>
</template>
