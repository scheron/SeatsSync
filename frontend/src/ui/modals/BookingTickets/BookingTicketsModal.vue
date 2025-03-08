<script setup lang="ts">
import {useDevice} from "@/composables/useDevice"
import {useCinemaStore} from "@/stores/cinema/cinema.store"
import BaseButton from "@/ui/base/BaseButton.vue"
import BaseModal from "@/ui/base/BaseModal"
import BookingConfirmation from "./BookingConfirmation.vue"

import type {Seat} from "@/types/cinema"

const {isMobile} = useDevice()
const cinemaStore = useCinemaStore()

const emit = defineEmits<{success: [void]; error: [void]; cancel: [void]}>()
defineProps<{seats: Seat[]}>()
</script>

<template>
  <BaseModal
    class-container="relative flex flex-col max-w-96 size-full"
    class-content="p-6  bg-primary-200"
    class-overlay="px-12 py-8 rounded-lg"
    :fullscreen="isMobile"
  >
    <div class="relative mb-4 flex w-full items-center justify-between">
      <h3 class="text-content mt-2 text-xl font-semibold">Booking Confirmation</h3>
      <BaseButton
        icon="close"
        class-icon="size-5"
        class="hover:bg-primary-200 absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 rounded-full"
        @click="emit('cancel')"
      />
    </div>

    <div class="flex flex-1">
      <BookingConfirmation
        v-if="cinemaStore.activeHall && cinemaStore.activeCinema"
        :seats="seats"
        :hall="cinemaStore.activeHall"
        :cinema="cinemaStore.activeCinema"
      />
      <div v-else class="flex flex-1 items-center justify-center">Select a hall first</div>
    </div>
  </BaseModal>
</template>
