<script setup lang="ts">
import AppLayout from "@/ui/common/AppLayout.vue"
import BaseCard from "@/ui/common/base/BaseCard.vue"
import LoginForm from "@/ui/features/auth/LoginForm.vue"
import Header from "@/ui/sections/Header.vue"
</script>

<template>
  <AppLayout>
    <template #header>
      <Header />
    </template>

    <template #start>
      <BaseCard class="h-32">Left Top Section</BaseCard>
      <BaseCard class="flex-1">Left Main Content</BaseCard>
    </template>

    <template #middle>
      <BaseCard class="flex-1">Center Main Content</BaseCard>
      <BaseCard class="h-32">Center Bottom Section</BaseCard>
    </template>

    <template #end>
      <BaseCard>
        <LoginForm />
      </BaseCard>
    </template>
  </AppLayout>
</template>
