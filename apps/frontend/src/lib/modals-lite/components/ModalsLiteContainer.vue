<script setup lang="ts">
// @ts-ignore
import {nextTick, ref} from "vue"
import {useEventListener} from "@vueuse/core"
import {VueKeyboardTrapDirectiveFactory} from "@pdanpdan/vue-keyboard-trap"
import useModalLite from "../model/useModalsLite"
import {getFirstFocusableElement} from "../utils/getFirstFocusableElement"
import {scrollbarPadding} from "../utils/scrollbarPadding"
import {getTeleportStrategy} from "../utils/teleport"
import ModalsLiteWrapper from "./ModalsLiteWrapper.vue"

import type {ModalItem} from "../model/types"

const vKbdTrap = VueKeyboardTrapDirectiveFactory().directive
const {allModals, hide, onModalsUpdated} = useModalLite()

const modalRefs = ref<{[key: string]: HTMLElement | null}>({})
const initialFocusRefs = ref<{[key: string]: HTMLElement | null}>({})

function handleEscape(event: KeyboardEvent) {
  if (event.key === "Escape" && allModals.value.length) {
    const lastModal = allModals.value.at(-1)
    if (lastModal) hide(lastModal.id)
  }
}

function setModalRef(el: HTMLElement | null, modalId: string) {
  if (!el) {
    delete modalRefs.value[modalId]
    return
  }

  modalRefs.value[modalId] = el

  const modal = allModals.value.find(({id}) => id === modalId)
  if (modal) nextTick(() => setFocus(modal))
}

function setFocus(modalItem: ModalItem) {
  initialFocusRefs.value[modalItem.id] = document.activeElement as HTMLElement

  const modalRef = modalRefs.value[modalItem.id]
  if (!modalRef) return

  const firstFocusableElement = getFirstFocusableElement(modalRef)
  if (firstFocusableElement instanceof HTMLElement) firstFocusableElement.focus()
}

function returnFocus(modalId: string) {
  const element = initialFocusRefs.value[modalId]

  if (element instanceof HTMLElement) element.focus()

  delete initialFocusRefs.value[modalId]
}

function onModalShow(modalItem: ModalItem) {
  const strategy = getTeleportStrategy(modalItem.options.teleport || "body")

  if (strategy.lockScroll && allModals.value.length) scrollbarPadding.set()

  nextTick(() => setFocus(modalItem))
}

function onModalHide(modalId: string) {
  if (!allModals.value.length) scrollbarPadding.delete()
  returnFocus(modalId)
}

onModalsUpdated(({type, modal}) => {
  if (type === "add") onModalShow(modal)
  else onModalHide(modal.id)
})

useEventListener(document, "keydown", handleEscape)
</script>

<template>
  <template v-for="modal in allModals" :key="modal.id">
    <Teleport :to="modal.options.teleport || 'body'">
      <Transition name="fade" appear>
        <div :ref="(el) => setModalRef(el as HTMLElement | null, modal.id)">
          <ModalsLiteWrapper
            v-kbd-trap
            :modal="modal"
            :style="{
              position: getTeleportStrategy(modal.options.teleport || 'body').strategy,
              zIndex: 1000 + allModals.indexOf(modal),
            }"
          />
        </div>
      </Transition>
    </Teleport>
  </template>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
