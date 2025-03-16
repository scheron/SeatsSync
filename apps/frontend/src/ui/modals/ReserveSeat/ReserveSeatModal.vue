<script setup lang="ts">
import {computed} from "vue"
import {getSeatRowChar} from "@/utils/hall"
import {SEAT_TYPES} from "@/constants/icons"
import {useDevice} from "@/composables/useDevice"
import {useWebSocket} from "@/composables/useWebSocket"
import BaseButton from "@/ui/base/BaseButton.vue"
import BaseIcon from "@/ui/base/BaseIcon.vue"
import BaseModal from "@/ui/base/BaseModal"
import QRCode from "@/ui/common/QRCode.vue"

import type {Seat} from "@seats-sync/types/cinema"

const {isMobile} = useDevice()
const {send} = useWebSocket()

const props = defineProps<{hallId: number; seat: Seat}>()
const emit = defineEmits<{confirm: [void]; cancel: [void]}>()

const seatInfo = computed(() => {
  if (!props.seat) return null

  return {
    row: getSeatRowChar(props.seat.row),
    place: props.seat.place,
    status: props.seat.status,
    type: props.seat.seat_type,
    icon: SEAT_TYPES[props.seat.seat_type.name],
  }
})

const statusClass = computed(() => {
  if (!props.seat) return ""

  return {
    "text-green-500": props.seat.status === "VACANT",
    "text-content/40": props.seat.status === "RESERVED",
  }
})

function onCancel() {
  emit("cancel")
}

function onPurchase() {
  send({
    type: "hall.update_seat_status",
    data: {
      hall_id: props.hallId,
      seat_id: props.seat.id,
      status: "RESERVED",
    },
  })
  emit("confirm")
}
</script>

<template>
  <BaseModal
    class-container=" flex flex-col max-w-[400px] size-fit"
    class-content="relative px-3 pb-3 pt-8 border border-primary-300"
    :fullscreen="isMobile"
  >
    <BaseButton icon="close" size="sm" class="absolute right-1 top-1 size-6 p-0" @click="onCancel" />

    <div class="flex flex-col gap-2 min-w-36">
      <div class="flex items-center justify-between gap-2">
        <span class="text-content/70 flex"> Seat </span>

        <div class="flex items-center gap-1">
          <h3 class="text-accent font-bold">{{ seatInfo?.row }}{{ seatInfo?.place }}</h3>
        </div>
      </div>

      <div class="flex items-center justify-between gap-4 text-sm">
        <span class="text-content/70">Status:</span>
        <span :class="statusClass" class="font-medium capitalize">{{ seatInfo?.status }}</span>
      </div>

      <div class="flex items-center justify-between text-sm">
        <span class="text-content/70">Type:</span>

        <div class="flex items-center gap-1">
          <span class="text-content font-medium capitalize">{{ seatInfo?.type.name }}</span>
          <BaseIcon :name="seatInfo?.icon!" class="size-4" />
        </div>
      </div>

      <template v-if="seat.status === 'VACANT'">
        <div class="my-4 flex items-center justify-center gap-4 text-sm">
          <QRCode :code="`Reservation: ${seatInfo?.row}${seatInfo?.place}?token=${1234}`" :size="140" />
        </div>

        <BaseButton v-focus-on-mount icon="ticket-filled" size="sm" variant="accent" class="w-full" @click="onPurchase"> Reserve </BaseButton>
      </template>
    </div>
  </BaseModal>
</template>
