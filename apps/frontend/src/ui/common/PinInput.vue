<script lang="ts" setup>
import {nextTick, onMounted, ref, watch} from "vue"
import {defineVariant} from "@/utils/tailwindcss"

const props = withDefaults(
  defineProps<{
    digits?: number
    disabled?: boolean
    invalid?: boolean
    clearOnVerify?: boolean
    variant?: "primary"
    size?: "xs" | "sm" | "md" | "lg" | "xl"
  }>(),
  {
    digits: 6,
    disabled: false,
    invalid: false,
    clearOnVerify: true,
    variant: "primary",
    size: "md",
  },
)

const emit = defineEmits<{verify: [code: string]}>()

const codes = ref(Array(props.digits).fill(""))
const inputRefs = ref<HTMLInputElement[]>([])

const pinContainerVariants = defineVariant({
  baseClass: "flex justify-between",
  variants: {
    disabled: "opacity-50",
  },
})

const pinInputVariants = defineVariant({
  baseClass:
    "w-10 text-center rounded-md border border-outline-2 bg-base-1 outline-none transition-all duration-200 focus:border-primary-800 focus:ring-1 focus:ring-primary-800 hover:border-primary-800",
  variants: {
    variant: {
      primary: "border-primary-300 bg-primary-200 text-content shadow-sm focus:border-accent focus:ring-accent hover:border-accent",
    },
    size: {
      xs: "size-7 text-xs",
      sm: "size-8 text-sm",
      md: "size-10 text-base",
      lg: "size-12 text-lg",
      xl: "size-14 text-xl",
    },
    disabled: "cursor-default bg-primary-300 opacity-80 text-content-3 border-primary-300 hover:border-primary-300",
    invalid: "border-error focus:border-error focus:ring-error",
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
})

const containerClass = pinContainerVariants({disabled: props.disabled})
const inputClass = pinInputVariants({
  variant: props.variant,
  size: props.size,
  disabled: props.disabled,
  invalid: props.invalid,
})

function focusInput(index: number) {
  const inputs = inputRefs.value
  if (index >= 0 && index < inputs.length) {
    inputs[index].focus()
  }
}

function handleKeydown(event: KeyboardEvent, index: number) {
  if (event.key === "Backspace") {
    if (codes.value[index] === "" && index > 0) {
      codes.value[index - 1] = ""
      focusInput(index - 1)
    } else {
      codes.value[index] = ""
    }
    event.preventDefault()
  }

  if (event.key === "Delete") {
    codes.value[index] = ""
  }
}

function handleInput(event: Event, index: number) {
  const input = event.target as HTMLInputElement
  const value = input.value.replace(/\D/g, "")
  codes.value[index] = value.slice(-1)

  if (value && index < props.digits - 1) {
    focusInput(index + 1)
  }
}

function handlePaste(event: ClipboardEvent, index: number) {
  event.preventDefault()
  try {
    const pasteData = event.clipboardData
      ?.getData("text/plain")
      .replace(/\D/g, "")
      .split("")
      .slice(0, props.digits - index)

    if (pasteData) {
      pasteData.forEach((char, i) => {
        codes.value[index + i] = char
      })
      focusInput(Math.min(index + pasteData.length, props.digits - 1))
    }
  } catch (e) {
    console.error("Error handling paste:", e)
    focusInput(0)
  }
}

function reset() {
  codes.value.forEach((_, index) => {
    codes.value[index] = ""
  })
  nextTick(() => focusInput(0))
}

function handleFocus(event: FocusEvent) {
  const input = event.target as HTMLInputElement
  input?.select()
}

watch(codes.value, (newCodes) => {
  const isFilled = newCodes.every((code) => code !== "") && newCodes.length === props.digits

  if (isFilled) {
    emit("verify", newCodes.join(""))
    if (props.clearOnVerify) reset()
  }
})

onMounted(() => focusInput(0))

defineExpose({
  reset,
})
</script>

<template>
  <div :class="containerClass">
    <input
      v-for="(_, index) in digits"
      ref="inputRefs"
      :key="index"
      v-model="codes[index]"
      type="text"
      inputmode="numeric"
      :class="inputClass"
      :disabled="disabled"
      maxlength="1"
      pattern="\d"
      @input="handleInput($event, index)"
      @keydown="handleKeydown($event, index)"
      @paste="handlePaste($event, index)"
      @keydown.left="focusInput(index - 1)"
      @keydown.right="focusInput(index + 1)"
      @focus="handleFocus"
    />
  </div>
</template>
