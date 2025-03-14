<script setup lang="ts">
import {defineVariant} from "@/utils/tailwindcss"

const props = withDefaults(defineProps<{disabled?: boolean; modelValue: boolean; size?: "xs" | "sm" | "md" | "lg" | "xl"}>(), {
  size: "md",
  disabled: false,
})

defineEmits<{"update:modelValue": [boolean]}>()

const value = defineModel<boolean>({default: false})

const checkboxVariants = defineVariant({
  baseClass: "relative flex items-center justify-center rounded-md border-2 shadow-sm transition-all duration-200",
  variants: {
    size: {
      xs: "size-3 rounded-sm border",
      sm: "size-4 rounded-md border",
      md: "size-5 rounded-md border",
      lg: "size-6 rounded-lg border-2",
      xl: "size-8 rounded-lg border-2",
    },
    disabled:
      "relative flex items-center justify-center border-outline-1 bg-base-1 cursor-not-allowed group-hover:border-outline-1 peer-checked:border-blue-500 peer-checked:bg-blue-700",
  },
  defaultVariants: {
    size: "md",
  },
})
const checkboxClass = checkboxVariants(props)
</script>

<template>
  <label class="group flex h-full cursor-pointer items-center gap-2">
    <!-- @vue-ignore -->
    <input class="peer hidden" type="checkbox" :checked="value" :disabled="disabled" @change="value = $event.target.checked" />

    <span
      class="border-outline-1 bg-base-1 group-hover:border-content-1 relative flex items-center justify-center shadow-sm transition-all duration-200 peer-checked:border-blue-500 peer-checked:bg-blue-700"
      :class="checkboxClass"
    >
      <svg
        fill="currentColor"
        viewBox="0 0 20 20"
        class="hidden size-3 scale-50 transition-transform duration-200 peer-checked:block peer-checked:scale-100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          clip-rule="evenodd"
          d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
          fill-rule="evenodd"
        ></path>
      </svg>
    </span>

    <span class="flex-1">
      <slot />
    </span>
  </label>
</template>
