<script setup lang="ts">
import {computed} from "vue"
import {useCinemaStore} from "@/stores/cinema/cinema.store"
import BaseAccordion from "@/ui/base/BaseAccordion"

const cinemaStore = useCinemaStore()
const availableCinemas = computed(() => cinemaStore.cinemas)
</script>

<template>
  <div class="flex flex-col gap-4">
    <div v-if="availableCinemas.length" class="flex flex-col gap-2">
      <BaseAccordion
        :items="availableCinemas"
        :itemId="(cinema) => cinema.id"
        :default-opened="(cinema) => cinemaStore.activeCinema?.id === cinema.id"
        group="cinemas"
      >
        <template #header="{item}">
          <div class="flex w-full items-center justify-between p-2">
            <span class="">{{ item.name }}</span>
            <span class="text-content/60">{{ item.halls.length }} залов</span>
          </div>
        </template>

        <template #content="{item}">
          <div class="flex flex-col gap-2 pl-2">
            <div
              v-for="hall in item.halls"
              :key="hall.id"
              class="border-content/10 focus-within:border-accent hover:border-content/20 flex cursor-pointer items-center justify-between rounded-lg border p-2 transition-colors outline-none"
              :class="{'border-primary-300 bg-primary-300 text-primary-900': cinemaStore.activeHall?.id === hall.id}"
              @click="cinemaStore.onSelectHall(hall.id)"
              @keydown.enter="cinemaStore.onSelectHall(hall.id)"
              tabindex="0"
            >
              <span class="">{{ hall.name }}</span>
              <span class="text-content/60">{{ hall.seats_count }} мест</span>
            </div>
            <div v-if="item.halls.length === 0" class="text-content/60 py-2 text-center">Нет доступных залов</div>
          </div>
        </template>
      </BaseAccordion>
    </div>

    <div v-else class="text-content/60 flex items-center justify-center">Нет доступных кинотеатров</div>
  </div>
</template>
