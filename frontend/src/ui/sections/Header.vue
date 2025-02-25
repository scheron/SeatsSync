<script setup lang="ts">
import {onMounted, onUnmounted, ref, watch} from "vue"
import {useHttp} from "@/composables/useHttp"
import {useWebSocket} from "@/composables/useWebSocket"
import {useCinemaStore} from "@/stores/cinema/cinema.store"
import {useThemeStore} from "@/stores/theme"
import BaseButton from "@/ui/base/BaseButton.vue"
import BasePopover from "@/ui/base/BasePopover.vue"
import Logo from "@/ui/common/Logo.vue"
import AuthForm from "@/ui/features/auth"
import BaseSelect from "../base/BaseSelect.vue"

import type {Cinema} from "@/types/cinema"

const cinemaStore = useCinemaStore()
const themeStore = useThemeStore()

const isUserLoggedIn = ref(false)
const cinemas = ref<Cinema[]>([])

const {subscribe} = useWebSocket()
const request = useHttp()

const cleanUserSub = subscribe<{status: "user" | "guest"}, null>({
  msg: {type: "user.subscribe", data: null, eid: "1234"},
  onResult: ({data}) => {
    isUserLoggedIn.value = data.status === "user"
  },
})

onUnmounted(() => {
  cleanUserSub()
})

function onLogout() {
  request({method: "POST", url: "user.logout"})
}

onMounted(() => {
  cinemaStore.fetchCinemas()
})
</script>

<template>
  <header class="bg-primary-100 relative flex items-center justify-between rounded-lg p-4 shadow-md">
    <div>
      <BaseButton icon="map-pin" class="text-lg"></BaseButton>
      <!-- <BaseSelect v-model="cinemaStore.activeCinema" option-value="id" option-label="name" :options="cinemas" /> -->
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
