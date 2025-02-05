<script setup lang="ts">
import BaseButton from "@/ui/common/base/BaseButton.vue"
import {useWebSocket} from "@/composables/useWebSocket"

const {send} = useWebSocket()

async function getCinemas() {
  const response = await send({
    type: "cinema.get_cinemas",
    data: {},
  })

  console.log(response)
}
</script>

<template>
  <div>
    <h1>Cinemas</h1>
    <BaseButton @click="getCinemas">Get cinemas</BaseButton>
  </div>
</template>
