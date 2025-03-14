import type {HTMLAttributes} from "vue"
import type {ModalVariantProps} from "./variants"

export type Props = {
  classContainer?: HTMLAttributes["class"]
  classOverlay?: HTMLAttributes["class"]
  classContent?: HTMLAttributes["class"]
  fullscreen?: boolean
  loading?: boolean
} & ModalVariantProps
