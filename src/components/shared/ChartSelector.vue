<template>
  <div class="chart-selector">
    <a-button
      v-for="chart in charts"
      :key="chart.key"
      :type="isActive(chart.key) ? 'primary' : 'default'"
      @click="selectChart(chart.key)"
      class="chart-btn"
    >
      <component :is="chart.icon" />
      {{ chart.label }}
    </a-button>
  </div>
</template>

<script setup lang="ts" generic="T extends string">
import type { ChartType } from '@/views/AdvancedAnalytics/composables'

interface Props {
  charts: ChartType<T>[]
  modelValue: T
}

interface Emits {
  (e: 'update:modelValue', value: T): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const selectChart = (key: T) => {
  emit('update:modelValue', key)
}

const isActive = (key: T): boolean => {
  return props.modelValue === key
}
</script>

<style scoped>
.chart-selector {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.chart-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.chart-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .chart-selector {
    padding: 12px;
    gap: 8px;
  }

  .chart-btn {
    flex: 1 1 auto;
    min-width: calc(50% - 4px);
    justify-content: center;
  }
}
</style>
