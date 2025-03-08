<script setup lang="ts">
import type {Cinema, Hall, Seat} from "@/types/cinema"

const props = defineProps<{
  seats: Seat[]
  hall: Hall
  cinema: Cinema
}>()
</script>

<template>
  <div class="relative mx-auto max-w-md">
    <div>
      Cinema: {{ props.cinema.name }}
      <div>
        Hall: {{ props.hall.name }}
        <div>Seats: {{ seats }}</div>
      </div>
    </div>
  </div>
</template>
