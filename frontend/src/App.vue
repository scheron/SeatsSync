<script setup lang="ts">
import {onUnmounted, ref} from "vue"
import {tryOnBeforeUnmount} from "@vueuse/core"
import {useSubscription} from "@/composables/useSubscription"
import AppLayout from "@/ui/common/AppLayout.vue"
import BaseCard from "@/ui/common/base/BaseCard.vue"
import AuthForm from "@/ui/features/auth"
import Header from "@/ui/sections/Header.vue"
import {useToasts} from "./composables/useToasts"
import {wsClient} from "./modules/ws"

const toast = useToasts()

const {onError, onConnectionStateChange} = useSubscription("*")
const isConnecting = ref(false)
const id = 2

wsClient.on("user.subscribe").subscribe({
  next: (message) => {
    console.log("Received message:", message)
  },
  error: (error) => {
    console.log("Error in subscription:", error)
  },
})

onConnectionStateChange((state, prevState) => {
  // console.log("CONNECTION STATE", state, prevState)

  if (state === "RECONNECTING") {
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

  if (state === "CONNECTED") {
    wsClient.send({type: "user.subscribe", data: {}, eid: "123"})
  }
})

onError((value) => {
  if (!value) return
  console.log("error", value)
  toast.error(value)
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
        <AuthForm />
      </BaseCard>
    </template>
  </AppLayout>
</template>
