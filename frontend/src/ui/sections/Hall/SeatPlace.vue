<script setup lang="ts">
import {cn} from "@/utils/tailwindcss"

import type {Seat} from "@/types/cinema"

defineProps<{
  seat: Seat
  hovered?: boolean
  selected?: boolean
}>()
</script>

<template>
  <div
    class="border-accent/20 absolute flex items-center justify-center rounded-md border"
    :style="{
      width: seat.width + 'px',
      height: seat.height + 'px',
      left: seat.x + 'px',
      top: seat.y + 'px',
    }"
    :class="
      cn({
        'bg-primary-700/50': seat.status === 'free',
        'bg-primary-300/50': seat.status === 'occupied',
        'bg-primary-700': selected,
      })
    "
    data-seat
    :data-row="seat.row"
    :data-place="seat.place"
    :data-seat-id="seat.id"
    :data-status="seat.status"
  >
    <span
      v-if="seat.status === 'free'"
      class="text-content pointer-events-none flex cursor-default items-center justify-center transition-opacity duration-200"
      :class="{
        'opacity-100': hovered || selected,
        'opacity-0': !hovered,
      }"
    >
      {{ seat.place }}
    </span>
  </div>
</template>
