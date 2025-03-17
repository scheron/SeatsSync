import {Errors} from "@seats-sync/constants/errors"
import {Methods} from "@seats-sync/constants/methods"
import {Subscriptions} from "@seats-sync/constants/subscriptions"
import {authReset, authStart, checkStatus, login, logout, register} from "../methods/user"
import {userSubscription} from "../subscriptions/user"

import type {IWebSocketClient} from "@/core/ws"
import type {MessageRequest} from "@seats-sync/types/websocket"
import type {Request, Response, Router} from "express"

export const UserController = {
  onMessage: async (ws: IWebSocketClient, message: MessageRequest<any>) => {
    switch (message.type) {
      case Subscriptions["user.subscribe"]:
        userSubscription.subscribe(ws, message)
        return true
      case Subscriptions["user.unsubscribe"]:
        userSubscription.unsubscribe(ws, message)
        return true
      default: {
        return false
      }
    }
  },

  onDisconnect: (ws: IWebSocketClient) => {
    userSubscription.unsubscribe(ws)
  },

  initRouter: (router: Router) => {
    router.post(Methods["user.auth_start"], async (req: Request<{}, {}, {username: string}>, res: Response) => {
      try {
        const result = await authStart(req.body.username)
        sendSuccess(res, result)
      } catch (error) {
        sendError(res, error?.message ?? Errors.InternalServerError)
      }
    })

    router.post(Methods["user.auth_reset"], async (req: Request<{}, {}, {username: string}>, res: Response) => {
      try {
        await authReset(req.body.username)
        sendSuccess(res, {success: true})
      } catch (error) {
        sendError(res, error?.message ?? Errors.InternalServerError)
      }
    })

    router.post(Methods["user.status"], async (req: Request<{}, {}, {}>, res: Response) => {
      try {
        const result = await checkStatus(req.headers.cookie)
        sendSuccess(res, result)
      } catch (error) {
        sendError(res, error?.message ?? Errors.InternalServerError)
      }
    })

    router.post(Methods["user.login"], async (req: Request<{}, {}, {username: string; code: string}>, res: Response) => {
      try {
        const result = await login(req.body.username, req.body.code, res)

        console.log("login", result)
        userSubscription.notify(result)
        sendSuccess(res, result)
      } catch (error) {
        sendError(res, error?.message ?? Errors.InternalServerError)
      }
    })

    router.post(Methods["user.logout"], async (req: Request<{}, {}, {}>, res: Response) => {
      try {
        await logout(req.headers.cookie, res)
        userSubscription.notify({status: "guest"})
        sendSuccess(res, {success: true})
      } catch (error) {
        sendError(res, error?.message ?? Errors.InternalServerError)
      }
    })

    router.post(Methods["user.register"], async (req: Request<{}, {}, {username: string; code: string}>, res: Response) => {
      try {
        const result = await register(req.body.username, req.body.code, res)
        userSubscription.notify(result)
        sendSuccess(res, result)
      } catch (error) {
        sendError(res, error?.message ?? Errors.InternalServerError)
      }
    })
  },
}

export function sendSuccess<T = any>(res: Response, data: T, statusCode: number = 200): void {
  res.status(statusCode).json({data, status: "success", error: null})
}

export function sendError(res: Response, error: string, statusCode: number = 200): void {
  res.status(statusCode).json({error, data: null, status: "error"})
}
