<script setup lang="ts">
import {tryOnBeforeUnmount} from "@vueuse/core"
import {wsClient} from "@/api/ws"
import {ModalsLiteContainer} from "@/lib/modals-lite"
import {ToastsLiteProvider} from "@/lib/toasts-lite"
import {useWebsocketConnected} from "@/composables/useWebsocketConnected"
import {useThemeStore} from "@/stores/theme"
import {useUIStore} from "@/stores/ui"
import {useUserStore} from "@/stores/user"
import ErrorBoundary from "@/ui/common/ErrorBoundary"
import PageLoader from "@/ui/common/PageLoader.vue"
import Header from "@/ui/sections/Header.vue"

const uiStore = useUIStore()

useUserStore()
useThemeStore()
useWebsocketConnected()

tryOnBeforeUnmount(() => wsClient.destroy())
</script>

<template>
  <div class="bg-primary-200 text-content flex h-svh w-screen flex-col overflow-hidden">
    <PageLoader v-if="uiStore.isLoadingPage" />

    <header v-if="uiStore.isShowHeader" v-show="!uiStore.isLoadingPage" class="h-page-header shadow-md">
      <Header />
    </header>

    <main v-show="!uiStore.isLoadingPage" class="h-page-body overflow-hidden">
      <ErrorBoundary stop-propagation>
        <RouterView />
      </ErrorBoundary>
    </main>
  </div>

  <ToastsLiteProvider />
  <ModalsLiteContainer />
</template>
