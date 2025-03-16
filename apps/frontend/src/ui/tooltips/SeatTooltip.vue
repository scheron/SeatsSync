<script setup lang="ts">
import {computed, ref} from "vue"
import {getSeatRowChar} from "@/utils/hall"
import {SEAT_TYPES} from "@/constants/icons"
import BaseIcon from "@/ui/base/BaseIcon.vue"
import BaseTransitions from "@/ui/base/BaseTransitions.vue"

import type {Seat} from "@seats-sync/types/cinema"

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
    icon: SEAT_TYPES[props.seat.seat_type.name],
  }
})

const statusClass = computed(() => {
  if (!props.seat) return ""

  return {
    "text-accent": props.seat.status === "VACANT",
    "text-content/40": props.seat.status === "RESERVED",
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
        <div
          class="bg-primary-200/50 flex items-center justify-between gap-2 border-primary-300 min-w-40 rounded-md border p-3 shadow-md"
          :class="statusClass"
        >
          <span class="font-medium capitalize">{{ seatInfo?.status }}</span>

          <div class="flex items-center gap-1">
            <h3 class="font-bold">{{ seatInfo?.row }}{{ seatInfo?.place }}</h3>
            <BaseIcon :name="seatInfo?.icon!" class="size-4" />
          </div>
        </div>
      </div>
    </BaseTransitions>
  </Teleport>
</template>
