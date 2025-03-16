<script setup lang="ts">
import {Dropdown} from "floating-vue"

import type {Placement} from "floating-vue"

withDefaults(defineProps<{placement?: Placement}>(), {
  placement: "bottom-start",
})
</script>

<template>
  <Dropdown :distance="15" :placement="placement" :arrow-padding="10" :triggers="['click']" :hide-triggers="['click']">
    <template #default="defaultProps">
      <slot name="trigger" v-bind="defaultProps" />
    </template>

    <template #popper="popperProps">
      <slot name="content" v-bind="popperProps" />
    </template>
  </Dropdown>
</template>
