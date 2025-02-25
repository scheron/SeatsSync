<script setup lang="ts">
import {computed, ref} from "vue"
import {toastsController} from "../model/ToastsController"
import ToastsLiteItem from "./ToastsLiteItem.vue"

const items = computed(() => Array.from(toastsController.toasts.values()))
const position = computed(() => (items.value.length ? items.value[0].position : "top-center"))
const toastRefs = ref<InstanceType<typeof ToastsLiteItem>[]>([])

function onMouseEnter() {
  toastRefs.value.forEach((toast) => toast?.pause())
}

function onMouseLeave() {
  toastRefs.value.forEach((toast) => toast?.resume())
}
</script>

<template>
  <Teleport to="body">
    <div :class="['toasts-lite__toast-container', `toasts-lite__${position}`]" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
      <transition-group name="toasts-lite">
        <ToastsLiteItem
          v-for="item in items"
          :id="item.id"
          ref="toastRefs"
          :key="item.id"
          :type="item.type"
          :message="item.message"
          :auto-close="item.autoClose"
          :duration="item.duration"
          :position="item.position"
          @close="toastsController.remove(item.id)"
        />
      </transition-group>
    </div>
  </Teleport>
</template>

<style src="../styles/index.css" />
