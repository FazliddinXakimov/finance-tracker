<template>
  <Suspense>
    <template #default>
      <AdvancedAnalytics />
    </template>
    <template #fallback>
      <LoadingSpinner message="Загрузка расширенной аналитики..." />
    </template>
  </Suspense>
</template>

<script setup lang="ts">
import AdvancedAnalytics from './components/AdvancedAnalytics.vue'
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'
</script>
