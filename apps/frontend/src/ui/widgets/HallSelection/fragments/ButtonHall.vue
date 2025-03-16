<script setup lang="ts">
import BaseButton from "@/ui/base/BaseButton.vue"

import type {HallInCinema} from "@seats-sync/types/cinema"

defineProps<{hall: HallInCinema; active: boolean}>()
const emit = defineEmits<{"select-hall": [HallInCinema]}>()

function onSelectHall(hall: HallInCinema) {
  emit("select-hall", hall)
}
</script>

<template>
  <BaseButton
    :variant="active ? 'outline' : 'primary'"
    icon="hall"
    class="px-2 py-px flex-shrink-0 h-fit"
    :class="{'cursor-auto': active}"
    @click="onSelectHall(hall)"
  >
    {{ hall.name }}
  </BaseButton>
</template>
