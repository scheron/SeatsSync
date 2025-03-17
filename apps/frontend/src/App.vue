<script setup lang="ts">
import {tryOnBeforeUnmount} from "@vueuse/core"
import {wsClient} from "@/api/ws"
import {ModalsLiteContainer} from "@/lib/modals-lite"
import {ToastsLiteProvider} from "@/lib/toasts-lite"
import {useWebsocketConnected} from "@/composables/useWebsocketConnected"
import Header from "@/ui/sections/Header.vue"

useWebsocketConnected()

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
