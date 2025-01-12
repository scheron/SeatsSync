import speakeasy from "speakeasy"
import {logger} from "@/shared/logger"

type Candidate = {
  username: string
  secret: string
  qr_url: string
  createdAt: number
}

class CandidateModel extends Map<string, Candidate> {
  private readonly candidateTTL: number

  constructor(candidateTTL = 5 * 60 * 1000) {
    // 5 minutes default
    super()
    this.candidateTTL = candidateTTL
  }

  set(key: string, value: Candidate): this {
    super.set(key, value)

    setTimeout(() => {
      if (this.has(key)) {
        this.delete(key)
        logger.info("Candidate registration expired", {username: key})
      }
    }, this.candidateTTL)

    return this
  }

  create(username: string): Candidate {
    const secret = speakeasy.generateSecret({
      name: `SeatsSync ${username}`,
      length: 32,
    })

    return {
      username,
      secret: secret.base32,
      qr_url: secret.otpauth_url,
      createdAt: Date.now(),
    }
  }

  isValid(secret: string, code: string): boolean {
    try {
      return speakeasy.totp.verify({
        secret,
        encoding: "base32",
        token: code,
        window: 1,
      })
    } catch (error) {
      logger.error("Failed to verify TOTP", {error: error.message})
      return false
    }
  }

  getCandidateTTL(): number {
    return this.candidateTTL
  }

  override delete(key: string): boolean {
    const result = super.delete(key)
    if (result) {
      logger.info("Candidate deleted", {username: key})
    }
    return result
  }

  override clear(): void {
    super.clear()
    logger.info("All candidates cleared")
  }
}

export const candidateModel = new CandidateModel()
