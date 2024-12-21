import {containerVariants, sizesVariants} from "./variants"

import type {IconName} from "@/types/icons"
import type {VariantProps} from "@/utils/tailwindcss"

export type Props = {
  id?: string
  label?: string
  modelValue?: string | number
  type?: string
  placeholder?: string
  maxlength?: number
  disabled?: boolean
  invalid?: boolean
  iconAfter?: IconName
  iconBefore?: IconName
  size?: VariantProps<typeof sizesVariants>["size"]
  variant?: VariantProps<typeof containerVariants>["variant"]
}

export type Emits = {
  "update:modelValue": [string | number]
  input: [Event]
  focus: [Event]
  blur: [Event]
}
