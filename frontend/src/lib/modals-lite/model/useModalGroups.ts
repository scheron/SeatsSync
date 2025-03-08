import {computed, readonly, ref} from "vue"

import type {ModalGroup, ModalGroups, ModalItem, ModalLocation} from "./types"

let modalCounter = 0

export function useModalGroups() {
  const modalGroups = ref<ModalGroups>(new Map())
  const modalStack = computed(getAllModals)

  function createModalId() {
    return `modal-${++modalCounter}`
  }

  function createModalGroup(): ModalGroup {
    return {head: null, tail: null, size: 0}
  }

  function getAllModals() {
    const allModals: ModalItem[] = []

    modalGroups.value.forEach((group) => {
      let current = group.head

      while (current) {
        allModals.push(current)
        current = current.next ?? null
      }
    })

    return allModals
  }

  function getGroup(teleportTarget: string) {
    return modalGroups.value.get(teleportTarget || "body")
  }

  function addToGroup(teleportTarget: string, group: ModalGroup) {
    modalGroups.value.set(teleportTarget || "body", group)
  }

  function clearGroup() {
    modalGroups.value.clear()
  }

  function findModalById(modalId: string): ModalLocation | null {
    for (const [key, group] of modalGroups.value.entries()) {
      let current = group.head

      while (current) {
        if (current.id === modalId) return {group, groupKey: key, modal: current}

        current = current.next ?? null
      }
    }

    return null
  }

  function removeFromGroup(group: ModalGroup, modal: ModalItem) {
    if (modal.prev) modal.prev.next = modal.next ?? null
    else group.head = modal.next ?? null

    if (modal.next) modal.next.prev = modal.prev ?? null
    else group.tail = modal.prev ?? null

    modal.prev = null
    modal.next = null

    group.size--

    if (!group.size) modalGroups.value.delete(modal.options.teleport || "body")
  }

  return {
    modalGroups: readonly(modalGroups),
    allModals: readonly(modalStack),

    createModalId,
    createModalGroup,
    getGroup,
    addToGroup,
    clearGroup,

    findModalById,
    removeFromGroup,
  }
}
