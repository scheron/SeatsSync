<script setup lang="ts">
import {computed} from "vue"
import {useCinemaStore} from "@/stores/cinema/cinema.store"
import BaseAccordion from "@/ui/base/BaseAccordion"
import BaseIcon from "@/ui/base/BaseIcon.vue"
import BasePanel from "@/ui/base/BasePanel.vue"

import type {Cinema} from "@/types/cinema"

const cinemaStore = useCinemaStore()
const availableCinemas = computed(() => cinemaStore.cinemas)

function onSelectHall(cinema: Cinema, hall: Cinema["halls"][number]) {
  cinemaStore.onSelectCinema(cinema)
  if (hall.id) cinemaStore.onSelectHall(hall.id)
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div v-if="availableCinemas.length" class="flex flex-col gap-2">
      <BaseAccordion
        :items="availableCinemas"
        :itemId="(cinema) => cinema.id"
        :active-item-id="cinemaStore.activeHall ? cinemaStore.activeCinema?.id : ''"
        default-opened
        multiple
      >
        <template #header="{item}">
          <div class="flex w-full items-center justify-between">
            <div class="flex items-center gap-3">
              <BaseIcon name="paint-brush" class="size-4" :style="{color: item.color}" />
              <span class="">{{ item.name }}</span>
            </div>

            <div class="flex items-center gap-1">
              <span class="text-sm">{{ item.halls.length }}</span>
              <BaseIcon name="cinema" class="size-4" />
            </div>
          </div>
        </template>

        <template #content="{item}">
          <div class="flex flex-col gap-2 pl-4">
            <BasePanel
              v-for="hall in item.halls"
              :key="hall.id"
              :active="cinemaStore.activeHall?.id === hall.id"
              clickable
              @click="onSelectHall(item, hall)"
              @keydown.enter="onSelectHall(item, hall)"
            >
              <span class="">{{ hall.name }}</span>

              <div class="flex items-center gap-2">
                <span v-if="!hall.seats_count.free" class="rounded-md border px-1 py-0.5 text-[8px] uppercase">Sold out</span>
                <span v-else class="text-sm"> {{ hall.seats_count.free }} / {{ hall.seats_count.occupied + hall.seats_count.free }} </span>

                <BaseIcon name="chair" class="size-4" />
              </div>
            </BasePanel>

            <div v-if="!item.halls.length" class="text-content/60 py-2 text-center">There are no halls</div>
          </div>
        </template>
      </BaseAccordion>
    </div>

    <div v-else class="text-content/60 flex items-center justify-center">There are no cinemas</div>
  </div>
</template>
