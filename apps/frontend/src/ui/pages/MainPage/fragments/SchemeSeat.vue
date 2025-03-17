<script setup lang="ts">
import {computed, toRef} from "vue"
import {cn} from "@/utils/tailwindcss"
import BaseIcon from "@/ui/base/BaseIcon.vue"
import {useSeatTooltip} from "@/ui/popovers/tooltips/SeatTooltip"

import type {Seat} from "@seats-sync/types/cinema"

const props = defineProps<{seat: Seat; hovered?: boolean}>()
const {seatRef} = useSeatTooltip(toRef(props, "hovered"), toRef(props, "seat"))

const styles = computed(() => ({
  width: props.seat.width + "px",
  height: props.seat.height + "px",
  left: props.seat.x + "px",
  top: props.seat.y + "px",
}))

const classes = computed(() => {
  return cn({
    "bg-primary-700/50 cursor-pointer": props.seat.status === "VACANT",
    "bg-primary-300/50 cursor-default": props.seat.status === "RESERVED",
    "bg-primary-600": props.seat.status === "VACANT" && props.hovered,
  })
})
</script>

<template>
  <div ref="seatRef" class="border-accent/20 absolute flex items-center justify-center rounded-md border" :style="styles" :class="classes">
    <span
      v-if="seat.status === 'VACANT'"
      class="text-content pointer-events-none flex cursor-default items-center justify-center transition-opacity duration-200 select-none"
      :class="[hovered ? 'opacity-100' : 'opacity-0']"
    >
      {{ seat.place }}
    </span>

    <BaseIcon v-if="seat.status === 'RESERVED'" name="close" class="text-primary-700 size-4" />
  </div>
</template>
