<script setup lang="ts">
import hall from "./hall.json"
import SeatsScheme from "./SeatsScheme.vue"
</script>

<template>
  <div>
    <ul class="border-content/20 mb-4 flex items-center justify-center gap-8 rounded-md border-b p-2 pb-4">
      <li class="flex items-center gap-2">
        <div class="bg-content/50 size-5 rounded-md"></div>
        N/A
      </li>
      <li class="flex items-center gap-2">
        <div class="bg-accent size-5 rounded-md"></div>
        Selected
      </li>
      <li class="flex items-center gap-2">
        <div class="bg-content/20 size-5 rounded-md"></div>
        Occupied
      </li>
    </ul>

    <SeatsScheme :seats="hall.seats" />
  </div>
</template>
