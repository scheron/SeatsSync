<script setup lang="ts">
import {computed} from "vue"
import {getSeatRowChar} from "@/utils/hall"
import BaseIcon from "@/ui/base/BaseIcon.vue"

import type {Seat} from "@/types/cinema"

const props = defineProps<{
  seat: Seat | null
}>()

const seatInfo = computed(() => {
  if (!props.seat) return null

  return {
    row: getSeatRowChar(props.seat.row),
    place: props.seat.place,
    status: props.seat.status,
    type: props.seat.seat_type,
    price: props.seat.seat_type.price,
  }
})

const statusClass = computed(() => {
  if (!props.seat) return ""

  return {
    "text-green-500": props.seat.status === "free",
    "text-content/40": props.seat.status === "occupied",
  }
})
</script>

<template>
  <div v-if="seat" class="bg-primary-100 dark:bg-primary-800 border-primary-300 dark:border-primary-700 min-w-40 rounded-md border p-3 shadow-md">
    <div class="flex flex-col gap-1.5">
      <div class="border-content/60 flex items-center justify-between gap-2 border-b pb-2">
        <span class="text-content/70 flex items-center justify-center gap-1">
          <BaseIcon name="chair" class="size-4" />
          Seat
        </span>
        <h3 class="text-primary-700 font-bold">{{ seatInfo?.row }}{{ seatInfo?.place }}</h3>
      </div>

      <div class="flex items-center justify-between gap-4 text-sm">
        <span class="text-content/70">Status:</span>
        <span :class="statusClass" class="font-medium capitalize">{{ seatInfo?.status }}</span>
      </div>

      <div class="flex items-center justify-between text-sm">
        <span class="text-content/70">Type:</span>
        <span class="text-content font-medium capitalize">{{ seatInfo?.type.name }}</span>
      </div>

      <div class="flex items-center justify-between text-sm">
        <span class="text-content/70">Price:</span>
        <span class="text-content font-medium">${{ seatInfo?.price }}</span>
      </div>
    </div>
  </div>
</template>
