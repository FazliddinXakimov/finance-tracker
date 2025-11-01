<template>
  <Suspense>
    <template #default>
      <a-space direction="vertical" :size="24" class="dashboard-container">
        <BalancePanel />
        <TransactionList />
      </a-space>
    </template>
    <template #fallback>
      <LoadingSpinner message="Загрузка дашборда..." />
    </template>
  </Suspense>
</template>

<script setup lang="ts">
import BalancePanel from './components/BalancePanel.vue'
import TransactionList from './components/TransactionList.vue'
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'
</script>

<style scoped>
.dashboard-container {
  width: 100%;
}
</style>
