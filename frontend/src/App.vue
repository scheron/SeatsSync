<script setup lang="ts">
import {tryOnBeforeUnmount} from "@vueuse/core"
import AppLayout from "@/ui/common/AppLayout.vue"
import BaseCard from "@/ui/common/base/BaseCard.vue"
import Header from "@/ui/sections/Header.vue"
import {wsClient} from "@/modules/ws"
import {toast, ToastsLiteProvider} from "@/shared/lib/toasts-lite"

let toastID: string | undefined

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

    <template #start>
      <BaseCard class="h-1/5"> Left Top Content </BaseCard>
      <BaseCard class="flex-1"> Left Center Content </BaseCard>
    </template>

    <template #middle>
      <BaseCard class="flex-1">Center Main Content</BaseCard>
      <BaseCard class="h-1/4">Center Bottom Section</BaseCard>
    </template>

    <template #end>
      <BaseCard> Right Main Content </BaseCard>
    </template>
  </AppLayout>

  <ToastsLiteProvider />
</template>
