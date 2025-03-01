<script setup lang="ts">
import {tryOnBeforeUnmount} from "@vueuse/core"
import {wsClient} from "@/api/ws"
import {toast, ToastsLiteProvider} from "@/lib/toasts-lite"
import BaseCard from "@/ui/base/BaseCard.vue"
import AppLayout from "@/ui/layouts/AppLayout.vue"
import Booking from "@/ui/sections/Booking/Booking.vue"
import Hall from "@/ui/sections/Hall"
import HallList from "@/ui/sections/HallList/HallList.vue"
import Header from "@/ui/sections/Header.vue"
import {useCinemaStore} from "./stores/cinema/cinema.store"

const cinemaStore = useCinemaStore()
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

    <template #left>
      <BaseCard class="flex-1">
        <Hall />
      </BaseCard>
      <BaseCard class="h-1/4">
        <Booking />
      </BaseCard>
    </template>

    <template #right>
      <BaseCard class="">
        <HallList />
      </BaseCard>
    </template>
  </AppLayout>

  <ToastsLiteProvider />
</template>
