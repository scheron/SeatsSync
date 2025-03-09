<script setup lang="ts">
import {computed, ref} from "vue"
import {getSeatRowChar} from "@/utils/hall"
import {SEAT_TYPES} from "@/constants/icons"
import BaseIcon from "@/ui/base/BaseIcon.vue"
import BaseTransitions from "@/ui/base/BaseTransitions.vue"

import type {Seat} from "@/types/cinema"

const props = defineProps<{
  tooltipVisible: boolean
  seat: Seat | null
}>()

const tooltipContainer = ref<HTMLElement | null>(null)

const seatInfo = computed(() => {
  if (!props.seat) return null

  return {
    row: getSeatRowChar(props.seat.row),
    place: props.seat.place,
    status: props.seat.status,
    type: props.seat.seat_type,
    price: props.seat.seat_type.price,
    icon: SEAT_TYPES[props.seat.seat_type.name],
  }
})

const statusClass = computed(() => {
  if (!props.seat) return ""

  return {
    "text-green-500": props.seat.status === "free",
    "text-content/40": props.seat.status === "occupied",
  }
})

defineExpose({
  tooltipContainer,
})
</script>

<template>
  <Teleport to="body">
    <BaseTransitions name="fade" mode="out-in">
      <div
        v-if="tooltipVisible && seat"
        ref="tooltipContainer"
        class="pointer-events-none fixed rounded-md backdrop-blur-md"
        style="z-index: 9999; will-change: transform"
      >
        <div class="bg-primary-200/50 border-primary-300 min-w-40 rounded-md border p-3 shadow-md">
          <div class="flex flex-col gap-1.5">
            <div class="border-content/60 flex items-center justify-between gap-2 border-b pb-2">
              <span class="text-content/60 flex items-center justify-center gap-1">
                <BaseIcon :name="seatInfo?.icon!" class="text-accent size-4" />

                Seat
              </span>
              <h3 class="text-accent font-bold">{{ seatInfo?.row }}{{ seatInfo?.place }}</h3>
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
      </div>
    </BaseTransitions>
  </Teleport>
</template>
