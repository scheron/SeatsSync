<script setup lang="ts">
import {computed} from "vue"
import {Tooltip} from "floating-vue"
import {cn, defineVariant} from "@/utils/tailwindcss"
import BaseIcon from "./BaseIcon.vue"
import BaseSpinner from "./BaseSpinner.vue"

import type {IconName} from "@/types/icons"
import type {VariantProps} from "@/utils/tailwindcss"
import type {Placement} from "floating-vue"
import type {HTMLAttributes} from "vue"

const buttonVariant = defineVariant({
  baseClass:
    "outline-none gap-2 focus-visible:outline-none flex items-center justify-center relative transition-colors disabled:pointer-event-none disabled:cursor-auto cursor-pointer relative flex items-center justify-center rounded-md  border border-transparent bg-transparent transition-all",
  variants: {
    variant: {
      primary: "hover:text-content text-content/60  focus-visible:border-accent",
      accent:
        "flex justify-center rounded-lg bg-primary-800  text-white hover:bg-accent active:bg-primary-800  focus-visible:bg-accent focus-visible:border-tint",
      outline:
        "flex justify-center rounded-lg border border-primary-800/70 text-primary-800/70 hover:border-primary-800 hover:text-primary-800 active:border-primary-800  focus-visible:border-primary-800 focus-visible:text-primary-800",
    },
    disabled: "disabled:opacity-50 border-none  hover:text-content/80 text-content/80",
    loading: "",
  },
  defaultVariants: {
    variant: "primary",
  },
})

const buttonSize = defineVariant({
  baseClass: "size-auto",
  variants: {
    size: {
      sm: "px-5 py-2 text-sm",
      md: "px-5 py-2",
      lg: "px-7 py-3 text-lg",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

type Props = {
  type?: "button" | "submit" | "reset"
  variant?: VariantProps<typeof buttonVariant>["variant"]
  size?: VariantProps<typeof buttonSize>["size"]
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
  variant: "primary",
  disabled: false,
  loading: false,
  class: "",
  classIcon: "",
  tooltipPosition: "top",
})

const buttonClasses = computed(() => cn(buttonVariant(props).value, buttonSize(props).value, props.class))
const iconClasses = computed(() => cn("size-4 shrink-0", props.classIcon))
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

    <BaseSpinner v-if="loading" :class="iconClasses" />

    <template v-else>
      <BaseIcon v-if="props.icon" :class="iconClasses" :name="props.icon" />

      <slot />
    </template>
  </button>
</template>
