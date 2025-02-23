<script setup lang="ts">
import {tryOnBeforeUnmount} from "@vueuse/core"
import AppLayout from "@/ui/common/AppLayout.vue"
import BaseCard from "@/ui/common/base/BaseCard.vue"
import Booking from "@/ui/sections/Booking/Booking.vue"
import Hall from "@/ui/sections/Hall"
import Header from "@/ui/sections/Header.vue"
import {wsClient} from "@/modules/ws"
import {toast, ToastsLiteProvider} from "@/shared/lib/toasts-lite"

let toastID: string

wsClient.connectionState.subscribe(({state, prevState}) => {
  if (state === "RECONNECTING") toastID = toast.loading("Connecting...", {id: toastID, autoClose: false})
  else if (state === "CONNECTED" && prevState === "RECONNECTING") toast.success("Connected", {id: toastID, autoClose: true})
  else if (state === "DISCONNECTED" && prevState === "RECONNECTING") toast.error("Connection failed", {id: toastID, autoClose: true})
})

wsClient.on("*", "error").subscribe(({error}) => {
  if (!error) return
  toast.error(error)
})

tryOnBeforeUnmount(() => wsClient.destroy())
</script>

<template>
  <AppLayout>
    <template #header>
      <Header />
    </template>

    <template #middle>
      <BaseCard class="flex-1">
        <Hall />
      </BaseCard>
      <BaseCard class="h-1/4">
        <Booking />
      </BaseCard>
    </template>
  </AppLayout>

  <ToastsLiteProvider />
</template>
