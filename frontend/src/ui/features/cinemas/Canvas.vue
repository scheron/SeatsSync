<script setup lang="ts">
import {onMounted, ref} from "vue"
import hall from "./hall.json"

const canvasRef = ref<HTMLCanvasElement | null>(null)

function drawSeats(ctx: CanvasRenderingContext2D) {
  console.log(hall.seats)

  //   hall.seats.forEach((seat) => {
  //     ctx.fillStyle = seat.status === "free" ? "#4CAF50" : "#FF5733"

  //     ctx.fillRect(seat.x, seat.y, seat.width, seat.height)

  //     ctx.strokeStyle = "red"
  //     ctx.lineWidth = 2
  //     ctx.strokeRect(seat.x, seat.y, seat.width, seat.height)

  //     ctx.fillStyle = "#FFF"
  //     ctx.font = "12px sans-serif"
  //     ctx.textAlign = "center"
  //     ctx.fillText(`${seat.row}-${seat.place}`, seat.x + seat.width / 2, seat.y + seat.height / 2 + 5)
  //   })
}

function drawHall() {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext("2d")
  if (!ctx) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawSeats(ctx)
}

onMounted(() => {
  drawHall()
})
</script>
<template>
  <div class="hall-container">
    <canvas ref="canvasRef" width="500" height="380"></canvas>
  </div>
</template>

<style scoped>
.hall-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  border-radius: 10px;
}
canvas {
  border: 1px solid hsl(var(--color-content));
}
</style>
