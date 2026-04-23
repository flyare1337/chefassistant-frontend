<script setup lang="ts">
import { ref, onUnmounted, nextTick } from 'vue'
import { Chart, registerables } from 'chart.js'
import { APIRequest } from "@/utils/http.ts"
import { PhBinoculars, PhCalendarPlus, PhCalendarX, PhMagnifyingGlass } from "@phosphor-icons/vue"
import type { AnalyticsData } from "@/utils/types.ts"

Chart.register(...registerables)

const focusStartDate = ref(false)
const focusEndDate = ref(false)
const dateStart = ref('')
const dateEnd = ref('')
let chartInstance: Chart | null = null

function destroyChart() {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
}

function renderChart(adata: AnalyticsData) {
  destroyChart()

  const labels: string[] = []
  const usedData: number[] = []
  const addedData: number[] = []
  const expiredData: number[] = []

  for (const val of adata.days) {
    const d = new Date(val.date)
    const formatted = d.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
    labels.push(formatted)
    usedData.push(val.used)
    addedData.push(val.added)
    expiredData.push(val.expired)
  }

  const canvas = document.getElementById('curve_chart') as HTMLCanvasElement | null
  if (!canvas) return

  chartInstance = new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Использовано',
          data: usedData,
          borderColor: '#0b73c4',
          backgroundColor: 'transparent',
          pointBackgroundColor: '#0b73c4',
          tension: 0.3
        },
        {
          label: 'Добавлено',
          data: addedData,
          borderColor: '#3dc94a',
          backgroundColor: 'transparent',
          pointBackgroundColor: '#3dc94a',
          tension: 0.3
        },
        {
          label: 'Просрочено',
          data: expiredData,
          borderColor: '#ff3b3b',
          backgroundColor: 'transparent',
          pointBackgroundColor: '#ff3b3b',
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          align: 'center',
          labels: {
            font: {
              size: 20
            }
          }
        },
        tooltip: {}
      },
      scales: {
        x: {
          grid: {
            color: '#FFBD88'
          }
        },
        y: {
          grid: {
            color: '#FFBD88'
          },
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  })
}

async function onSearchClicked() {
  if (!dateStart.value || !dateEnd.value) {
    return
  }

  const data = await APIRequest('/analytics/get', 'GET', {
    start_date: dateStart.value,
    end_date: dateEnd.value,
  }, {}, true)

  if (data.status === 200) {
    console.log(data.json)
    await nextTick()
    renderChart(data.json as AnalyticsData)
  }
}

onUnmounted(() => {
  destroyChart()
})
</script>

<template>
  <div class="chart">
    <div class="chart-options">
      <div class="chart-options-date" :class="{focus: focusStartDate}">
        <input v-model="dateStart" type="date" class="chart-options-date-input" placeholder="Начните поиск" @focus="focusStartDate = true" @blur="focusStartDate = false" />
      </div>
      <div class="chart-options-separator">—</div>
      <div class="chart-options-date" :class="{focus: focusEndDate}">
        <input v-model="dateEnd" type="date" class="chart-options-date-input" placeholder="Начните поиск" @focus="focusEndDate = true" @blur="focusEndDate = false" />
      </div>
      <button class="chart-options-button transparent" @click="onSearchClicked()">
        <PhMagnifyingGlass :size="26"></PhMagnifyingGlass>
      </button>
    </div>
    <div class="chart-wrapper" style="height: auto">
      <canvas id="curve_chart" style="width: 1200px; height: 550px"></canvas>
    </div>
  </div>
</template>

<style scoped lang="scss">
.chart {
  width: 100%;

  &-wrapper {
    display: block;
    overflow-x: scroll;
    overflow-y: initial;
    scrollbar-width: none;
    width: 100%;
  }

  &-options {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0 20px;

    @media (max-width: 670px) {
      flex-direction: column;
      gap: 15px 0;
    }

    &-separator {
      @media (max-width: 670px) {
        display: none;
      }
    }

    &-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 45.2px;
      height: 45.2px;
      border-radius: 7px;
      transition: .125s ease-in-out;
      cursor: pointer;

      &.transparent {
        border: 1px solid rgba(255, 140, 48, 0.25);
        background: rgba(255, 140, 48, 0.2);

        &:hover {
          background: rgba(255, 140, 48, 0.25);
        }

        @media (max-width: 670px) {
          width: 100%;
        }
      }
    }

    &-date {
      display: flex;
      align-items: center;
      gap: 0 10px;
      background: #f3ceac;
      border: 1px solid #ffbd73;
      padding: 0 10px;
      font-weight: 200;
      border-radius: 0.5rem;
      outline: 0;
      transition: border, background 0.25s ease;

      @media (max-width: 670px) {
        width: 100%;
      }

      &:hover {
        border: 1px solid #fca952;
      }

      &.focus {
        border: 1px solid #fd9a2f;
        background: #fcc697;
      }

      &-input {
        padding: 10px;
        background: 0;
        border: 0;
        outline: 0;
        user-select: none;

        @media (max-width: 670px) {
          width: 100%;
        }
      }
    }
  }
}
</style>