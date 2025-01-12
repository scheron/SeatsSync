import {createCinema} from "./methods/create"
import {getAllCinemas} from "./methods/getAll"
import {getOneCinema} from "./methods/getOne"
import {updateCinema} from "./methods/update"
import {subscribeToCinema, unsubscribeFromCinema} from "./subscriptions/onCinemaChange"

// Methods - one-time operations
export const methods = {
  getAll: getAllCinemas,
  getOne: getOneCinema,
  create: createCinema,
  update: updateCinema,
}

// Subscriptions - real-time data streams
export const subscriptions = {
  subscribe: subscribeToCinema,
  unsubscribe: unsubscribeFromCinema,
}

export type * from "./types"
