<script setup lang="ts">
import HallScheme from "@/ui/widgets/HallScheme"
import HallSelection from "@/ui/widgets/HallSelection"
import HallStats from "@/ui/widgets/HallStats"
</script>

<template>
  <section class="text-content flex size-full flex-col gap-3 p-3">
    <HallSelection />

    <div class="flex-1 grid grid-cols-[500px_1fr] gap-3 overflow-auto">
      <HallStats />
      <HallScheme />
    </div>
  </section>
</template>
