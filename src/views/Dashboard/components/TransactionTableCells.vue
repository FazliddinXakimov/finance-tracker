<template>
  <div v-if="cellType === 'type'" class="type-cell">
    <span :class="`type-badge ${value === 'income' ? 'type-income' : 'type-expense'}`">
      <ArrowUpOutlined v-if="value === 'income'" class="type-icon" />
      <ArrowDownOutlined v-else class="type-icon" />
      <span>{{ value === 'income' ? 'Доход' : 'Расход' }}</span>
    </span>
  </div>

  <span v-else-if="cellType === 'category'" class="category-badge" :style="getCategoryStyle">
    {{ categoryLabels[props.value as TransactionCategory] }}
  </span>

  <span
    v-else-if="cellType === 'amount'"
    :class="`amount-cell ${transactionType === 'income' ? 'amount-income' : 'amount-expense'}`"
  >
    {{ transactionType === 'income' ? '+' : '-' }}{{ formatCurrency(value as number) }}
  </span>

  <div v-else-if="cellType === 'actions'" class="actions-cell">
    <button class="action-btn action-btn-primary" :title="'Редактировать'" @click="handleEdit">
      <EditOutlined />
    </button>
    <button class="action-btn action-btn-danger" :title="'Удалить'" @click="handleDelete">
      <DeleteOutlined />
    </button>
  </div>

  <span v-else-if="cellType === 'comment'">
    {{ value || '—' }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Transaction, TransactionCategory } from '@/types/transaction.types'
import { formatCurrency } from '@/utils/formatters'
import { categoryLabels, categoryColors } from '@/utils/categoryConfig'
import { ArrowUpOutlined, ArrowDownOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import '@/assets/styles/dashboard/transaction-cells.css'
import '@/assets/styles/dashboard/transaction-list.css'

interface Props {
  cellType: 'type' | 'category' | 'amount' | 'actions' | 'comment' | 'date'
  value?: TransactionCategory | string | number
  transaction?: Transaction
  transactionType?: 'income' | 'expense'
  onEdit?: (transaction: Transaction) => void
  onDelete?: (transaction: Transaction) => void
}

const props = withDefaults(defineProps<Props>(), {})

const getCategoryStyle = computed(() => {
  const category = props.value as TransactionCategory
  return {
    background: categoryColors[category] + '15',
    color: categoryColors[category],
    borderColor: categoryColors[category],
  }
})

const handleEdit = () => {
  if (props.transaction && props.onEdit) {
    props.onEdit(props.transaction)
  }
}

const handleDelete = () => {
  if (props.transaction && props.onDelete) {
    props.onDelete(props.transaction)
  }
}
</script>
