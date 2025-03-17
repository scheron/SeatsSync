import {computed, ref} from "vue"
import {useRouter} from "vue-router"
import {tryOnBeforeMount, tryOnBeforeUnmount} from "@vueuse/core"
import {ROUTE_NAMES} from "@/router/routes"
import {defineStore} from "pinia"
import {useHttp} from "@/composables/useHttp"
import {useWebSocket} from "@/composables/useWebSocket"

type UserStatus = {status: "user" | "guest"}

export const useUserStore = defineStore("user", () => {
  const router = useRouter()
  const user = ref<UserStatus | null>(null)

  const isLoggedIn = computed(() => user.value?.status === "user")

  const {subscribe, cleanup} = useWebSocket()
  const {requestAsync, request} = useHttp()

  async function getUserStatus() {
    const data = await requestAsync<UserStatus, null>({method: "POST", url: "user.status"})
    return data.status
  }

  function logout() {
    request({method: "POST", url: "user.logout"})
  }

  tryOnBeforeMount(() => {
    subscribe<UserStatus, null>({
      msg: {type: "user.subscribe", data: null},
      onResult: ({data}) => {
        user.value = data

        if (Object.hasOwn(data, "status")) {
          if (data.status === "user") router.push({name: ROUTE_NAMES.MAIN})
          else router.push({name: ROUTE_NAMES.AUTH})
        }
      },
    })
  })

  tryOnBeforeUnmount(cleanup)

  return {
    isLoggedIn,

    getUserStatus,
    logout,
  }
})
