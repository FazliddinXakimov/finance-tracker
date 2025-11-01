<template>
  <a-row :gutter="[16, 16]" class="balance-panel">
    <a-col :xs="24" :sm="8">
      <div class="stat-card stat-income">
        <div class="stat-header">
          <span class="stat-label">Доходы</span>
          <ArrowUpOutlined class="stat-icon" />
        </div>
        <div class="stat-value">{{ formatCurrency(balance.totalIncome) }}</div>
        <div class="stat-footer">За весь период</div>
      </div>
    </a-col>

    <a-col :xs="24" :sm="8">
      <div class="stat-card stat-expense">
        <div class="stat-header">
          <span class="stat-label">Расходы</span>
          <ArrowDownOutlined class="stat-icon" />
        </div>
        <div class="stat-value">{{ formatCurrency(balance.totalExpense) }}</div>
        <div class="stat-footer">За весь период</div>
      </div>
    </a-col>

    <a-col :xs="24" :sm="8">
      <div class="stat-card stat-balance" :class="{ 'stat-negative': isNegativeBalance }">
        <div class="stat-header">
          <span class="stat-label">Чистый баланс</span>
          <WalletOutlined class="stat-icon" />
        </div>
        <div class="stat-value">{{ formatCurrency(balance.netBalance) }}</div>
        <div class="stat-footer">{{ balanceStatusText }}</div>
      </div>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTransactionStore } from '@/stores/transactionStore'
import { formatCurrency } from '@/utils/formatters'
import { ArrowUpOutlined, ArrowDownOutlined, WalletOutlined } from '@ant-design/icons-vue'

const transactionStore = useTransactionStore()

const balance = computed(() => transactionStore.balance)
const isNegativeBalance = computed(() => balance.value.netBalance < 0)
const balanceStatusText = computed(() => (isNegativeBalance.value ? 'Отрицательный' : 'Положительный'))
</script>

<style scoped src="@/assets/styles/dashboard/balance-panel.css"></style>
