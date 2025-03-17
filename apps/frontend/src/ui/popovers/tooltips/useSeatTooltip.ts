import {computed, ref, toValue, watchEffect} from "vue"
import {tryOnBeforeUnmount} from "@vueuse/core"
import {getSeatRowChar} from "@/utils/hall"
import {useTooltip} from "@/composables/useTooltip"

import type {Seat} from "@seats-sync/types/cinema"
import type {MaybeRef} from "vue"

export function useSeatTooltip(hovered: MaybeRef<boolean>, seat: MaybeRef<Seat>) {
  const {show, hide} = useTooltip()

  const seatRef = ref<HTMLElement | null>(null)
  const _seat = computed(() => toValue(seat))
  const _hovered = computed(() => toValue(hovered))

  const tooltipContent = computed(() => {
    const row = getSeatRowChar(_seat.value.row)
    const place = _seat.value.place
    const status = _seat.value.status
    const type = _seat.value.seat_type.name

    return `
    <div class="flex justify-between min-w-40 flex-col gap-2">
      <div class="flex items-center justify-between gap-1">
        <span class="text-content/70">Seat</span>
        <span class="font-bold text-content">${row}${place}</span>
      </div>

      <div class="flex items-center justify-between gap-1">
        <span class="text-content/70">Type</span>
        <span class="capitalize text-content">${type}</span>
      </div>

      <div class="flex items-center justify-between gap-1">
        <span class="text-content/70">Status</span>
        <span class="capitalize ${status === "VACANT" ? "text-accent" : "text-content/40"}">${status}</span>
      </div>
      </div>
    `
  })

  watchEffect(() => {
    if (_hovered.value && seatRef.value) show(seatRef.value, tooltipContent.value)
    else hide(seatRef.value!)
  })

  tryOnBeforeUnmount(() => hide(seatRef.value!))

  return {seatRef}
}
