import {MessageHandlers} from "@/shared/messages/types"
import {createCinema} from "./messages/create/handler"
import {getAllCinemas} from "./messages/getAll/handler"
import {getOneCinema} from "./messages/getOne/handler"

import type {CinemaMessageType} from "./shared/types"

export const cinemaHandlers: MessageHandlers<CinemaMessageType> = {
  "cinema.get_one": getOneCinema,
  "cinema.create": createCinema,
  "cinema.get_all": getAllCinemas,
  // Другие обработчики будут добавлены здесь
}
