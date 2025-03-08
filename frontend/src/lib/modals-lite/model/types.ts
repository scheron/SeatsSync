import type {Component, DefineComponent, InjectionKey} from "vue"

export type ModalLiteComponentProps<T> = T extends new () => {$props: infer P}
  ? NonNullable<P>
  : T extends (props: infer P, ...args: any) => any
    ? P
    : {}

export type TeleportStrategy = {
  strategy: "fixed" | "absolute"
  lockScroll: boolean
}

export type ModalLiteShowOptions = {
  teleport?: string
  modalId?: string
}

export type ModalComponent = DefineComponent<any, any, any>

export type ModalItem = {
  id: string
  parentId?: string
  component: ModalComponent
  props: any
  options: ModalLiteShowOptions
  prev?: ModalItem | null
  next?: ModalItem | null
}

export type ModalGroup = {
  head: ModalItem | null
  tail: ModalItem | null
  size: number
}

export type ModalGroups = Map<string, ModalGroup>
export type ModalLocation = {group: ModalGroup; groupKey: string; modal: ModalItem}

export type ModalContext = {
  id: string
  closeSelf: () => void
  closeModal: (modalId: string) => void
  strategy: TeleportStrategy
}

export type ModalHandle = {
  id: string
  parentId?: string
  hide: () => void
}

export const MODAL_CONTEXT = Symbol("modal-context") as InjectionKey<ModalContext>
export type ModalLiteOptions<T extends Component> = Partial<ModalLiteComponentProps<T>>
