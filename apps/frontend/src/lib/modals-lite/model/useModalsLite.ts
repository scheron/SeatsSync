import {markRaw} from "vue"
import {createEventHook, createGlobalState} from "@vueuse/core"
import {getTeleportTarget} from "../utils/teleport"
import {useModalGroups} from "./useModalGroups"

import type {Component} from "vue"
import type {ModalComponent, ModalHandle, ModalItem, ModalLiteComponentProps, ModalLiteShowOptions} from "./types"

function createModal() {
  const modalsUpdated = createEventHook<{type: "add" | "remove"; modal: ModalItem}>()
  const {allModals, ...modalGroups} = useModalGroups()

  function show<T extends Component>(
    component: T,
    props: ModalLiteComponentProps<T>,
    options: ModalLiteShowOptions = {teleport: "body"},
  ): ModalHandle {
    const modalId = options.modalId || modalGroups.createModalId()
    const teleportTarget = getTeleportTarget(options.teleport || "body")

    if (options.modalId) {
      const existing = modalGroups.findModalById(modalId)

      if (existing) {
        const {group, modal} = existing
        modalGroups.removeFromGroup(group, modal)
        modalsUpdated.trigger({type: "remove", modal})
      }
    }

    let group = modalGroups.getGroup(teleportTarget)

    if (!group) {
      group = modalGroups.createModalGroup()
      modalGroups.addToGroup(teleportTarget, group)
    }

    const parentId = group.tail?.id

    const modalItem: ModalItem = {
      id: modalId,
      parentId,
      component: markRaw(component) as ModalComponent,
      props,
      options: {
        ...options,
        teleport: teleportTarget,
      },
    }

    if (group.tail) {
      modalItem.prev = group.tail
      group.tail.next = modalItem
      group.tail = modalItem
    } else {
      group.head = modalItem
      group.tail = modalItem
    }

    group.size++
    modalsUpdated.trigger({type: "add", modal: modalItem})

    return {
      id: modalId,
      parentId,
      hide: () => hide(modalId),
    }
  }

  function hide(modalId?: string) {
    if (modalId) {
      const found = modalGroups.findModalById(modalId)
      if (!found) return

      const {group, modal} = found
      modalGroups.removeFromGroup(group, modal)
      modalsUpdated.trigger({type: "remove", modal})
      return
    }

    if (!allModals.value.length) return

    const lastModal = allModals.value.at(-1)
    if (!lastModal) return

    const found = modalGroups.findModalById(lastModal.id)
    if (!found) return

    const {group, modal} = found
    modalGroups.removeFromGroup(group, modal)
    modalsUpdated.trigger({type: "remove", modal})
  }

  function hideAll() {
    setTimeout(() => {
      modalGroups.clearGroup()
      allModals.value.forEach((modal) => modalsUpdated.trigger({type: "remove", modal}))
    }, 100)
  }

  function patchOptions(modalId: string, newProps: Partial<ModalLiteComponentProps<ModalComponent>>) {
    const found = modalGroups.findModalById(modalId)
    if (!found) return

    found.modal.props = {...found.modal.props, ...newProps}
  }

  return {
    allModals,
    onModalsUpdated: modalsUpdated.on,
    show,
    hide,
    hideAll,
    patchOptions,
  }
}
export default createGlobalState(createModal)
