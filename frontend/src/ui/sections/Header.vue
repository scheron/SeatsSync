<script setup lang="ts">
import {onUnmounted, ref} from "vue"
import {useHttp} from "@/composables/useHttp"
import {useWebSocket} from "@/composables/useWebSocket"
import {useThemeStore} from "@/stores/theme"
import BaseButton from "@/ui/base/BaseButton.vue"
import BasePopover from "@/ui/base/BasePopover.vue"
import Logo from "@/ui/common/Logo.vue"
import AuthForm from "@/ui/features/auth"

const themeStore = useThemeStore()

const isUserLoggedIn = ref(false)

const {subscribe, cleanup} = useWebSocket()
const {request} = useHttp()

subscribe<{status: "user" | "guest"}, null>({
  msg: {type: "user.subscribe", data: null},
  onResult: ({data}) => {
    isUserLoggedIn.value = data.status === "user"
  },
})

onUnmounted(cleanup)

function onLogout() {
  request({method: "POST", url: "user.logout"})
}
</script>

<template>
  <header class="bg-primary-100 relative flex items-center justify-between rounded-lg p-4 shadow-md">
    <BaseButton :icon="themeStore.isDarkMode ? 'sun' : 'moon'" @click="themeStore.toggleDarkMode" />

    <Logo class="absolute-center" />

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
  </header>
</template>
