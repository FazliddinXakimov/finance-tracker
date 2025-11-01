<template>
  <a-modal
    v-model:open="visible"
    :title="modalTitle"
    :confirm-loading="loading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    width="600px"
    :okText="submitButtonText"
    cancelText="Отмена"
    :okButtonProps="{ class: 'submit-button' }"
    :cancelButtonProps="{ class: 'cancel-button' }"
    class="transaction-modal"
  >
    <a-form :model="formData" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
      <a-form-item label="Тип" name="type" :validate-status="errors.type ? 'error' : ''" :help="errors.type">
        <a-radio-group v-model:value="type" @change="handleTypeChange">
          <a-radio-button value="income">Доход</a-radio-button>
          <a-radio-button value="expense">Расход</a-radio-button>
        </a-radio-group>
      </a-form-item>

      <a-form-item
        label="Категория"
        name="category"
        :validate-status="submitted && errors.category ? 'error' : ''"
        :help="submitted && errors.category ? errors.category : ''"
      >
        <a-select v-model:value="category" placeholder="Выберите категорию" :options="categoryOptions" />
      </a-form-item>

      <a-form-item label="Сумма" name="amount" :validate-status="errors.amount ? 'error' : ''" :help="errors.amount">
        <a-input-number
          v-model:value="amount"
          :min="0"
          :precision="2"
          style="width: 100%"
          placeholder="0.00"
          @input="handleAmountInput"
        />
      </a-form-item>

      <a-form-item label="Дата" name="date" :validate-status="errors.date ? 'error' : ''" :help="errors.date">
        <a-date-picker v-model:value="dateValue" style="width: 100%" format="DD.MM.YYYY" placeholder="Выберите дату" />
      </a-form-item>

      <a-form-item
        label="Комментарий"
        name="comment"
        :validate-status="errors.comment ? 'error' : ''"
        :help="errors.comment"
      >
        <a-textarea v-model:value="comment" :rows="4" placeholder="Необязательно" :maxlength="500" show-count />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useTransactionStore } from '@/stores/transactionStore'
import type { Transaction, TransactionType, TransactionCategory } from '@/types/transaction.types'
import { getCategoriesByType } from '@/utils/categoryConfig'
import dayjs, { type Dayjs } from 'dayjs'
import { transactionSchema } from '@/utils/validators'

interface Props {
  open: boolean
  transaction?: Transaction | null
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'success'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const transactionStore = useTransactionStore()
const loading = ref(false)
const submitted = ref(false)

const visible = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value),
})

const isEdit = computed(() => !!props.transaction)
const modalTitle = computed(() => (isEdit.value ? 'Редактировать транзакцию' : 'Новая транзакция'))
const submitButtonText = computed(() => (isEdit.value ? 'Сохранить' : 'Создать'))

const { errors, validate, resetForm, setFieldValue } = useForm({
  validationSchema: toTypedSchema(transactionSchema),
  initialValues: {
    type: 'expense' as TransactionType,
    category: undefined as TransactionCategory | undefined,
    amount: 0,
    date: dayjs().toISOString(),
    comment: '',
  },
})

const { value: type } = useField<TransactionType>('type')
const { value: category } = useField<TransactionCategory | undefined>('category')
const { value: amount } = useField<number>('amount')
const { value: date } = useField<string>('date')
const { value: comment } = useField<string>('comment')

const dateValue = computed({
  get: () => (date.value ? dayjs(date.value) : null),
  set: (val: Dayjs | null) => {
    date.value = val ? val.toISOString() : dayjs().toISOString()
  },
})

const formData = computed(() => ({
  type: type.value,
  category: category.value,
  amount: amount.value,
  date: dateValue.value,
  comment: comment.value,
}))

const categoryOptions = computed(() => getCategoriesByType(type.value))

const handleAmountInput = (value: any) => {
  // a-input-number already prevents non-numeric input
  // This is an extra safeguard to ensure only numbers are allowed
  if (value !== null && value !== undefined) {
    const numValue = Number(value)
    if (!isNaN(numValue)) {
      amount.value = numValue
    }
  }
}

const handleTypeChange = () => {
  category.value = undefined
}

const handleSubmit = async () => {
  submitted.value = true
  const result = await validate()

  if (!result.valid || !category.value) {
    return
  }

  loading.value = true

  try {
    const dto = {
      type: type.value,
      category: category.value as TransactionCategory,
      amount: amount.value,
      date: date.value,
      comment: comment.value || undefined,
    }

    if (isEdit.value && props.transaction) {
      await transactionStore.updateTransaction({
        id: props.transaction.id,
        ...dto,
      })
    } else {
      await transactionStore.createTransaction(dto)
    }

    emit('success')
    handleCancel()
  } catch (error) {
    console.error('Form submission error:', error)
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  resetForm()
  submitted.value = false
  emit('update:open', false)
}

watch(
  () => props.transaction,
  (transaction) => {
    if (transaction) {
      setFieldValue('type', transaction.type)
      setFieldValue('category', transaction.category)
      setFieldValue('amount', transaction.amount)
      setFieldValue('date', transaction.date)
      setFieldValue('comment', transaction.comment || '')
    } else {
      resetForm()
    }
  },
  { immediate: true }
)

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen && !props.transaction) {
      resetForm()
    }
  }
)
</script>

<style scoped src="@/assets/styles/dashboard/transaction-form.css"></style>
