import {onUnmounted, ref} from "vue"
import {useEventListener} from "@vueuse/core"

export function useTooltip({hideDelay = 200}: {hideDelay?: number} = {}) {
  let timeout: NodeJS.Timeout | null = null

  const isTooltipVisible = ref(false)
  const mousePosition = ref({x: 0, y: 0, offset: 20})
  const tooltipRef = ref<{tooltipContainer: HTMLElement} | null>(null)

  function updateTooltipPosition() {
    if (isTooltipVisible.value && tooltipRef.value?.tooltipContainer) {
      const tooltip = tooltipRef.value.tooltipContainer

      tooltip.style.position = "fixed"
      tooltip.style.left = `${mousePosition.value.x}px`
      tooltip.style.top = `${mousePosition.value.y - mousePosition.value.offset}px`
      tooltip.style.transform = "translate(-50%, -100%)"
      tooltip.style.zIndex = "9999"
    }
  }

  function onMouseMove(e: MouseEvent) {
    mousePosition.value = {x: e.clientX, y: e.clientY, offset: 20}
    updateTooltipPosition()
  }

  function showTooltip(): Promise<void> {
    return new Promise((resolve) => {
      if (timeout) clearTimeout(timeout)

      isTooltipVisible.value = true

      requestAnimationFrame(() => {
        updateTooltipPosition()
        resolve()
      })
    })
  }

  function hideTooltip(): Promise<void> {
    return new Promise((resolve) => {
      if (timeout) clearTimeout(timeout)

      timeout = setTimeout(() => {
        isTooltipVisible.value = false
        resolve()
      }, hideDelay ?? 200)
    })
  }

  useEventListener("mousemove", onMouseMove)

  onUnmounted(() => {
    if (timeout) clearTimeout(timeout)
  })

  return {
    isTooltipVisible,
    tooltipRef,
    showTooltip,
    hideTooltip,
  }
}
