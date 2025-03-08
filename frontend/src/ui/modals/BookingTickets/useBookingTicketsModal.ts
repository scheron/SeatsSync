import {tryOnBeforeUnmount} from "@vueuse/core"
import {useModalsLite} from "@/lib/modals-lite"
import BookingTicketsModal from "./BookingTicketsModal.vue"

import type {Seat} from "@/types/cinema"

export default function useBookingTicketsModal() {
  let modalId: string | null = null
  const {show, hide} = useModalsLite()

  function open(seats: Seat[]) {
    const {hide, id} = show(
      BookingTicketsModal,
      {
        seats,
        onSuccess: () => {
          hide()
        },
        onError: () => {
          hide()
        },
        onCancel: () => {
          hide()
        },
      },
      {
        teleport: '[data-layout-section="left"]',
      },
    )

    modalId = id
  }

  function close() {
    if (!modalId) return
    hide(modalId)
    modalId = null
  }

  tryOnBeforeUnmount(close)

  return {
    open,
    close,
  }
}
