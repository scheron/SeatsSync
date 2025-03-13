import {ref} from "vue"
import {tryOnBeforeMount, tryOnBeforeUnmount} from "@vueuse/core"
import {defineStore} from "pinia"
import {useHttp} from "@/composables/useHttp"
import {useWebSocket} from "@/composables/useWebSocket"

type UserStatus = {status: "user" | "guest"}

export const useUserStore = defineStore("user", () => {
  const isLoggedIn = ref(false)

  const {subscribe, cleanup} = useWebSocket()
  const {requestAsync, request} = useHttp()

  async function checkUserStatus() {
    const data = await requestAsync<UserStatus, null>({method: "POST", url: "user.status"})
    isLoggedIn.value = data.status === "user"

    return isLoggedIn.value
  }

  function logout() {
    request({method: "POST", url: "user.logout"})
  }

  tryOnBeforeMount(() => {
    subscribe<UserStatus, null>({
      msg: {type: "user.subscribe", data: null},
      onResult: ({data}) => {
        console.log("user.subscribe", data)
        isLoggedIn.value = data.status === "user"
      },
    })
  })

  tryOnBeforeUnmount(() => {
    cleanup()
  })

  return {
    isLoggedIn,

    checkUserStatus,
    logout,
  }
})
