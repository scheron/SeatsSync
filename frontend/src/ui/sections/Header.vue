<script setup lang="ts">
import {ref} from "vue"
import {useRequest} from "@/composables/useRequest"
import {useSubscription} from "@/composables/useSubscription"
import {useThemeStore} from "@/stores/theme"
import BaseButton from "@/ui/common/base/BaseButton.vue"
import BasePopover from "@/ui/common/base/BasePopover.vue"
import Logo from "@/ui/common/Logo.vue"
import AuthForm from "@/ui/features/auth"

const cinema = "CGV Pearl Plaza"
const themeStore = useThemeStore()

const isUserLoggedIn = ref(false)
const {onSnapshot, onUpdate} = useSubscription<{status: "guest" | "user"}>("user.subscribe")
const request = useRequest()

onSnapshot(({status}) => {
  console.log("SNAPSHOT", status)
  if (status === "user") {
    isUserLoggedIn.value = true
  }
})

onUpdate(({status}) => {
  console.log("UPDATE", status)
  if (status === "user") {
    isUserLoggedIn.value = true
  } else {
    isUserLoggedIn.value = false
  }
})

function onLogout() {
  request({
    method: "POST",
    url: "user.logout",
  })
}
</script>

<template>
  <header class="relative flex items-center justify-between rounded-lg bg-primary-100 p-4 shadow-md">
    <div>
      <BaseButton icon="map-pin" class="text-lg">{{ cinema }}</BaseButton>
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
          <div class="flex flex-col rounded-lg border border-primary-400 bg-primary-100 shadow-lg">
            <AuthForm />
          </div>
        </template>
      </BasePopover>
    </div>
  </header>
</template>
