<script setup lang="ts">
import {getSeatRowChar} from "@/utils/hall"
import {SEAT_TYPES} from "@/constants/icons"
import BaseButton from "@/ui/base/BaseButton.vue"
import BaseIcon from "@/ui/base/BaseIcon.vue"
import BasePanel from "@/ui/base/BasePanel.vue"
import {calcSeatTypeReservation} from "../helpers"

import type {Hall, Seat} from "@seats-sync/types/cinema"

withDefaults(defineProps<{name: string; seats: Seat[]; seatTypes: Hall["seat_types"]}>(), {
  seats: () => [],
})
const emit = defineEmits<{
  "select-seat": [Seat]
  "hover-seat": [Seat | null]
}>()

function onSelectSeat(seat: Seat) {
  emit("select-seat", seat)
}

function onHoverSeat(seat: Seat | null) {
  emit("hover-seat", seat)
}
</script>

<template>
  <BasePanel class="flex flex-col gap-2 w-full items-start">
    <div class="flex w-full items-center justify-between px-2 py-1 gap-2 flex-wrap">
      <span class="flex items-center gap-1">
        <BaseIcon :name="SEAT_TYPES[name]" class="size-4" />
        {{ name }}
      </span>

      <span class="flex items-center text-sm gap-1">
        {{ calcSeatTypeReservation(seatTypes || [], name) }}
        <BaseIcon name="ticket-filled" class="size-4" />
      </span>
    </div>

    <div class="flex w-full flex-wrap gap-1">
      <BaseButton
        v-for="seat in seats"
        :key="seat.id"
        class="relative"
        :icon="seat.status === 'RESERVED' ? 'ticket-filled' : 'ticket'"
        :disabled="seat.status === 'RESERVED'"
        size="sm"
        @click="onSelectSeat(seat)"
        @mouseenter="onHoverSeat(seat)"
        @mouseleave="onHoverSeat(null)"
      >
        {{ getSeatRowChar(seat.row) }}{{ seat.place }}

        <template v-if="seat.status === 'RESERVED'">
          <div class="absolute w-full h-px bg-content/70 rotate-12"></div>
          <div class="absolute w-full h-px bg-content/70 -rotate-12"></div>
        </template>
      </BaseButton>
    </div>
  </BasePanel>
</template>
