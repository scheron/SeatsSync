import {logger} from "@/shared/logger"

import type {Candidate} from "./types"

class CandidateModel extends Map<string, Candidate> {
  constructor(private readonly candidateTTL = 5 * 60 * 1000) {
    super()
  }

  override set(key: string, value: Candidate): this {
    super.set(key, value)

    setTimeout(() => {
      if (this.has(key)) {
        this.delete(key)
        logger.info("Candidate registration expired", {username: key})
      }
    }, this.candidateTTL)

    return this
  }

  override delete(key: string): boolean {
    if (!super.has(key)) return false

    return super.delete(key)
  }
}

export const candidateModel = new CandidateModel()
