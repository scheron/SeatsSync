import {ref, watch} from "vue"
import {deepMerge} from "@seats-sync/utils/merge"
import {defineStore} from "pinia"
import {useWebSocket} from "@/composables/useWebSocket"
import {useThemeStore} from "@/stores/theme"
import {useUserStore} from "@/stores/user"

import type {Cinema, Hall} from "@seats-sync/types/cinema"

export const useCinemaStore = defineStore("cinema", () => {
  const HALL_SUB_ID = "hall-sub"
  const CINEMAS_SUB_ID = "cinemas-sub"

  const userStore = useUserStore()
  const themeStore = useThemeStore()
  const {subscribe, unsubscribe, cleanup} = useWebSocket()

  const isCinemaLoaded = ref(false)
  const cinemas = ref<Cinema[]>([])

  const activeCinema = ref<Cinema | null>(null)
  const activeHall = ref<Hall | null>(null)

  function onSelectCinema(cinema: Cinema) {
    activeCinema.value = cinema
    themeStore.setPrimaryColor(cinema.color)
  }

  function onSelectHall(hallId: Hall["id"]) {
    if (activeHall.value?.id === hallId) return

    unsubscribe(HALL_SUB_ID)

    subscribe({
      msg: {type: "hall.subscribe", data: {id: hallId}, eid: HALL_SUB_ID},
      onSnapshot: (data) => {
        activeHall.value = data
      },
      onUpdate: (data) => {
        if (activeHall.value?.id !== data.id) return
        activeHall.value = deepMerge(activeHall.value, data)
      },
    })
  }

  function clearCinemas() {
    cinemas.value = []
    activeCinema.value = null
    activeHall.value = null
    isCinemaLoaded.value = false
    themeStore.reset()
    cleanup()
  }

  function onSubscribeCinemas() {
    unsubscribe(CINEMAS_SUB_ID)

    subscribe({
      msg: {type: "cinemas.subscribe", data: null, eid: CINEMAS_SUB_ID},
      onSnapshot: (data) => {
        cinemas.value = data
        isCinemaLoaded.value = true
        onSelectCinema(data[0])
        onSelectHall(data[0].halls[0].id)
      },
      onError: (error) => {
        console.error("onSubscribeCinemas", error)
        isCinemaLoaded.value = true
      },
      onUpdate: (data) => {
        cinemas.value.forEach((cinema) => {
          if (cinema.id !== data.id) return
          cinema = deepMerge(cinema, data)
        })
      },
    })
  }

  watch(
    () => userStore.isLoggedIn,
    (isLoggedIn) => {
      if (isLoggedIn) onSubscribeCinemas()
      else clearCinemas()
    },
    {immediate: true},
  )

  return {
    isCinemaLoaded,
    cinemas,
    activeCinema,
    activeHall,

    onSelectCinema,
    onSelectHall,
  }
})
