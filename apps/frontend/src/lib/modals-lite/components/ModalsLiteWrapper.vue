<script setup lang="ts">
import {provide} from "vue"
import {MODAL_CONTEXT} from "../model/types"
import useModalLite from "../model/useModalsLite"
import {getTeleportStrategy} from "../utils/teleport"

import type {ModalItem} from "../model/types"

const {hide} = useModalLite()

const props = defineProps<{
  modal: ModalItem
}>()

provide(MODAL_CONTEXT, {
  id: props.modal.id,
  closeSelf: () => hide(props.modal.id),
  closeModal: (modalId: string) => hide(modalId),
  strategy: getTeleportStrategy(props.modal.options.teleport || "body"),
})
</script>

<template>
  <component :is="modal.component" v-bind="modal.props" />
</template>
