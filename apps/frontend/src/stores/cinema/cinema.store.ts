import {ref} from "vue"
import {tryOnBeforeUnmount, tryOnMounted} from "@vueuse/core"
import {deepMerge} from "@seats-sync/utils/merge"
import {defineStore} from "pinia"
import {useWebSocket} from "@/composables/useWebSocket"
import {useThemeStore} from "@/stores/theme"

import type {Cinema, Hall} from "@seats-sync/types/cinema"

export const useCinemaStore = defineStore("cinema", () => {
  const HALL_SUB_ID = "hall-sub"
  const CINEMAS_SUB_ID = "cinemas-sub"

  const themeStore = useThemeStore()
  const {subscribe, unsubscribe, cleanup} = useWebSocket()

  const cinemas = ref<Cinema[]>([])

  const activeCinema = ref<Cinema | null>(null)
  const activeHall = ref<Hall | null>(null)

  function onSelectCinema(cinema: Cinema) {
    activeCinema.value = cinema
    onSelectHall(cinema.halls[0].id)

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
        console.log("onUpdate", data)
        if (activeHall.value?.id !== data.id) return
        activeHall.value = deepMerge(activeHall.value, data)
      },
    })
  }

  function onClearActiveHall() {
    activeHall.value = null
  }

  function onSubscribeCinemas() {
    unsubscribe(CINEMAS_SUB_ID)

    subscribe({
      msg: {type: "cinemas.subscribe", data: null, eid: CINEMAS_SUB_ID},
      onSnapshot: (data) => {
        cinemas.value = data
        onSelectCinema(data[0])
        onSelectHall(data[0].halls[0].id)
      },
      onUpdate: (data) => {
        cinemas.value.forEach((cinema) => {
          if (cinema.id !== data.id) return
          cinema = deepMerge(cinema, data)
        })
      },
    })
  }

  tryOnMounted(onSubscribeCinemas)

  tryOnBeforeUnmount(() => cleanup())

  return {
    cinemas,
    activeCinema,
    activeHall,

    onSelectCinema,

    onSelectHall,
    onClearActiveHall,
  }
})
