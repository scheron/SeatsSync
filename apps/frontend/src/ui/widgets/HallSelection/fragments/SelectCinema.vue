<script setup lang="ts">
import BaseButton from "@/ui/base/BaseButton.vue"
import BaseIcon from "@/ui/base/BaseIcon.vue"
import BasePopover from "@/ui/base/BasePopover.vue"

import type {Cinema} from "@seats-sync/types/cinema"

defineProps<{cinemas: Cinema[]; activeCinema: Cinema}>()
const emit = defineEmits<{"select-cinema": [Cinema]}>()

function onSelectCinema(cinema: Cinema) {
  emit("select-cinema", cinema)
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
        </BaseButton>
      </div>
    </template>
  </BasePopover>
</template>
