<template>
  <a-config-provider :locale="ruRU">
    <div id="app">
      <a-layout class="layout">
        <a-layout-header class="header">
          <div class="header-content">
            <h1 class="title">
              <WalletOutlined />
              Трекер Финансов
            </h1>
            <ImportExport />
          </div>
        </a-layout-header>

        <a-layout-content class="content">
          <div class="container">
            <a-tabs :active-key="activeTab" type="card" @change="handleTabChange">
              <a-tab-pane key="dashboard">
                <template #tab>
                  <DashboardOutlined />
                  Дашборд
                </template>
              </a-tab-pane>

              <a-tab-pane key="analytics">
                <template #tab>
                  <BarChartOutlined />
                  Базовая аналитика
                </template>
              </a-tab-pane>

              <a-tab-pane key="advanced">
                <template #tab>
                  <FundOutlined />
                  Расширенная аналитика
                </template>
              </a-tab-pane>
            </a-tabs>

            <div class="router-view-wrapper">
              <router-view />
            </div>
          </div>
        </a-layout-content>

        <a-layout-footer class="footer">
          Finance Tracker © 2025 | Построено с Vue 3, Pinia, Ant Design
        </a-layout-footer>
      </a-layout>
    </div>
  </a-config-provider>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ruRU from 'ant-design-vue/es/locale/ru_RU'
import ImportExport from './views/Dashboard/components/ImportExport.vue'
import { WalletOutlined, DashboardOutlined, BarChartOutlined, FundOutlined } from '@ant-design/icons-vue'
import { useTransactionStore } from './stores/transactionStore'
import { generateMockTransactions } from './mock/mockData'
import { transactionRepository } from './services/TransactionRepository'

const router = useRouter()
const route = useRoute()
const transactionStore = useTransactionStore()

const routeToTab: Record<string, string> = {
  Dashboard: 'dashboard',
  Analytics: 'analytics',
  AdvancedAnalytics: 'advanced',
}

const tabToRoute: Record<string, string> = {
  dashboard: 'Dashboard',
  analytics: 'Analytics',
  advanced: 'AdvancedAnalytics',
}

const activeTab = computed(() => {
  return routeToTab[route.name as string] || 'dashboard'
})

const handleTabChange = (key: string) => {
  const routeName = tabToRoute[key]
  if (routeName) {
    router.push({ name: routeName })
  }
}

onMounted(async () => {
  const existing = await transactionRepository.findAll()
  if (existing.length === 0) {
    const mockData = generateMockTransactions()
    for (const transaction of mockData) {
      await transactionRepository.create({
        type: transaction.type,
        category: transaction.category,
        amount: transaction.amount,
        date: transaction.date,
        comment: transaction.comment,
      })
    }
  }
  transactionStore.fetchTransactions()
})
</script>

<style>
* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: #f0f2f5;
}

#app {
  min-height: 100vh;
}
</style>

<style scoped>
.layout {
  min-height: 100vh;
  background: #f0f2f5;
}

.header {
  background: #001529;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
}

.title {
  color: white;
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
}

.content {
  padding: 20px;
  background: #f0f2f5;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
}

.container :deep(.ant-tabs-card > .ant-tabs-nav) {
  margin-bottom: 0;
}

.container :deep(.ant-tabs-card > .ant-tabs-nav .ant-tabs-tab) {
  background: #fff;
  border: 1px solid #d9d9d9;
  border-bottom: none;
  border-radius: 4px 4px 0 0;
  margin-right: 4px;
  padding: 8px 16px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.container :deep(.ant-tabs-card > .ant-tabs-nav .ant-tabs-tab:hover) {
  color: #1890ff;
}

.container :deep(.ant-tabs-card > .ant-tabs-nav .ant-tabs-tab-active) {
  background: #fff;
  border-color: #d9d9d9;
  color: #1890ff;
}

.container :deep(.ant-tabs-card .ant-tabs-content) {
  margin-top: -1px;
}

.container :deep(.ant-tabs-card .ant-tabs-content > .ant-tabs-tabpane) {
  background: #fff;
  padding: 20px;
  border: 1px solid #d9d9d9;
  border-radius: 0 4px 4px 4px;
}

.router-view-wrapper {
  background: #fff;
  padding: 20px;
  border: 1px solid #d9d9d9;
  border-top: none;
  border-radius: 0 4px 4px 4px;
  margin-top: -1px;
}

.footer {
  text-align: center;
  background: #fff;
  color: rgba(0, 0, 0, 0.65);
  padding: 16px;
  font-size: 14px;
  border-top: 1px solid #d9d9d9;
}

@media (max-width: 768px) {
  .header {
    padding: 0 16px;
  }

  .title {
    font-size: 16px;
  }

  .content {
    padding: 12px;
  }

  .container :deep(.ant-tabs-card .ant-tabs-content > .ant-tabs-tabpane) {
    padding: 12px;
  }
}
</style>
