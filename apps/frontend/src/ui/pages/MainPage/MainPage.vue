<script setup lang="ts">
import {onMounted} from "vue"
import {SEAT_TYPES} from "@/constants/icons"
import {useCinemaStore} from "@/stores/cinema/cinema.store"
import BaseButton from "@/ui/base/BaseButton.vue"
import BaseIcon from "@/ui/base/BaseIcon.vue"
import BasePopover from "@/ui/base/BasePopover.vue"
import BaseSelect from "@/ui/base/BaseSelect.vue"
import Hall from "@/ui/sections/Hall"
import HallList from "@/ui/sections/HallList/HallList.vue"

const cinemaStore = useCinemaStore()

onMounted(() => {
  console.log(cinemaStore.activeHall)
  console.log(cinemaStore.activeCinema)

  //   router.routerLoaded()
  // VIP: VACANT / ALL
})
</script>

<template>
  <div class="bg-primary-100 text-content flex size-full flex-col gap-2 p-4">
    <div class="flex items-center justify-between gap-2">
      <BasePopover>
        <template #trigger="{show}">
          <BaseButton icon="cinema" class="text-lg" @click="show">{{ cinemaStore.activeHall?.name }}</BaseButton>
          <!-- <span>{{ cinemaStore.activeCinema. }}</span> -->
        </template>

        <template #content>
          <div class="border-primary-400 bg-primary-100 flex flex-col rounded-lg border shadow-lg">
            <HallList />
          </div>
        </template>
      </BasePopover>

      <div class="flex items-center gap-4">
        <div v-for="(icon, name) in SEAT_TYPES" :key="name" class="flex items-center gap-1 text-sm">
          30%
          <BaseIcon :name="icon" class="size-4" />
        </div>
      </div>
    </div>

    <div class="flex-1">
      <Hall />
    </div>

    <!-- <HallList /> -->
  </div>
</template>
