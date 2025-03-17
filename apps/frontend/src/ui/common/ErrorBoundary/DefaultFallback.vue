<script setup lang="ts">
import BaseButton from "@/ui/base/BaseButton.vue"

function reloadPage() {
  location.reload()
}
function goToHome() {
  location.href = "/"
}
</script>

<template>
  <section class="flex min-h-screen flex-col items-center justify-center">
    <div class="flex bg-primary-100 p-8 rounded-lg shadow-md flex-col items-center justify-center gap-4">
      <span class="text-5xl">😧</span>
      <h1 class="mb-2 text-xl font-semibold text-content">Oops! Something went wrong</h1>

      <div class="mb-8 text-center text-content/60">
        <p>We encountered an error on the page...</p>
        <p>Try refreshing the page or returning later.</p>
      </div>

      <div class="flex items-center justify-center gap-4">
        <BaseButton icon="arrow-left" class-icon="size-4" @click="goToHome"> Go main </BaseButton>
        <BaseButton icon="refresh" class-icon="size-4" variant="outline" class="px-4 py-2" @click="reloadPage"> Refresh page </BaseButton>
      </div>
    </div>
  </section>
</template>
