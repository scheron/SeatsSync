<script setup lang="ts">
import {ref} from "vue"
import {useSubscription} from "@/composables/useSubscription"
import AppLayout from "@/ui/common/AppLayout.vue"
import BaseCard from "@/ui/common/base/BaseCard.vue"
import AuthForm from "@/ui/features/auth"
import Header from "@/ui/sections/Header.vue"
import {useToasts} from "./composables/useToasts"

const toast = useToasts()

const {onError, onStateChange} = useSubscription("*")
const isConnecting = ref(false)
const id = 2

onStateChange((state, prevState) => {
  if (state === "connecting" && prevState === "connected") {
    toast.info("Connecting...", {toastId: id, autoClose: false, isLoading: isConnecting.value})
    return
  }

  // console.log("state", state, prevState)
  // if (state === "connected" && prevState === "connecting") {
  //   toast.hideToast(id)
  //   toast.success("Connected")
  //   isConnecting.value = false
  //   return
  // }

  if (state === "disconnected" && prevState === "connecting") {
    toast.hideToast(id)
    toast.error("Connection failed")
    isConnecting.value = false
  }
})

onError((value) => {
  if (!value) return
  console.log("error", value)
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
