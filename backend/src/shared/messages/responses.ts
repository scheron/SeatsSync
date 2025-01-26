import {Response} from "express"

export function sendSuccess<T = any>(res: Response, data: T, statusCode: number = 200): void {
  res.status(statusCode).json({data, status: "success", error: null})
}

export function sendError(res: Response, error: string, statusCode: number = 200): void {
  res.status(statusCode).json({error, data: null, status: "error"})
}
