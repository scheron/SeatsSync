import {ref} from "vue"
import {tryOnBeforeUnmount} from "@vueuse/core"
import {useModalsLite} from "@/lib/modals-lite"
import ReserveSeatModal from "./ReserveSeatModal.vue"

import type {Seat} from "@seats-sync/types/cinema"

export default function useReserveSeatModal() {
  const isOpened = ref(false)
  const {show, hideAll} = useModalsLite()

  async function open(hallId?: number, seat?: Seat) {
    if (!hallId || !seat) return

    isOpened.value = true

    const {hide} = show(
      ReserveSeatModal,
      {
        hallId,
        seat,
        onConfirm: () => {
          isOpened.value = false
          hide()
        },
        onCancel: () => {
          isOpened.value = false
          hide()
        },
      },
      {modalId: "reserve-seat-modal", teleport: "[data-hall]"},
    )
  }

  function close() {
    isOpened.value = false
    hideAll()
  }

  tryOnBeforeUnmount(close)

  return {
    isOpened,

    open,
    close,
  }
}
