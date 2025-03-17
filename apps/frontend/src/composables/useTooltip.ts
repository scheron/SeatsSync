import {ref} from "vue"
import {createSharedComposable} from "@vueuse/core"
import {createTooltip, destroyTooltip} from "floating-vue"

function _useTooltip() {
  const tooltip = ref<ReturnType<typeof createTooltip> | null>(null)

  function show(target: HTMLElement, content: string) {
    if (tooltip.value) {
      destroyTooltip(tooltip.value)
      tooltip.value = null
    }

    tooltip.value = createTooltip(
      target,
      {
        content,
        html: true,
        triggers: [],
        distance: 10,
        placement: "top",
        shown: true,
      },
      {},
    )
  }

  function hide(target?: HTMLElement) {
    if (target) destroyTooltip(target)
  }

  return {
    show,
    hide,
  }
}

export const useTooltip = createSharedComposable(_useTooltip)
