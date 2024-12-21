import {Request, Response} from "express"
import jwt from "jsonwebtoken"
import speakeasy from "speakeasy"
import {earlyReturnResponse} from "@/shared/earlyReturn"
import {createUser, findUser} from "./auth.model"

const JWT_SECRET = process.env.JWT_SECRET as string

export async function registerUser(req: Request<{}, {}, {username: string}>, res: Response) {
  const {username} = req.body

  if (await earlyReturnResponse(res, !username, 400, "Username is required")) return
  if (await earlyReturnResponse(res, await findUser({username}), 400, "User already exists")) return

  const secret = speakeasy.generateSecret({name: `SeatsSync ${username}`, length: 20})

  await createUser({username, secret: secret.base32, token: null, recovery_phrase: null})

  res.json({otpauth_url: secret.otpauth_url, secret: secret.base32})
}

export async function loginUser(req: Request<{}, {}, {username: string; token: string}>, res: Response) {
  const {username, token} = req.body

  if (await earlyReturnResponse(res, !username, 400, "Username is required")) return
  if (await earlyReturnResponse(res, !token, 400, "Token is required")) return

  const user = await findUser({username})
  if (await earlyReturnResponse(res, !user, 404, "User not found")) return

  const isValid = speakeasy.totp.verify({secret: user.secret, encoding: "base32", token, window: 1})
  if (await earlyReturnResponse(res, !isValid, 401, "Invalid token")) return

  const refreshToken = jwt.sign({username}, JWT_SECRET, {expiresIn: "5d"})

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 5 * 24 * 60 * 60 * 1000,
  })

  res.json({message: "Logged in successfully"})
}

export async function saveRecoveryPhrase(req: Request<any, any, {username: string; recovery_phrase: string}>, res: Response) {
  const {username, recovery_phrase} = req.body

  if (await earlyReturnResponse(res, !username, 400, "Username is required")) return
  if (await earlyReturnResponse(res, !recovery_phrase, 400, "Recovery phrase is required")) return

  const user = await findUser({username})

  if (await earlyReturnResponse(res, !user, 404, "User not found")) return
  if (await earlyReturnResponse(res, user.recovery_phrase, 400, "Recovery phrase already exists")) return

  await createUser({username, secret: user.secret, token: user.token, recovery_phrase})

  res.json({message: "Recovery phrase saved successfully"})
}
