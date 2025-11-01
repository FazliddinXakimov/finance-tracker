<template>
  <div class="period-selector">
    <label v-if="label" class="period-label">{{ label }}</label>
    <a-radio-group v-model:value="selectedValue" :size="size" button-style="solid">
      <a-radio-button v-for="option in periodOptions" :key="option.value" :value="option.value">
        {{ option.label }}
      </a-radio-button>
    </a-radio-group>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Period, PeriodOption } from '@/views/AdvancedAnalytics/composables'

interface Props {
  modelValue: Period
  periodOptions: PeriodOption[]
  label?: string
  size?: 'small' | 'middle' | 'large'
}

interface Emits {
  (e: 'update:modelValue', value: Period): void
}

const props = withDefaults(defineProps<Props>(), {
  size: 'small',
})

const emit = defineEmits<Emits>()

const selectedValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})
</script>

<style scoped>
.period-selector {
  display: flex;
  align-items: center;
  gap: 12px;
}

.period-label {
  font-size: 14px;
  color: #595959;
  font-weight: 500;
}

@media (max-width: 576px) {
  .period-selector {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .period-label {
    font-size: 13px;
  }
}
</style>
