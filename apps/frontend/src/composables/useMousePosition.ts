import {ref} from "vue"
import {createEventHook, createSharedComposable, useEventListener, useThrottleFn} from "@vueuse/core"

function createUseMousePosition({throttle = 50}: {throttle?: number} = {}) {
  const positionChange = createEventHook<{x: number; y: number; hoveredElement: HTMLElement | null; prevElement: HTMLElement | null}>()

  const x = ref(0)
  const y = ref(0)
  const hoveredElement = ref<HTMLElement | null>(null)
  const prevElement = ref<HTMLElement | null>(null)

  const update = useThrottleFn((e: MouseEvent) => {
    x.value = e.clientX
    y.value = e.clientY

    let elementUnderCursor = document.elementFromPoint(x.value, y.value)

    if (!elementUnderCursor || elementUnderCursor === document.documentElement) {
      elementUnderCursor = document.body
    }

    if (!(elementUnderCursor instanceof HTMLElement)) {
      elementUnderCursor = e.target as HTMLElement
    }

    prevElement.value = hoveredElement.value
    hoveredElement.value = elementUnderCursor as HTMLElement

    positionChange.trigger({
      x: x.value,
      y: y.value,
      hoveredElement: hoveredElement.value,
      prevElement: prevElement.value,
    })
  }, throttle)

  useEventListener(window, "mousemove", update, {passive: true})

  return {
    onPositionChange: positionChange.on,
    x,
    y,
    hoveredElement,
    prevElement,
  }
}

export const useMousePosition = createSharedComposable(createUseMousePosition)
