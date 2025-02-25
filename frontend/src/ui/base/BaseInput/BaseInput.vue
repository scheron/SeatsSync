<script lang="ts" setup>
import BaseIcon from "@/ui/base/BaseIcon.vue"
import {containerVariants, inputVariants, sizesVariants} from "./variants"

import type {Emits, Props} from "./types"

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  type: "text",
  placeholder: "",
  disabled: false,
  invalid: false,
  variant: "primary",
  size: "md",
})

const emit = defineEmits<Emits>()

const value = defineModel<Props["modelValue"]>({default: ""})

const containerClass = containerVariants(props)
const inputClass = inputVariants(props)
const sizeClass = sizesVariants(props)
</script>

<template>
  <label class="flex w-full flex-col gap-1" :class="$attrs.class">
    <span v-if="label" class="text-content/60 block text-sm font-medium"> {{ label }} </span>

    <div :class="[containerClass, sizeClass]">
      <slot name="before">
        <BaseIcon v-if="iconBefore" :name="iconBefore" class="!size-4" />
      </slot>

      <input
        :id="id"
        v-bind="$attrs"
        v-model="value"
        :type="type"
        :disabled="disabled"
        :placeholder="placeholder"
        :maxlength="maxlength"
        :class="inputClass"
        @input="emit('input', $event)"
        @focus="emit('focus', $event)"
        @blur="emit('blur', $event)"
      />

      <slot name="after">
        <BaseIcon v-if="iconAfter" :name="iconAfter" class="!size-4" />
      </slot>
    </div>
  </label>
</template>
