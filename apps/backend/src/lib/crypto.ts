import {randomBytes, scrypt} from "crypto"
import {promisify} from "util"
import {logger} from "@/lib/logger"

const scryptAsync = promisify(scrypt)

const SALT_LENGTH = 32
const KEY_LENGTH = 64
const ENCODING = "hex" as const

export async function hash(text: string): Promise<string> {
  try {
    const salt = randomBytes(SALT_LENGTH)
    const derivedKey = await scryptAsync(text, salt, KEY_LENGTH)
    return `${salt.toString(ENCODING)}:${derivedKey.toString()}`
  } catch (error) {
    logger.error("Failed to hash text", {error: error.message})
    throw error
  }
}

export async function verify(text: string, hashedText: string): Promise<boolean> {
  try {
    const [salt, key] = hashedText.split(":")
    const keyBuffer = Buffer.from(key, ENCODING)
    const derivedKey = await scryptAsync(text, Buffer.from(salt, ENCODING), KEY_LENGTH)
    return keyBuffer.equals(derivedKey as Buffer)
  } catch (error) {
    logger.error("Failed to verify text", {error: error.message})
    return false
  }
}
