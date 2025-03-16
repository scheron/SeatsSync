<script setup lang="ts">
import {tryOnBeforeUnmount} from "@vueuse/core"
import {wsClient} from "@/api/ws"
import {ModalsLiteContainer} from "@/lib/modals-lite"
import {toast, ToastsLiteProvider} from "@/lib/toasts-lite"
import Header from "@/ui/sections/Header.vue"

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
  <div class="bg-primary-200 text-content flex h-svh w-screen flex-col overflow-hidden">
    <header class="h-page-header shadow-md">
      <Header />
    </header>

    <main class="h-page-body overflow-hidden">
      <RouterView />
    </main>
  </div>

  <ToastsLiteProvider />
  <ModalsLiteContainer />
</template>
