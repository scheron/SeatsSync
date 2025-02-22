<script setup lang="ts">
import {onMounted, ref} from "vue"
import hall from "./hall.json"
import {calculateHallSize, createSeatsSchema, getSeatPlaceChar} from "./utils"

const seatsSchema = createSeatsSchema(hall.seats)
const {width, height} = calculateHallSize(hall.seats)

const hoveredSeat = ref<{row: number; place: number} | null>(null)

function onRowMouseMove(e: MouseEvent) {
  const seatEl = (e.target as HTMLElement).closest("[data-seat]") as HTMLElement

  if (seatEl) {
    const seatRow = Number(seatEl.dataset.row)
    const seatPlace = Number(seatEl.dataset.place)
    hoveredSeat.value = {row: seatRow, place: seatPlace}
  } else {
    hoveredSeat.value = null
  }
}

function onRowMouseLeave() {
  hoveredSeat.value = null
}
</script>
<template>
  <div class="flex size-full items-center justify-center">
    <div class="perspective-distant flex w-fit flex-col items-center justify-center">
      <div class="screen rounded-sm"></div>

      <div class="relative mt-6 gap-1" :style="{width: width + 'px', height: height + 'px'}">
        <div
          v-for="(row, rowIndex) in seatsSchema"
          :key="rowIndex"
          class="row"
          :data-row="row[0].row"
          @mousemove="onRowMouseMove"
          @mouseleave="onRowMouseLeave"
        >
          <div
            v-for="seat in row"
            :key="seat.id"
            class="absolute flex items-center justify-center rounded-md bg-[#444451]"
            :style="{
              width: seat.width + 'px',
              height: seat.height + 'px',
              left: seat.x + 'px',
              top: seat.y + 'px',
            }"
            data-seat
            :data-row="seat.row"
            :data-place="seat.place"
          >
            <span
              class="pointer-events-none flex cursor-default items-center justify-center transition-opacity duration-200"
              :class="{
                'opacity-100': hoveredSeat?.row === seat.row && hoveredSeat?.place === seat.place,
                'opacity-0': !(hoveredSeat?.row === seat.row && hoveredSeat?.place === seat.place),
              }"
            >
              {{ seat.place }}
            </span>
          </div>
        </div>

        <span
          v-for="(row, rowIndex) in seatsSchema"
          :key="rowIndex"
          class="absolute transition-colors duration-200"
          :class="{
            'font-bold text-white': hoveredSeat?.row === row[0].row,
            'text-white/50': hoveredSeat?.row !== row[0].row,
          }"
          :style="{
            left: '-30px',
            top: row[0].y + row[0].height / 2 + 'px',
            transform: 'translateY(-50%)',
          }"
        >
          {{ getSeatPlaceChar(rowIndex) }}
        </span>

        <span
          v-for="(row, rowIndex) in seatsSchema"
          :key="rowIndex"
          class="absolute transition-colors duration-200"
          :class="{
            'font-bold text-white': hoveredSeat?.row === row[0].row,
            'text-white/50': hoveredSeat?.row !== row[0].row,
          }"
          :style="{
            right: '-30px',
            top: row[0].y + row[0].height / 2 + 'px',
            transform: 'translateY(-50%)',
          }"
        >
          {{ getSeatPlaceChar(rowIndex) }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.seat {
  background-color: #444451;
  height: 30px;
  width: 30px;
  margin: 3px;
  border-radius: 5px;
}

.seat-double {
  background-color: #444451;
  height: 30px;
  width: 66px;
  margin: 3px;
  border-radius: 5px;
}

.seat.selected {
  background-color: #6feaf6;
}

.seat.occupied {
  background-color: #fff;
}

.seat:not(.occupied):hover {
  cursor: pointer;
  transform: scale(1.2);
}

.showcase .seat:not(.occupied):hover {
  cursor: default;
  transform: scale(1.2);
}

.showcase {
  background: rgba(0, 0, 0, 0.1);
  padding: 5px 10px;
  border-radius: 5px;
  color: #777;
  list-style-type: none;
  display: flex;
  justify-content: space-between;
}

.showcase li {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 10px;
}

.showcase li small {
  margin-left: 2px;
}

.screen {
  background-color: #fff;
  height: 70px;
  width: 100%;
  transform: rotateX(-45deg);
  box-shadow: 0 3px 10px rgba(255, 255, 255, 0.7);
}

.row {
  display: flex;
}

.text {
  margin: 5px 0;
}

.text span {
  color: #6feaf6;
}
</style>
