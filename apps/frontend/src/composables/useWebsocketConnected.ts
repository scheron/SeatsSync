import {ref} from "vue"
import {tryOnBeforeUnmount} from "@vueuse/core"
import {wsClient} from "@/api/ws"
import {toast} from "@/lib/toasts-lite"

export function useWebsocketConnected() {
  const isConnected = ref(false)
  let toastID: string

  wsClient.connectionState.subscribe(({state, prevState}) => {
    if (state === "RECONNECTING") toastID = toast.loading("Connecting...", {id: toastID, autoClose: false})
    else if (state === "CONNECTED" && prevState === "RECONNECTING") toast.success("Connected", {id: toastID, autoClose: true})
    else if (state === "DISCONNECTED" && prevState === "RECONNECTING") toast.error("Connection failed", {id: toastID, autoClose: true})

    isConnected.value = state === "CONNECTED"
  })

  wsClient.on("*", "error").subscribe(({error}) => {
    if (!error) return
    toast.error(error)
  })

  function destroy() {
    toast.remove(toastID)
    toastID = ""
    isConnected.value = false
  }

  tryOnBeforeUnmount(destroy)

  return {isConnected}
}
