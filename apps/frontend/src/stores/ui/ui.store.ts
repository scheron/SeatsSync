import {readonly, ref} from "vue"
import {defineStore} from "pinia"
import {useLoadingDelayed} from "@/composables/useLoadingDelayed"

export const useUIStore = defineStore("ui", () => {
  const isShowHeader = ref(false)
  const {isLoading, setLoading} = useLoadingDelayed(false, 200, 400)

  function setHeaderVisibility(isVisible: boolean) {
    isShowHeader.value = isVisible
  }

  return {
    isShowHeader: readonly(isShowHeader),
    isLoadingPage: readonly(isLoading),

    setHeaderVisibility,
    setLoadingPage: setLoading,
  }
})
