<script setup lang="ts">
import {computed} from "vue"

type Name = "fade" | "fadeOut" | "slide" | "slideUp" | "slideDown" | "bounce" | "scale"

const props = withDefaults(
  defineProps<{
    name: Name
    group?: boolean
    mode?: "in-out" | "out-in" | "default"
    duration?: number
  }>(),
  {
    mode: "default",
    duration: 100,
  },
)

const TRANSITION_CLASSES: Record<Name, Partial<{enterFrom: string; leaveTo: string; enterActive: string; leaveActive: string}>> = {
  fade: {
    enterFrom: "opacity-0",
    leaveTo: "opacity-0",
    enterActive: `transition duration-${props.duration}`,
    leaveActive: `transition duration-${props.duration}`,
  },
  fadeOut: {
    leaveTo: "opacity-0",
    leaveActive: `transition duration-${props.duration}`,
  },
  slide: {
    enterFrom: "translate-x-[150%] opacity-0",
    leaveTo: "translate-x-[150%] opacity-0",
    enterActive: `transition duration-${props.duration}`,
    leaveActive: `transition duration-${props.duration}`,
  },
  slideUp: {
    enterFrom: "translate-y-full opacity-0",
    leaveTo: "translate-y-full opacity-0",
    enterActive: `transition duration-${props.duration}`,
    leaveActive: `transition duration-${props.duration}`,
  },
  slideDown: {
    enterFrom: "-translate-y-full opacity-0",
    leaveTo: "-translate-y-full opacity-0",
    enterActive: `transition duration-${props.duration}`,
    leaveActive: `transition duration-${props.duration}`,
  },
  bounce: {
    enterFrom: "scale-90 opacity-0",
    leaveTo: "scale-90 opacity-0",
    enterActive: `transition duration-${props.duration} ease-out transform`,
    leaveActive: `transition duration-${props.duration} ease-in transform`,
  },
  scale: {
    enterFrom: "scale-75 opacity-0",
    leaveTo: "scale-75 opacity-0",
    enterActive: `transition duration-${props.duration} ease-out transform`,
    leaveActive: `transition duration-${props.duration} ease-in transform`,
  },
}

const transitionClasses = computed(() => TRANSITION_CLASSES[props.name] ?? TRANSITION_CLASSES.fade)
</script>

<template>
  <TransitionGroup
    v-if="props.group"
    :enter-from-class="transitionClasses.enterFrom"
    :leave-to-class="transitionClasses.leaveTo"
    :enter-active-class="transitionClasses.enterActive"
    :leave-active-class="transitionClasses.leaveActive"
  >
    <slot />
  </TransitionGroup>

  <Transition
    v-else
    :enter-from-class="transitionClasses.enterFrom"
    :leave-to-class="transitionClasses.leaveTo"
    :enter-active-class="transitionClasses.enterActive"
    :leave-active-class="transitionClasses.leaveActive"
    :mode="mode"
  >
    <slot />
  </Transition>
</template>
