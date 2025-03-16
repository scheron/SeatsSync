<script setup lang="ts">
import BaseButton from "@/ui/base/BaseButton.vue"
import BasePopover from "@/ui/base/BasePopover.vue"

import type {Cinema, Hall, HallInCinema} from "@seats-sync/types/cinema"

const props = defineProps<{cinemas: Cinema[]; activeCinema: Cinema; activeHall: Hall | null}>()
const emit = defineEmits<{"select-hall": [HallInCinema]; "select-cinema": [Cinema]}>()

function isActive(hall: HallInCinema) {
  return hall.id === props.activeHall?.id
}

function onSelectCinema(cinema: Cinema) {
  emit("select-cinema", cinema)
}

function onSelectHall(hall: HallInCinema) {
  emit("select-hall", hall)
}
</script>

<template>
  <BasePopover>
    <template #trigger="{open, shown}">
      <BaseButton class="px-2 py-px" icon="cinema" @click="open">
        {{ activeCinema?.name }}

        <BaseIcon name="chevron-down" class="text-content/50 size-4 transition-transform" :class="{'rotate-180': shown}" />
      </BaseButton>
    </template>

    <template #content="{hide}">
      <div class="flex flex-col gap-2 bg-primary-100 border border-accent/20 rounded-md px-1 py-2 w-full">
        <BaseButton
          v-for="cinema in cinemas"
          :key="cinema.id"
          class="px-2 py-px justify-start"
          icon="cinema"
          @click="(onSelectCinema(cinema), hide())"
        >
          {{ cinema.name }}
          <span class="inline-block size-2 ml-auto rounded-full" :style="{backgroundColor: cinema.color}" />
        </BaseButton>
      </div>
    </template>
  </BasePopover>

  <div class="flex gap-2 overflow-x-auto items-center h-full flex-1">
    <BaseButton
      v-for="hall in activeCinema?.halls"
      :key="hall.id"
      :variant="isActive(hall) ? 'outline' : 'primary'"
      icon="hall"
      class="px-2 py-px flex-shrink-0 h-fit"
      :class="{'cursor-auto': isActive(hall)}"
      @click="onSelectHall(hall)"
    >
      {{ hall.name }}
    </BaseButton>
  </div>
</template>
