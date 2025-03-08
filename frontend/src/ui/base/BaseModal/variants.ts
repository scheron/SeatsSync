import {defineVariant} from "@/utils/tailwindcss"

import type {VariantProps} from "@/utils/tailwindcss"

export const containerVariants = defineVariant({
  baseClass: "flex max-h-full max-w-full",
  variants: {
    position: {
      center: "items-center",
      top: "items-start",
      bottom: "items-end",
    },
    align: {
      center: "justify-center",
      left: "justify-start",
      right: "justify-end",
    },
  },
  defaultVariants: {
    position: "center",
    align: "center",
  },
})

export const contentVariants = defineVariant({
  baseClass: "relative rounded-lg bg-primary-100 shadow-lg overflow-hidden max-h-full max-w-full flex flex-col items-center justify-center",
  variants: {
    fullscreen: "size-full rounded-none",
  },
})

export type ModalVariantProps = {
  position?: VariantProps<typeof containerVariants>["position"]
  align?: VariantProps<typeof containerVariants>["align"]
}
