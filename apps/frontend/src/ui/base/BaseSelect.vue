<script setup lang="ts" generic="T">
import BaseIcon from "@/ui/base/BaseIcon.vue"

import type {IconName} from "@/types/icons"

const props = withDefaults(
  defineProps<{
    modelValue: string | number | Array<any> | Record<string, any>
    iconBefore?: IconName
    options: Array<T>
    optionLabel?: string
    optionValue?: string
    placeholder?: string
    isDisabled?: boolean
  }>(),
  {
    options: () => [],
    optionLabel: "name",
    optionValue: "id",
  },
)

const emit = defineEmits<{
  "update:modelValue": [T]
}>()

function getValue(option: any): any {
  return typeof option === "object" ? option?.[props.optionValue] : option
}

function getLabel(option: any): string {
  return typeof option === "object" ? option?.[props.optionLabel] : String(option)
}

function onChange(event: Event) {
  const selectEl = event.target as HTMLSelectElement
  const value = selectEl.value

  const selectedOption = props.options.find((opt) => String(getValue(opt)) === value)
  emit("update:modelValue", selectedOption ?? (value as T))
}
</script>

<template>
  <label
    class="focus:border-primary relative flex w-full items-center gap-2 rounded-md border-none bg-transparent px-2 outline-none disabled:opacity-50"
  >
    <BaseIcon v-if="iconBefore" :name="iconBefore" class="size-5" />

    <select
      :value="typeof modelValue === 'object' ? getValue(modelValue) : modelValue"
      @change="onChange"
      :disabled="isDisabled"
      class="outline-none focus:outline-none"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option v-for="option in options" :key="getValue(option)" :value="getValue(option)">
        {{ getLabel(option) }}
      </option>
    </select>
  </label>
</template>

<style scoped>
select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

select:disabled {
  cursor: not-allowed;
}
</style>
