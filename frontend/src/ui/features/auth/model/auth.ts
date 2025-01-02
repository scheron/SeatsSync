import {WebSocketSubject} from "rxjs/webSocket"

const wsUrl = "ws://localhost:3001"

export function createWebSocket() {
  const socket$ = new WebSocketSubject({
    url: wsUrl,
    openObserver: {
      next: () => {
        console.log("WebSocket connection established")

        // const token = authToken.value
        // if (token) {
        //   socket$.next({type: "auth.authenticate", data: {token}})
        // }
      },
    },

    closeObserver: {
      next: () => {
        console.log("WebSocket connection closed")
      },
    },
  })

  return socket$
}
