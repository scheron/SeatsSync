import jwt from "jsonwebtoken"
import {earlyResponse} from "@/shared/earlyReturn"
import {formatError, formatSuccess} from "@/shared/messages/formatters"

import type {Request, Response} from "express"

const JWT_SECRET = process.env.JWT_SECRET as string

export async function handshake(req: Request<{}, {}, {}>, res: Response) {
  const token = req.cookies?.token

  if (await earlyResponse(res, !token, 401, {error: "Unauthorized"})) return

  try {
    const payload = jwt.verify(token, JWT_SECRET) as {username: string}

    const newToken = jwt.sign({username: payload.username}, JWT_SECRET, {expiresIn: "5d"})

    res.cookie("refresh_token", newToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 5 * 24 * 60 * 60 * 1000,
    })

    res.json(formatSuccess({type: "handshake", status: "success", data: {username: payload.username}}))
  } catch (error) {
    res.status(401).json(formatError({type: "handshake", error: error.message, code: 401}))
  }
}

export async function wink(req: Request<{}, {}, {username: string; token: string}>, res: any) {
  const {username, token} = req.body

  try {
    const payload = jwt.verify(token, JWT_SECRET) as {username: string; purpose: "wink"}

    if (payload.purpose !== "wink" || payload.username !== username) {
      return res.status(401).json({message: "Invalid token"})
    }

    const refreshToken = jwt.sign({username}, JWT_SECRET, {expiresIn: "5d"})

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 5 * 24 * 60 * 60 * 1000,
    })

    res.json(formatSuccess({type: "wink", status: "success", data: {}}))
  } catch (error) {
    res.status(401).json(formatError({type: "wink", error: error.message, code: 401}))
  }
}
