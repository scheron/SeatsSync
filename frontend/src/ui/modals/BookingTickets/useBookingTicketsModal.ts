import {tryOnBeforeUnmount} from "@vueuse/core"
import {useModalsLite} from "@/lib/modals-lite"
import BookingTicketsModal from "./BookingTicketsModal.vue"

export default function useBookingTicketsModal() {
  let modalId: string | null = null
  const {show, hide, hideAll} = useModalsLite()

  async function open(): Promise<{isCanceled: boolean}> {
    return new Promise((resolve) => {
      const {hide, id} = show(
        BookingTicketsModal,
        {
          onConfirm: () => {
            hide()
            resolve({isCanceled: false})
          },
          onCancel: () => {
            hide()
            resolve({isCanceled: true})
          },
        },
        {teleport: '[data-layout-section="left"]'},
      )

      modalId = id
    })
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
    hideAll,
  }
}
