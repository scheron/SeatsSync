<script setup lang="ts">
import {watch} from "vue"
import {useObservable} from "@vueuse/rxjs"
import {useSubscription} from "@/composables/useSubscription"
import AppLayout from "@/ui/common/AppLayout.vue"
import BaseCard from "@/ui/common/base/BaseCard.vue"
import AuthForm from "@/ui/features/auth"
import Header from "@/ui/sections/Header.vue"
import {useToasts} from "./composables/useToasts"
import {wsClient} from "./modules/ws"

const toast = useToasts()

const {onError, onStateChange} = useSubscription("*")

onStateChange((state) => {
  console.log("state", state)
  if (state === "connected") toast.success("Connected")
})

onError((value) => {
  if (!value) return
  toast.error(value)
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
