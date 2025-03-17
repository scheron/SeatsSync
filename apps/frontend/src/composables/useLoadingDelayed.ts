import {ref} from "vue"

export function useLoadingDelayed(initialState = false, delayBeforeShow = 200, minVisibleTime = 300) {
  const isLoading = ref(initialState)
  let showTimeout: ReturnType<typeof setTimeout> | null = null
  let hideTimeout: ReturnType<typeof setTimeout> | null = null
  let startTime: number | null = null

  function clearTimeouts() {
    if (showTimeout) {
      clearTimeout(showTimeout)
      showTimeout = null
    }

    if (hideTimeout) {
      clearTimeout(hideTimeout)
      hideTimeout = null
    }
  }

  function startHideTimeout(remainingTime: number) {
    hideTimeout = setTimeout(() => {
      isLoading.value = false
      hideTimeout = null
    }, remainingTime)
  }

  function calculateRemainingTime(manualMinVisibleTime: number) {
    const elapsedTime = startTime ? Date.now() - startTime : 0
    return manualMinVisibleTime - elapsedTime
  }

  function startLoading() {
    isLoading.value = true
    startTime = Date.now()
    showTimeout = null
  }

  function setLoading(state: boolean, manualDelay = delayBeforeShow, manualMinVisibleTime = minVisibleTime) {
    clearTimeouts()

    if (state) {
      if (!manualDelay) startLoading()
      else showTimeout = setTimeout(startLoading, manualDelay)
      return
    }

    const remainingTime = calculateRemainingTime(manualMinVisibleTime)

    if (remainingTime <= 0) isLoading.value = false
    else startHideTimeout(remainingTime)
  }

  return {
    isLoading,
    setLoading,
    clearTimeouts,
  }
}
