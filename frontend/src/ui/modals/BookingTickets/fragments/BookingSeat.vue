<script setup lang="ts">
import {computed} from "vue"
import {getSeatRowChar} from "@/utils/hall"
import {SEAT_TYPES} from "@/constants/icons"
import BaseIcon from "@/ui/base/BaseIcon.vue"

import type {Seat} from "@/types/cinema"

const props = defineProps<{
  seat: Seat
}>()

const isFree = computed(() => props.seat.status === "free")
</script>

<template>
  <div
    class="flex items-center gap-2 rounded-lg border px-2 py-1 shadow-sm select-none"
    :class="[isFree ? 'bg-primary-300 border-primary-400' : 'bg-content/10 border-content/10']"
  >
    <div class="flex items-center gap-2" :class="[isFree ? 'text-accent' : 'text-content/40']">
      <BaseIcon :name="SEAT_TYPES[seat.seat_type.name]" class="size-4" />
      <span class="font-bold">{{ getSeatRowChar(seat.row) }}{{ seat.place }}</span>
    </div>

    <span class="text-content/50"> &mdash; </span>

    <div class="flex items-center gap-2" :class="[isFree ? 'text-content' : 'text-content/40']">
      <BaseIcon name="cash" class="size-4" />
      <span>${{ seat.seat_type.price }}</span>
    </div>
  </div>
</template>
