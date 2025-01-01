import {RawData, WebSocket} from "ws"

type HeartbeatOptions = {
  enablePingPong: boolean
  pingInterval: number
  autoCloseTimeout: number
  onPingTimeout: (ws: WebSocket) => void
  onSend: (ws: WebSocket, message: string) => void
}

export class Heartbeat {
  private enablePingPong: boolean
  private pingInterval: number
  private autoCloseTimeout: number
  private intervalId: NodeJS.Timeout | null = null

  private clients: Map<WebSocket, {lastPingTime: number}> = new Map()

  private onPingTimeout: (ws: WebSocket) => void
  private onSend: (ws: WebSocket, message: string) => void

  constructor(options: HeartbeatOptions) {
    this.enablePingPong = options.enablePingPong
    this.pingInterval = options.pingInterval ?? 3_000
    this.autoCloseTimeout = options.autoCloseTimeout ?? 10_000
    this.onPingTimeout = options.onPingTimeout
    this.onSend = options.onSend
  }

  addClient(ws: WebSocket) {
    if (!this.enablePingPong) return

    this.clients.set(ws, {lastPingTime: Date.now()})
  }

  removeClient(ws: WebSocket) {
    if (!this.enablePingPong) return

    this.clients.delete(ws)
  }

  onUserMessage(ws: WebSocket, message: RawData): boolean {
    if (!this.enablePingPong) return false

    const client = this.clients.get(ws)
    if (!client) return false

    client.lastPingTime = Date.now()

    if (message.toString() === "1") {
      ws.send("1")
      return true
    }

    return false
  }

  start() {
    if (this.intervalId || !this.enablePingPong) return

    this.intervalId = setInterval(() => this.checkClients(), this.pingInterval)
  }

  stop() {
    if (this.intervalId) clearInterval(this.intervalId)

    this.intervalId = null
    this.clients.clear()
  }

  private checkClients() {
    if (!this.enablePingPong) return

    const now = Date.now()

    this.clients.forEach((data, ws) => {
      if (now - data.lastPingTime > this.autoCloseTimeout) {
        ws.terminate()
        this.clients.delete(ws)
        this.onPingTimeout(ws)
        return
      }

      if (now - data.lastPingTime > this.pingInterval) {
        try {
          ws.send("1")
          this.onSend(ws, "1")
        } catch (error) {
          ws.terminate()
          this.clients.delete(ws)
          this.onPingTimeout(ws)
        }
      }
    })
  }
}
