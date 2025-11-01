<template>
  <div class="ag-grid-wrapper">
    <ErrorAlert
      v-if="transactionStore.error"
      title="Ошибка загрузки транзакций"
      :description="transactionStore.error"
      @close="transactionStore.clearError"
    />

    <div class="ag-toolbar">
      <div class="toolbar-left">
        <h3 class="toolbar-title">
          <UnorderedListOutlined class="title-icon" />
          Транзакции
        </h3>
        <div class="toolbar-stats">
          <span class="stat-item">Всего: {{ totalCount }}</span>
          <span class="stat-divider">|</span>
          <span class="stat-item success">Доходы: {{ incomeCount }}</span>
          <span class="stat-divider">|</span>
          <span class="stat-item danger">Расходы: {{ expenseCount }}</span>
        </div>
      </div>
      <div class="toolbar-right">
        <a-button @click="toggleFilters" :type="showFilters ? 'primary' : 'default'" class="toolbar-btn">
          <FilterOutlined />
          Фильтры
        </a-button>
        <a-button
          type="primary"
          @click="handleAdd"
          class="toolbar-btn toolbar-btn-primary"
          :loading="transactionStore.isLoading"
        >
          <PlusOutlined />
          Добавить
        </a-button>
      </div>
    </div>

    <transition name="slide-down">
      <div v-if="showFilters" class="ag-filters-panel">
        <div class="filter-row">
          <div class="filter-item">
            <label class="filter-label">Тип</label>
            <a-select v-model:value="filters.type" placeholder="Все типы" class="filter-input" allowClear>
              <a-select-option value="income">Доход</a-select-option>
              <a-select-option value="expense">Расход</a-select-option>
            </a-select>
          </div>
          <div class="filter-item">
            <label class="filter-label">Категория</label>
            <a-select
              v-model:value="filters.category"
              placeholder="Все категории"
              class="filter-input"
              allowClear
              :options="allCategoryOptions"
            />
          </div>
          <div class="filter-item">
            <label class="filter-label">От</label>
            <a-date-picker
              v-model:value="filters.dateFrom"
              format="DD.MM.YYYY"
              placeholder="Дата от"
              class="filter-input"
            />
          </div>
          <div class="filter-item">
            <label class="filter-label">До</label>
            <a-date-picker
              v-model:value="filters.dateTo"
              format="DD.MM.YYYY"
              placeholder="Дата до"
              class="filter-input"
            />
          </div>
          <div class="filter-item filter-item-search">
            <label class="filter-label">Поиск</label>
            <a-input v-model:value="filters.search" placeholder="Поиск..." class="filter-input" allow-clear>
              <template #prefix>
                <SearchOutlined />
              </template>
            </a-input>
          </div>
          <div class="filter-actions">
            <a-button type="primary" @click="handleFilter" :loading="transactionStore.isLoading" class="filter-btn"
              >Применить</a-button
            >
            <a-button @click="handleClearFilters" class="filter-btn">Сбросить</a-button>
          </div>
        </div>
      </div>
    </transition>

    <div class="ag-table-container">
      <a-spin :spinning="transactionStore.isLoading">
        <table class="ag-table">
          <thead class="ag-thead">
            <tr>
              <th
                v-for="header in table.getFlatHeaders()"
                :key="header.id"
                :style="{ width: header.getSize() + 'px' }"
                class="ag-th"
                @click="header.column.getToggleSortingHandler()?.($event)"
              >
                <div class="ag-th-content">
                  <span>{{ header.column.columnDef.header }}</span>
                  <span v-if="header.column.getCanSort()" class="sort-indicator">
                    <CaretUpOutlined v-if="header.column.getIsSorted() === 'asc'" class="sort-icon active" />
                    <CaretDownOutlined v-else-if="header.column.getIsSorted() === 'desc'" class="sort-icon active" />
                    <span v-else class="sort-icon-placeholder">⇅</span>
                  </span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="ag-tbody">
            <tr
              v-for="row in table.getRowModel().rows"
              :key="row.id"
              class="ag-tr"
              :class="getRowClass(row.original.type)"
            >
              <td v-for="cell in row.getVisibleCells()" :key="cell.id" class="ag-td">
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </td>
            </tr>
            <tr v-if="!hasTransactions" class="ag-empty-row">
              <td :colspan="table.getAllColumns().length" class="ag-empty-cell">
                <a-empty description="Нет транзакций" />
              </td>
            </tr>
          </tbody>
        </table>
      </a-spin>
    </div>

    <div class="ag-pagination">
      <div class="pagination-info">Показано {{ displayedCount }} из {{ totalCount }} записей</div>
      <div class="pagination-controls">
        <a-button
          :disabled="!table.getCanPreviousPage()"
          @click="table.previousPage()"
          class="pagination-btn"
          size="small"
        >
          Назад
        </a-button>
        <span class="pagination-page"> Страница {{ currentPage }} из {{ totalPages }} </span>
        <a-button :disabled="!table.getCanNextPage()" @click="table.nextPage()" class="pagination-btn" size="small">
          Вперёд
        </a-button>
      </div>
    </div>

    <TransactionForm v-model:open="formVisible" :transaction="selectedTransaction" @success="handleFormSuccess" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Modal } from 'ant-design-vue'
import {
  useVueTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  FlexRender,
  type SortingState,
} from '@tanstack/vue-table'
import { useTransactionStore } from '@/stores/transactionStore'
import { ErrorAlert } from '@/components/shared'
import type { Transaction, TransactionFilters } from '@/types/transaction.types'
import type { TransactionCategory } from '@/types/transaction.types'
import type { Dayjs } from 'dayjs'
import TransactionForm from './TransactionForm.vue'
import { formatCurrency } from '@/utils/formatters'
import { categoryLabels, getIncomeCategoriesOptions, getExpenseCategoriesOptions } from '@/utils/categoryConfig'
import {
  PlusOutlined,
  FilterOutlined,
  UnorderedListOutlined,
  SearchOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
} from '@ant-design/icons-vue'
import { createTableColumns } from '../composables/useTransactionTableColumns'

interface FilterForm {
  type?: string
  category?: string
  dateFrom?: Dayjs
  dateTo?: Dayjs
  search?: string
}

const transactionStore = useTransactionStore()
const showFilters = ref(false)
const formVisible = ref(false)
const selectedTransaction = ref<Transaction | null>(null)
const sorting = ref<SortingState>([])
const filters = ref<FilterForm>({})

const transactions = computed(() => transactionStore.transactions)
const totalCount = computed(() => transactions.value.length)
const incomeCount = computed(() => transactions.value.filter((t) => t.type === 'income').length)
const expenseCount = computed(() => transactions.value.filter((t) => t.type === 'expense').length)
const hasTransactions = computed(() => transactions.value.length > 0)

const allCategoryOptions = computed(() => [...getIncomeCategoriesOptions(), ...getExpenseCategoriesOptions()])

const columns = createTableColumns({
  onEdit: handleEdit,
  onDelete: confirmDelete,
})

const table = useVueTable({
  get data() {
    return transactions.value
  },
  columns,
  state: {
    get sorting() {
      return sorting.value
    },
  },
  onSortingChange: (updaterOrValue) => {
    sorting.value = typeof updaterOrValue === 'function' ? updaterOrValue(sorting.value) : updaterOrValue
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  initialState: {
    pagination: {
      pageSize: 10,
    },
  },
})

const displayedCount = computed(() => table.getRowModel().rows.length)
const currentPage = computed(() => table.getState().pagination.pageIndex + 1)
const totalPages = computed(() => table.getPageCount())

const toggleFilters = () => {
  showFilters.value = !showFilters.value
}

const getRowClass = (type: string) => ({
  'income-row': type === 'income',
  'expense-row': type === 'expense',
})

const handleAdd = () => {
  selectedTransaction.value = null
  formVisible.value = true
}

function handleEdit(transaction: Transaction) {
  selectedTransaction.value = transaction
  formVisible.value = true
}

function confirmDelete(transaction: Transaction) {
  Modal.confirm({
    title: 'Подтверждение удаления',
    content: `Вы действительно хотите удалить транзакцию "${transaction.comment || categoryLabels[transaction.category]}" на сумму ${formatCurrency(transaction.amount)}?`,
    okText: 'Удалить',
    okType: 'danger',
    cancelText: 'Отмена',
    onOk: async () => {
      await handleDelete(transaction.id)
    },
  })
}

const handleDelete = async (id: string) => {
  await transactionStore.deleteTransaction(id)
}

const handleFilter = async () => {
  const filterParams: TransactionFilters = {}

  if (filters.value.type) {
    filterParams.type = filters.value.type as any
  }

  if (filters.value.category) {
    filterParams.category = filters.value.category as TransactionCategory
  }

  if (filters.value.dateFrom) {
    filterParams.dateFrom = filters.value.dateFrom.toISOString()
  }

  if (filters.value.dateTo) {
    filterParams.dateTo = filters.value.dateTo.toISOString()
  }

  if (filters.value.search) {
    filterParams.search = filters.value.search
  }

  await transactionStore.fetchTransactions(filterParams)
}

const handleClearFilters = () => {
  filters.value = {}
  transactionStore.fetchTransactions({})
}

const handleFormSuccess = () => {
  transactionStore.fetchTransactions()
}

onMounted(() => {
  transactionStore.fetchTransactions()
})
</script>

<style scoped src="@/assets/styles/dashboard/transaction-list.css"></style>
