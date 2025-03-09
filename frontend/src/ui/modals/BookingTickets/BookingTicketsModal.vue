<script setup lang="ts">
import {useDevice} from "@/composables/useDevice"
import {useCinemaStore} from "@/stores/cinema/cinema.store"
import BaseButton from "@/ui/base/BaseButton.vue"
import BaseModal from "@/ui/base/BaseModal"
import BookingInfo from "./fragments/BookingInfo.vue"

const {isMobile} = useDevice()
const cinemaStore = useCinemaStore()

const emit = defineEmits<{confirm: [void]; cancel: [void]}>()

function onCancel() {
  emit("cancel")
}

function onPurchase() {
  emit("confirm")
}
</script>

<template>
  <BaseModal
    class-container="relative flex flex-col max-w-[350px] size-full"
    class-content="p-6  bg-primary-200"
    class-overlay="px-12 py-8 rounded-lg"
    :fullscreen="isMobile"
  >
    <div class="relative mb-4 flex w-full items-center justify-between">
      <h3 class="text-content mt-2 text-xl font-semibold">Booking Confirmation</h3>
      <BaseButton
        icon="close"
        class-icon="size-5 p-0"
        class="hover:bg-primary-200 absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 rounded-full p-1"
        @click="emit('cancel')"
      />
    </div>

    <template v-if="cinemaStore.activeHall && cinemaStore.activeCinema">
      <BookingInfo :seats="cinemaStore.selectedSeats" :hall="cinemaStore.activeHall" :cinema="cinemaStore.activeCinema" />

      <div class="flex w-full items-center justify-between gap-2">
        <BaseButton variant="outline" icon="minus-circle" class="w-1/3" size="sm" @click="onCancel"> Cancel </BaseButton>
        <BaseButton variant="accent" icon="ticket" class="w-2/3" size="sm" @click="onPurchase">Purchase</BaseButton>
      </div>
    </template>

    <div v-else class="flex flex-1 items-center justify-center">Select a hall first</div>
  </BaseModal>
</template>
