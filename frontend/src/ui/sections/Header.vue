<script setup lang="ts">
import {onUnmounted, ref} from "vue"
import {useRequest} from "@/composables/useRequest"
import {useWebSocket} from "@/composables/useWebSocket"
import {useThemeStore} from "@/stores/theme"
import BaseButton from "@/ui/common/base/BaseButton.vue"
import BasePopover from "@/ui/common/base/BasePopover.vue"
import Logo from "@/ui/common/Logo.vue"
import AuthForm from "@/ui/features/auth"
import {Subscription} from "@/modules/ws"

const cinema = "CGV Pearl Plaza"
const themeStore = useThemeStore()

const isUserLoggedIn = ref(false)
const {subscribe} = useWebSocket()
const request = useRequest()

const unsubscribe = subscribe<{status: "user" | "guest"}, null>({
  msg: {type: "user.subscribe", data: null, eid: "1234"},
  onResult: ({data}) => {
    isUserLoggedIn.value = data.status === "user"
  },
})

onUnmounted(() => unsubscribe())

// subscribe<{status: "user" | "guest"}>({
//   msg: {
//     type: "user.subscribe",
//     data: {},
//     eid: "1234",
//   },
//   onSnapshot: (data) => {
//     isUserLoggedIn.value = data.status === "user"
//   },
//   onUpdate: (data) => {
//     isUserLoggedIn.value = data.status === "user"
//   },
// })

// onSnapshot(({status}) => {
//   console.log("SNAPSHOT", status)
//   if (status === "user") {
//     isUserLoggedIn.value = true
//   }
// })

// onUpdate(({status}) => {
//   console.log("UPDATE", status)
//   if (status !== undefined) {
//     wsClient.reconnect()

//     if (status === "user") {
//       isUserLoggedIn.value = true
//     } else {
//       isUserLoggedIn.value = false
//     }
//   }
// })

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
      <BaseButton icon="map-pin" class="text-lg" @click="() => subscription.unsubscribe()">{{ cinema }}</BaseButton>
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
