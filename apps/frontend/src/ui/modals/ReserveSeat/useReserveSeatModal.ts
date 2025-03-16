import {tryOnBeforeUnmount} from "@vueuse/core"
import {useModalsLite} from "@/lib/modals-lite"
import ReserveSeatModal from "./ReserveSeatModal.vue"

import type {Seat} from "@seats-sync/types/cinema"

export default function useReserveSeatModal() {
  const {show, hideAll} = useModalsLite()

  async function open(seat: Seat) {
    const {hide} = show(
      ReserveSeatModal,
      {
        seat,
        onConfirm: () => hide(),
        onCancel: () => hide(),
      },
      {modalId: "reserve-seat-modal", teleport: "[data-hall]"},
    )
  }

  function close() {
    hideAll()
  }

  tryOnBeforeUnmount(close)

  return {
    open,
    close,
    hideAll,
  }
}
