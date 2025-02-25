<script setup lang="ts">
import {refAutoReset, useClipboard} from "@vueuse/core"
import {toast} from "@/lib/toasts-lite"
import BaseButton from "@/ui/base/BaseButton.vue"

const props = defineProps<{text: string}>()

const copied = refAutoReset(false, 2000)
const {copy} = useClipboard({legacy: true})

async function copyToClipboard() {
  try {
    await copy(props.text)
    copied.value = true
    toast.success("Copied to clipboard!")
  } catch (error) {
    toast.error("Failed to copy")
  }
}
</script>

<template>
  <BaseButton
    variant="primary"
    class="flex-row-reverse gap-1"
    class-icon="size-4"
    :icon="copied ? 'clipboard-doc-check' : 'clipboard-doc'"
    @click="copyToClipboard"
  >
    <slot>Copy</slot>
  </BaseButton>
</template>
