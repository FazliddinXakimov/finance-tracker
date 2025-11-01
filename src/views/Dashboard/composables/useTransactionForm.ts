import { ref, computed, watch } from 'vue'
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { transactionSchema } from '@/utils/validators'
import type { Transaction, TransactionType, TransactionCategory, CreateTransactionDto } from '@/types/transaction.types'
import { getCategoriesByType } from '@/utils/categoryConfig'
import dayjs, { type Dayjs } from 'dayjs'

export function useTransactionForm(transaction?: Transaction | null) {
  const isEdit = computed(() => !!transaction)

  const { errors, validate, resetForm, setFieldValue } = useForm({
    validationSchema: toTypedSchema(transactionSchema),
    initialValues: {
      type: transaction?.type || ('income' as TransactionType),
      category: transaction?.category,
      amount: transaction?.amount || 0,
      date: transaction?.date || dayjs().toISOString(),
      comment: transaction?.comment || '',
    },
  })

  const { value: type } = useField<TransactionType>('type')
  const { value: category } = useField<TransactionCategory>('category')
  const { value: amount } = useField<number>('amount')
  const { value: date } = useField<string>('date')
  const { value: comment } = useField<string>('comment')

  const dateValue = ref<Dayjs | undefined>(transaction?.date ? dayjs(transaction.date) : dayjs())

  const categoryOptions = computed(() => {
    return getCategoriesByType(type.value).map((cat) => ({
      value: cat.value,
      label: cat.label,
    }))
  })

  watch(type, (newType) => {
    const categories = getCategoriesByType(newType)
    const isValidCategory = categories.some((cat) => cat.value === category.value)
    if (!isValidCategory) {
      setFieldValue('category', undefined)
    }
  })

  watch(dateValue, (newDate) => {
    if (newDate) {
      setFieldValue('date', newDate.toISOString())
    }
  })

  const getFormData = (): CreateTransactionDto => {
    return {
      type: type.value,
      category: category.value,
      amount: amount.value,
      date: date.value,
      comment: comment.value,
    }
  }

  const handleTypeChange = () => {}

  const reset = () => {
    resetForm()
    dateValue.value = dayjs()
  }

  return {
    type,
    category,
    amount,
    date,
    comment,
    dateValue,
    errors,

    isEdit,
    categoryOptions,

    validate,
    resetForm: reset,
    getFormData,
    handleTypeChange,
    setFieldValue,
  }
}
