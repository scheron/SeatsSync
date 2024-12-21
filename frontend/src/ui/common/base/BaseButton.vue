<script setup lang="ts">
import {computed} from "vue"
import {cn, defineVariant} from "@/utils/tailwindcss"
import {Tooltip} from "floating-vue"
import BaseIcon from "./BaseIcon.vue"
import BaseSpinner from "./BaseSpinner.vue"

import type {IconName} from "@/types/icons"
import type {VariantProps} from "@/utils/tailwindcss"
import type {Placement} from "floating-vue"
import type {HTMLAttributes} from "vue"

const buttonVariant = defineVariant({
  baseClass:
    "outline-none gap-2 focus-visible:outline-none text-sm flex items-center justify-center relative transition-colors text-content-1 disabled:pointer-event-none cursor-pointer relative flex w-fit items-center justify-center p-1 rounded-md  border border-transparent bg-transparent transition-all hover:bg-base-1 disabled:border-outline-1 disabled:bg-base-1",
  variants: {
    variant: {
      ghost: "hover:text-content-1 bg-base-1/80 text-content-2   focus-visible:border-accent hover:bg-base-1 dark:hover:bg-base-1/60",
      primary:
        "flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 active:bg-blue-800  focus-visible:border-content-1",
      flat: "cursor-pointer text-content-2  focus-visible:border-accent hover:bg-base-1 disabled:cursor-auto dark:hover:bg-base-1/60 hover:text-content-1 bg-transparent focus-visible:border-accent disabled:bg-transparent disabled:border-transparent",
    },
    disabled:
      "disabled:opacity-50 dark:hover:bg-base-4 disabled:bg-base-4/30 dark:disabled:bg-base-4 disabled:text-content-4 border-outline-1  hover:text-content-4 hover:border-transparent hover:bg-base-4",
    loading: "",
  },
  defaultVariants: {
    variant: "ghost",
  },
})

type Props = {
  type?: "button" | "submit" | "reset"
  variant?: VariantProps<typeof buttonVariant>["variant"]
  color?: "default" | "positive" | "negative"
  class?: HTMLAttributes["class"]
  classIcon?: HTMLAttributes["class"]
  icon?: IconName
  tooltip?: string
  tooltipPosition?: Placement
  disabled?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: "ghost",
  disabled: false,
  loading: false,
  class: "",
  iconClass: "",
  tooltipPosition: "top",
})

const buttonClasses = computed(() => cn(buttonVariant(props).value, props.class))
const isButtonDisabled = computed(() => props.disabled || props.loading)
</script>

<template>
  <button v-tooltip="{content: tooltip, placement: tooltipPosition}" :class="buttonClasses" :disabled="isButtonDisabled" :type="type">
    <template v-if="$slots.tooltip">
      <Tooltip>
        <template #popper>
          <slot name="tooltip" />
          {{ tooltip }}
        </template>
      </Tooltip>
    </template>

    <BaseSpinner v-if="loading" :class="classIcon" />

    <template v-else>
      <BaseIcon v-if="props.icon" :class="classIcon" :name="props.icon" />

      <slot />
    </template>
  </button>
</template>
