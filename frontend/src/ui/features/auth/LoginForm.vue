<script setup lang="ts">
import BaseButton from "@/ui/common/base/BaseButton.vue"
import BaseInput from "@/ui/common/base/BaseInput"

// No additional script needed
</script>

<template>
  <div class="flex flex-col items-center justify-center bg-black p-4 text-white">
    <div class="w-full max-w-sm space-y-4">
      <BaseInput label="Username" placeholder="Enter username" />
      <BaseInput label="2FA-Key" placeholder="Enter 6 digits 2FA-Key" />

      <div class="mt-4 flex justify-between text-sm">
        <BaseButton icon="key" class="flex flex-col"> Backup? </BaseButton>
        <BaseButton icon="register" class="flex flex-col"> First time? </BaseButton>
      </div>

      <BaseButton variant="primary">Login</BaseButton>
    </div>
  </div>
</template>

<style>
/* Add custom styles here if necessary */
</style>
