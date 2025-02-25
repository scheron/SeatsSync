<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: string | number | Array<any> | Record<string, any>
    options: Array<any>
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
  "update:modelValue": [typeof props.modelValue]
}>()

function getValue(option: any): any {
  return typeof option === "object" ? option[props.optionValue] : option
}

function getLabel(option: any): string {
  return typeof option === "object" ? option[props.optionLabel] : String(option)
}

function onChange(event: Event) {
  const selectEl = event.target as HTMLSelectElement
  const value = selectEl.value

  const selectedOption = props.options.find((opt) => String(getValue(opt)) === value)
  emit("update:modelValue", selectedOption ?? value)
}
</script>

<template>
  <select
    :value="typeof modelValue === 'object' ? getValue(modelValue) : modelValue"
    @change="onChange"
    :disabled="isDisabled"
    class="border-content/20 focus:border-primary w-full rounded-md border bg-transparent px-3 py-1.5 text-base font-medium outline-none disabled:opacity-50"
  >
    <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
    <option v-for="option in options" :key="getValue(option)" :value="getValue(option)">
      {{ getLabel(option) }}
    </option>
  </select>
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
