import speakeasy from "speakeasy"

type Candidate = {username: string; secret: string; qr_url: string; createdAt: number}

class CandidateModel extends Map<string, Candidate> {
  constructor(private candidateTTL = 5 * 60 * 1000) {
    super()
  }

  set(key: string, value: Candidate): this {
    super.set(key, value)

    setTimeout(() => this.delete(key), this.candidateTTL)

    return this
  }

  create(username: string) {
    const secret = speakeasy.generateSecret({name: `SeatsSync ${username}`})
    return {username, secret: secret.base32, qr_url: secret.otpauth_url, createdAt: Date.now()}
  }

  isValid(secret: string, code: string) {
    return speakeasy.totp.verify({secret, encoding: "base32", window: 1, token: code})
  }
}

export const candidateModel = new CandidateModel()
