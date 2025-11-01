import { h } from 'vue'
import { createColumnHelper } from '@tanstack/vue-table'
import type { Transaction } from '@/types/transaction.types'
import { formatDate } from '@/utils/formatters'
import TransactionTableCells from '@/views/Dashboard/components/TransactionTableCells.vue'

interface ColumnActions {
  onEdit: (transaction: Transaction) => void
  onDelete: (transaction: Transaction) => void
}

export const createTableColumns = ({ onEdit, onDelete }: ColumnActions) => {
  const columnHelper = createColumnHelper<Transaction>()

  return [
    columnHelper.accessor('date', {
      header: 'Дата',
      cell: (info) => formatDate(info.getValue()),
      size: 120,
    }),
    columnHelper.accessor('type', {
      header: 'Тип',
      cell: (info) =>
        h(TransactionTableCells, {
          cellType: 'type',
          value: info.getValue(),
        }),
      size: 120,
    }),
    columnHelper.accessor('category', {
      header: 'Категория',
      cell: (info) =>
        h(TransactionTableCells, {
          cellType: 'category',
          value: info.getValue(),
        }),
      size: 150,
    }),
    columnHelper.accessor('amount', {
      header: 'Сумма',
      cell: (info) =>
        h(TransactionTableCells, {
          cellType: 'amount',
          value: info.getValue(),
          transactionType: info.row.original.type,
        }),
      size: 150,
    }),
    columnHelper.accessor('comment', {
      header: 'Комментарий',
      cell: (info) => info.getValue() || '—',
      size: 300,
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Действия',
      cell: (info) =>
        h(TransactionTableCells, {
          cellType: 'actions',
          transaction: info.row.original,
          onEdit,
          onDelete,
        }),
      size: 120,
    }),
  ]
}
