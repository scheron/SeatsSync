<script setup lang="ts">
import {getSeatRowChar} from "@/utils/hall"
import BaseButton from "@/ui/base/BaseButton.vue"

import type {Seat} from "@seats-sync/types/cinema"

defineProps<{seat: Seat}>()
</script>

<template>
  <BaseButton class="relative" :icon="seat.status === 'RESERVED' ? 'ticket-filled' : 'ticket'" :disabled="seat.status === 'RESERVED'" size="sm">
    {{ getSeatRowChar(seat.row) }}{{ seat.place }}

    <template v-if="seat.status === 'RESERVED'">
      <div class="absolute w-full h-px bg-content/70 rotate-12"></div>
      <div class="absolute w-full h-px bg-content/70 -rotate-12"></div>
    </template>
  </BaseButton>
</template>
