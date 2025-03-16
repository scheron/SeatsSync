<script setup lang="ts">
import {useCinemaStore} from "@/stores/cinema/cinema.store"
import BaseButton from "@/ui/base/BaseButton.vue"
import BaseCard from "@/ui/base/BaseCard.vue"
import BaseIcon from "@/ui/base/BaseIcon.vue"
import BasePopover from "@/ui/base/BasePopover.vue"
import {useReserveSeatModal} from "@/ui/modals/ReserveSeat"
import Hall from "./fragments/Hall.vue"
import HallStats from "./fragments/HallStats.vue"

import type {HallInCinema} from "@seats-sync/types/cinema"

const cinemaStore = useCinemaStore()
const {hideAll} = useReserveSeatModal()

function onSelectHall(hall: HallInCinema) {
  if (hall.id === cinemaStore.activeHall?.id) return
  cinemaStore.onSelectHall(hall.id)
  hideAll()
}
</script>

<template>
  <section class="text-content flex size-full flex-col gap-3 p-3">
    <BaseCard class="flex gap-2 w-full h-fit">
      <BasePopover>
        <template #trigger="{open, shown}">
          <BaseButton class="px-2 py-px" icon="cinema" @click="open">
            {{ cinemaStore.activeCinema?.name }}

            <BaseIcon name="chevron-down" class="text-content/50 size-4 transition-transform" :class="{'rotate-180': shown}" />
          </BaseButton>
        </template>

        <template #content="{hide}">
          <div class="flex flex-col gap-2 bg-primary-100 border border-accent/20 rounded-md px-1 py-2 w-full">
            <BaseButton
              v-for="cinema in cinemaStore.cinemas"
              :key="cinema.id"
              class="px-2 py-px justify-start"
              icon="cinema"
              @click="(cinemaStore.onSelectCinema(cinema), hide())"
            >
              {{ cinema.name }}
            </BaseButton>
          </div>
        </template>
      </BasePopover>

      <div class="flex gap-2 overflow-x-auto items-center h-full flex-1">
        <BaseButton
          v-for="hall in cinemaStore.activeCinema?.halls"
          :key="hall.id"
          :variant="hall.id === cinemaStore.activeHall?.id ? 'outline' : 'primary'"
          icon="hall"
          class="px-2 py-px flex-shrink-0 h-fit"
          :class="{'cursor-auto': hall.id === cinemaStore.activeHall?.id}"
          @click="onSelectHall(hall)"
        >
          {{ hall.name }}
        </BaseButton>
      </div>
    </BaseCard>

    <div class="flex-1 grid grid-cols-[500px_1fr] gap-3 overflow-auto">
      <BaseCard class="flex items-center gap-2 flex-col p-2">
        <HallStats />
      </BaseCard>

      <BaseCard data-hall class="relative">
        <Hall />
      </BaseCard>
    </div>
  </section>
</template>
