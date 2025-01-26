<script setup lang="ts">
import {ref} from "vue"
import {tryOnBeforeUnmount} from "@vueuse/core"
import {useSubscription} from "@/composables/useSubscription"
import AppLayout from "@/ui/common/AppLayout.vue"
import BaseCard from "@/ui/common/base/BaseCard.vue"
import AuthForm from "@/ui/features/auth"
import Header from "@/ui/sections/Header.vue"
import {useToasts} from "./composables/useToasts"
import {wsClient} from "./modules/ws"

import type {UserStatus} from "@/types/user"

const toast = useToasts()

type User = {username?: string; status?: UserStatus}

const user = ref<User>({status: "guest"} as User)
const {onSnapshot, onUpdate} = useSubscription<User>("user.subscribe")

onSnapshot(({status, username}) => {
  user.value.status = status
  user.value.username = username
})

onUpdate(({username, status}) => {
  console.log("onUpdate", username, status)
  if (status !== user.value.status) wsClient.reconnect()

  user.value.username = username
  user.value.status = status
})

const isConnecting = ref(false)
const id = 2

wsClient.connectionState.subscribe(({state, prevState}) => {
  if (state === "RECONNECTING") {
    toast.hideToast(id)
    toast.info("Connecting...", {toastId: id, autoClose: false, isLoading: isConnecting.value})
    return
  }

  if (state === "CONNECTED" && prevState === "RECONNECTING") {
    toast.hideToast(id)
    toast.success("Connected")
    isConnecting.value = false

    return
  }

  if (state === "DISCONNECTED" && prevState === "RECONNECTING") {
    toast.hideToast(id)
    toast.error("Connection failed")
    isConnecting.value = false
  }
})

wsClient.on("*", "error").subscribe(({error}) => {
  if (!error) return
  console.log("error", error)
  toast.error(error)
})

tryOnBeforeUnmount(() => {
  wsClient.destroy()
})
</script>

<template>
  <AppLayout>
    <template #header>
      <Header />
    </template>

    <template #start>
      <BaseCard class="h-1/5">Left Top Section</BaseCard>
      <BaseCard class="flex-1">Left Main Content</BaseCard>
    </template>

    <template #middle>
      <BaseCard class="flex-1">Center Main Content</BaseCard>
      <BaseCard class="h-1/4">Center Bottom Section</BaseCard>
    </template>

    <template #end>
      <BaseCard>
        <AuthForm v-if="user.status === 'guest'" />
        <BaseCard v-else>
          <div>
            <span>User: {{ user.username }}</span>
          </div>
        </BaseCard>
      </BaseCard>
    </template>
  </AppLayout>
</template>
