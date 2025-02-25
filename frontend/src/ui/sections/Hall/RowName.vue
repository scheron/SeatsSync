<script setup lang="ts">
import {getSeatRowChar} from "@/utils/hall"

import type {Seat} from "@/types/cinema"

defineProps<{
  rowIndex: number
  row: Seat[]
  hoveredSeat: {row: number; place: number} | null
  left?: boolean
}>()
</script>

<template>
  <span
    class="absolute text-sm transition-colors duration-200"
    :class="{
      'text-content font-bold': hoveredSeat?.row === row[0].row,
      'text-content/50': hoveredSeat?.row !== row[0].row,
    }"
    :style="{
      left: left ? '-30px' : 'auto',
      right: left ? 'auto' : '-30px',
      top: row[0].y + row[0].height / 2 + 'px',
      transform: 'translateY(-50%)',
    }"
  >
    {{ getSeatRowChar(rowIndex) }}
  </span>
</template>
