import {Request, Response} from "express"
import jwt from "jsonwebtoken"
import {earlyResponse} from "@/shared/earlyReturn"
import {formatError, formatSuccess} from "@/shared/messages/formatters"

const JWT_SECRET = process.env.JWT_SECRET as string
const candidates = new Map<string, {username: string; secret: string; createdAt: number}>()

export async function checkAccess(req: Request<{}, {}, {}>, res: Response) {
  const token = req.cookies?.token

  if (await earlyResponse(res, !token, 401, {error: "Unauthorized"})) return

  try {
    const payload = jwt.verify(token, JWT_SECRET) as {username: string}

    const newToken = jwt.sign({username: payload.username}, JWT_SECRET, {expiresIn: "5d"})

    res.cookie("refresh_token", newToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 5 * 24 * 60 * 60 * 1000,
    })

    res.json(formatSuccess({type: "check_access", status: "success", data: {username: payload.username}}))
  } catch (error) {
    res.status(401).json(formatError({type: "check_access", error: error.message, code: 401}))
  }
}

// export async function registerUser(req: Request<{}, {}, {username: string}>, res: Response) {
//   const {username} = req.body

//   if (await earlyResponse(res, !username, 400, {error: "Username is required"})) return
//   if (await earlyResponse(res, await findUser({username}), 400, {error: "User already exists"})) return

//   const secret = speakeasy.generateSecret({name: `SeatsSync ${username}`, length: 20})

//   await createUser({username, secret: secret.base32, token: null, recovery_phrase: null})

//   res.json({otpauth_url: secret.otpauth_url, secret: secret.base32})
// }

// export async function loginUser(req: Request<{}, {}, {username: string; token: string}>, res: Response) {
//   const {username, token} = req.body

//   if (await earlyResponse(res, !username, 400, {error: "Username is required"})) return
//   if (await earlyResponse(res, !token, 400, {error: "Token is required"})) return

//   const user = await findUser({username})
//   if (await earlyResponse(res, !user, 404, "User not found")) return

//   const isValid = speakeasy.totp.verify({secret: user.secret, encoding: "base32", token, window: 1})
//   if (await earlyResponse(res, !isValid, 401, {error: "Invalid token"})) return

//   const refreshToken = jwt.sign({username}, JWT_SECRET, {expiresIn: "5d"})

//   res.cookie("refresh_token", refreshToken, {
//     httpOnly: true,
//     secure: false,
//     sameSite: "strict",
//     maxAge: 5 * 24 * 60 * 60 * 1000,
//   })

//   res.json({message: "Logged in successfully"})
// }

// export async function saveRecoveryPhrase(req: Request<any, any, {username: string; recovery_phrase: string}>, res: Response) {
//   const {username, recovery_phrase} = req.body

//   if (await earlyResponse(res, !username, 400, { error: "Username is required"})) return
//   if (await earlyResponse(res, !recovery_phrase, 400, "Recovery phrase is required")) return

//   const user = await findUser({username})

//   if (await earlyResponse(res, !user, 404, "User not found")) return
//   if (await earlyResponse(res, user.recovery_phrase, 400, "Recovery phrase already exists")) return

//   await createUser({username, secret: user.secret, token: user.token, recovery_phrase})

//   res.json({message: "Recovery phrase saved successfully"})
// }
