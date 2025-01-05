import {createCandidate as _createCandidate} from "./model"

const candidates = new Map<string, {username: string; secret: string; qr_url: string; createdAt: number}>()
const CANDIDATE_TIMEOUT = 5 * 60 * 1000

export function scheduleCandidateRemoval(username: string) {
  setTimeout(() => {
    candidates.delete(username)
  }, CANDIDATE_TIMEOUT)
}

export function getCandidate(username: string) {
  return candidates.get(username)
}

export function deleteCandidate(username: string) {
  candidates.delete(username)
}

export function candidateExists(username: string) {
  return candidates.has(username)
}

export function createCandidate(username: string) {
  const candidate = _createCandidate(username)

  candidates.set(username, candidate)
  scheduleCandidateRemoval(username)

  return candidate
}
