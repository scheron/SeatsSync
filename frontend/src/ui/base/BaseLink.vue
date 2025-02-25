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

const linkVariant = defineVariant({
  baseClass:
    "outline-none gap-2 focus-visible:outline-none text-sm flex items-center justify-center relative transition-colors disabled:pointer-event-none disabled:cursor-auto cursor-pointer relative flex w-fit items-center justify-center p-1 rounded-md border border-transparent bg-transparent transition-all",
  variants: {
    variant: {
      primary: "hover:text-content text-content/60 focus-visible:border-accent",
      accent:
        "flex w-full justify-center rounded-lg bg-primary-800 px-4 py-2 text-sm font-medium text-white hover:bg-accent active:bg-primary-800 focus-visible:bg-accent focus-visible:border-tint",
    },
    disabled: "opacity-50 border-none hover:text-content/80 text-content/80 pointer-events-none",
    loading: "",
  },
  defaultVariants: {
    variant: "primary",
  },
})

type Props = {
  to: string
  variant?: VariantProps<typeof linkVariant>["variant"]
  class?: HTMLAttributes["class"]
  classIcon?: HTMLAttributes["class"]
  icon?: IconName
  tooltip?: string
  tooltipPosition?: Placement
  disabled?: boolean
  loading?: boolean
  external?: boolean
  target?: "_blank" | "_self" | "_parent" | "_top"
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  disabled: false,
  loading: false,
  class: "",
  iconClass: "",
  tooltipPosition: "top",
  external: false,
  target: "_self",
})

const linkClasses = computed(() =>
  cn(
    linkVariant({
      variant: props.variant,
      disabled: props.disabled,
    }).value,
    props.class,
  ),
)
</script>

<template>
  <a v-tooltip="{content: tooltip, placement: tooltipPosition}" :class="linkClasses" :href="to" target="_blank" rel="noopener noreferrer">
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
      <BaseIcon v-if="icon" :class="classIcon" :name="icon" />

      <slot />
    </template>
  </a>
</template>
