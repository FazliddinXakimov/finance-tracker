<template>
  <Suspense>
    <template #default>
      <AnalyticsChart />
    </template>
    <template #fallback>
      <LoadingSpinner message="Загрузка графиков..." />
    </template>
  </Suspense>
</template>

<script setup lang="ts">
import AnalyticsChart from './components/AnalyticsChart.vue'
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'
</script>
