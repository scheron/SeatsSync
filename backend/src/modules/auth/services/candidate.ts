import {Errors} from "@/constants/errors"
import {ApiError} from "@/shared/errors/ApiError"
import {candidateModel} from "../model/candidate"

export function createCandidate(username: string) {
  if (candidateModel.has(username)) throw new ApiError(403, Errors.RegistrationInProgress)

  const candidate = candidateModel.create(username)
  candidateModel.set(username, candidate)

  return candidate
}

export function validateCandidate(username: string, code: string) {
  const candidate = candidateModel.get(username)
  if (!candidate) throw new ApiError(403, Errors.RegistrationNotInProgress)

  const isValid = candidateModel.isValid(candidate.secret, code)
  if (!isValid) throw new ApiError(403, Errors.InvalidCode)

  return candidate
}

export function deleteCandidate(username: string) {
  if (!candidateModel.has(username)) throw new ApiError(405, Errors.RegistrationNotInProgress)
  candidateModel.delete(username)
}
