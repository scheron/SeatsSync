<script setup lang="ts">
import {onMounted} from "vue"
import {useRouter} from "vue-router"
import BaseCard from "@/ui/base/BaseCard.vue"
import AppLayout from "@/ui/layouts/AppLayout.vue"
import Hall from "@/ui/sections/Hall"
import HallList from "@/ui/sections/HallList/HallList.vue"
import Header from "@/ui/sections/Header.vue"

// const router = useRouter()

onMounted(() => {
  //   router.routerLoaded()
})
</script>

<template>
  <AppLayout>
    <template #header>
      <Header />
    </template>
    <template #left>
      <BaseCard class="flex-1">
        <Hall />
      </BaseCard>
    </template>
    <template #right>
      <BaseCard class="flex-1">
        <HallList />
      </BaseCard>
    </template>
  </AppLayout>
</template>
