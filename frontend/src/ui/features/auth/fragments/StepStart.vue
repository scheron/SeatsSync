<script setup lang="ts">
import {ref} from "vue"
import BaseButton from "@/ui/common/base/BaseButton.vue"
import BaseInput from "@/ui/common/base/BaseInput"
import AuthFormLayout from "@/ui/layouts/AuthFormLayout.vue"

const emit = defineEmits<{submit: [string]}>()

const username = ref("")
</script>

<template>
  <AuthFormLayout desc="For enter to the system, you need the authenticator application">
    <BaseInput v-model="username" label="Username" placeholder="Enter username" />
    <BaseButton variant="accent" class="mt-2" @click="emit('submit', username)">Enter</BaseButton>
  </AuthFormLayout>
</template>
